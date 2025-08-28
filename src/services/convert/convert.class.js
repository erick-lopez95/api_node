import { MongoDBService } from '@feathersjs/mongodb'
import Joi from 'joi'

export class ConvertService extends MongoDBService {
  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async create(data, params) {
    try {
      // 1. Validar con Joi
      const validationSchema = Joi.object({
        from: Joi.string().required()
          .messages({
            'any.required': 'La moneda de origen es requerida'
          }),
        to: Joi.string().required()
          .messages({
            'any.required': 'La moneda de destino es requerida'
          }),
        amount: Joi.number().positive().required()
          .messages({
            'number.positive': 'El monto debe ser un número positivo',
            'any.required': 'El monto es requerido'
          })
      });

      const { error, value } = validationSchema.validate(data);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }

      const { from, to, amount } = value;

      // 2. Validar que las monedas sean diferentes
      if (from === to) {
        throw new Error('Las monedas de origen y destino no pueden ser iguales');
      }

      // 3. Determinar el tipo de conversión y obtener tasa
      let rate, converted_amount;
      
      if (this.isCryptoCurrency(from) && this.isFiatCurrency(to)) {
        // Crypto → Fiat
        rate = await this.getCryptoToFiatRate(from, to);
        converted_amount = amount * rate;
        
      } else if (this.isFiatCurrency(from) && this.isCryptoCurrency(to)) {
        // Fiat → Crypto
        rate = await this.getFiatToCryptoRate(from, to);
        converted_amount = amount / rate;
        
      } else if (this.isCryptoCurrency(from) && this.isCryptoCurrency(to)) {
        // Crypto → Crypto
        rate = await this.getCryptoToCryptoRate(from, to);
        converted_amount = amount * rate;
        
      } else if (this.isFiatCurrency(from) && this.isFiatCurrency(to)) {
        // Fiat → Fiat (ya existente)
        rate = await this.getExchangeRate(from, to);
        converted_amount = amount * rate;
        
      } else {
        throw new Error('Tipo de conversión no soportado');
      }
      
      // 4. Preparar documento para guardar
      const conversionDoc = {
        from_currency: from.toUpperCase(),
        to_currency: to.toUpperCase(),
        amount: amount,
        converted_amount: parseFloat(converted_amount.toFixed(8)), // Más decimales para crypto
        rate: parseFloat(rate.toFixed(8)),
        timestamp: new Date().toISOString(),
        provider: 'internal',
        conversion_type: this.getConversionType(from, to)
      };
      
      // 5. Guardar usando el MongoDBService padre
      const savedDoc = await super.create(conversionDoc, params);
      
      // 6. Retornar respuesta al cliente
      return {
        success: true,
        conversion: {
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          amount: amount,
          converted_amount: parseFloat(converted_amount.toFixed(8)),
          rate: parseFloat(rate.toFixed(8)),
          timestamp: savedDoc.timestamp,
          type: conversionDoc.conversion_type
        }
      };
      
    } catch (error) {
      console.error('Error en convert service:', error);
      throw new Error(error.message);
    }
  }

  // Helper methods para determinar tipos de monedas
  isFiatCurrency(currency) {
    const fiatCurrencies = ['USD', 'EUR', 'MXN', 'GBP', 'JPY', 'CAD', 'AUD'];
    return fiatCurrencies.includes(currency.toUpperCase());
  }

  isCryptoCurrency(currency) {
    // Mapeo de símbolos a IDs de crypto
    const cryptoMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum', 
      'ADA': 'cardano',
      'BNB': 'binancecoin',
      'XRP': 'ripple',
      'SOL': 'solana',
      'DOT': 'polkadot'
    };
    
    const upperCurrency = currency.toUpperCase();
    return cryptoMap[upperCurrency] !== undefined;
  }

  getCryptoIdFromSymbol(symbol) {
    const cryptoMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'ADA': 'cardano',
      'BNB': 'binancecoin', 
      'XRP': 'ripple',
      'SOL': 'solana',
      'DOT': 'polkadot'
    };
    
    return cryptoMap[symbol.toUpperCase()];
  }

  getSymbolFromCryptoId(cryptoId) {
    const cryptoMap = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'cardano': 'ADA',
      'binancecoin': 'BNB',
      'ripple': 'XRP', 
      'solana': 'SOL',
      'polkadot': 'DOT'
    };
    
    return cryptoMap[cryptoId.toLowerCase()];
  }

  getConversionType(from, to) {
    if (this.isCryptoCurrency(from) && this.isFiatCurrency(to)) {
      return 'crypto_to_fiat';
    } else if (this.isFiatCurrency(from) && this.isCryptoCurrency(to)) {
      return 'fiat_to_crypto';
    } else if (this.isCryptoCurrency(from) && this.isCryptoCurrency(to)) {
      return 'crypto_to_crypto';
    } else {
      return 'fiat_to_fiat';
    }
  }

  // Métodos para obtener tasas de diferentes tipos
  async getCryptoToFiatRate(crypto, fiat) {
    try {
      const cryptoRatesService = this.app.service('crypto-rates');
      
      // Convertir símbolo a ID de crypto (ej: BTC → bitcoin)
      const cryptoId = this.getCryptoIdFromSymbol(crypto);
      if (!cryptoId) {
        throw new Error(`Criptomoneda ${crypto} no reconocida`);
      }
      
      const latestRates = await cryptoRatesService.find({
        query: {
          crypto_id: cryptoId, // Usar el ID (bitcoin, ethereum)
          $sort: { timestamp: -1 },
          $limit: 1
        }
      });
      
      if (latestRates.data.length === 0) {
        throw new Error(`No se encontraron tasas para ${crypto}`);
      }
      
      const rates = latestRates.data[0].rates;
      const fiatLower = fiat.toLowerCase();
      
      if (!rates[fiatLower]) {
        throw new Error(`Tasa de conversión de ${crypto} a ${fiat} no disponible`);
      }
      
      return rates[fiatLower];
      
    } catch (error) {
      console.error('Error obteniendo tasa crypto a fiat:', error);
      throw new Error(`Error al obtener tasa: ${error.message}`);
    }
  }

  async getFiatToCryptoRate(fiat, crypto) {
    try {
      // Para fiat → crypto, usamos 1/tasa (inverso)
      const rate = await this.getCryptoToFiatRate(crypto, fiat);
      return 1 / rate;
      
    } catch (error) {
      console.error('Error obteniendo tasa fiat a crypto:', error);
      throw new Error(`Error al obtener tasa: ${error.message}`);
    }
  }

  async getCryptoToCryptoRate(fromCrypto, toCrypto) {
    try {
      // Crypto → Crypto: Convertir through USD
      const fromCryptoToUsd = await this.getCryptoToFiatRate(fromCrypto, 'USD');
      const toCryptoToUsd = await this.getCryptoToFiatRate(toCrypto, 'USD');
      
      return fromCryptoToUsd / toCryptoToUsd;
      
    } catch (error) {
      console.error('Error obteniendo tasa crypto a crypto:', error);
      throw new Error(`Error al obtener tasa: ${error.message}`);
    }
  }

  async getExchangeRate(fromCurrency, toCurrency) {
    try {
      const fiatRatesService = this.app.service('fiat-rates');
      const latestRates = await fiatRatesService.find({
        query: {
          base_currency: fromCurrency,
          $sort: { timestamp: -1 },
          $limit: 1
        }
      });
      
      if (latestRates.data.length === 0) {
        throw new Error(`No se encontraron tasas para ${fromCurrency}`);
      }
      
      const rates = latestRates.data[0].rates;
      
      if (!rates[toCurrency]) {
        throw new Error(`Tasa de conversión de ${fromCurrency} a ${toCurrency} no disponible`);
      }
      
      return rates[toCurrency];
      
    } catch (error) {
      console.error('Error obteniendo tasa de cambio:', error);
      throw new Error(`Error al obtener tasa de cambio: ${error.message}`);
    }
  }
}

export const getOptions = app => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('conversions'))
  }
}