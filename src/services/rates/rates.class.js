import { MongoDBService } from '@feathersjs/mongodb'
import { Timestamp } from 'mongodb';
import fetch from 'node-fetch'; 

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class RatesService extends MongoDBService {

  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async getFiatRates(params) {
    const baseCurrency = params.query?.baseCurrency || 'USD';

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    return response.json();
  }

  async getCryptoRates() {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd,eur,mxn'
    );
    return response.json();
  }

  async saveFiatRates(params) {
    try {
      const baseCurrency = params.query?.baseCurrency || 'USD';
      
      const apiData = await this.getFiatRates(params);
      
      const timestamp = new Date(apiData.time_last_updated * 1000);
      const createdAt = new Date();
      
      const fiatRateDoc = {
        base_currency: apiData.base,
        date: apiData.date,
        timestamp: timestamp.toISOString(),
        time_last_updated: apiData.time_last_updated,
        rates: apiData.rates,
        provider: "exchangerate-api",
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString() 
      };
      
      const fiatRatesService = this.app.service('fiat-rates');
      const result = await fiatRatesService.create(fiatRateDoc, {});
      
      return {
        success: true,
        insertedId: result._id || result.id,
        base_currency: baseCurrency,
        message: "Tasas fiat guardadas correctamente en el servicio"
      };
      
    } catch (error) {
      console.error('Error en saveFiatRates:', error);
      throw new Error(`Error ejecutando saveFiatRates: ${error.message}`);
    }
  }

  async saveCryptoRates(params) {
    try {
      const cryptoData = await this.getCryptoRates(params);
      
      const timestamp = new Date();
      const timestampISO = timestamp.toISOString();
      
      const cryptoRatesService = this.app.service('crypto-rates');
      
      const cryptoDocs = Object.entries(cryptoData).map(([cryptoId, rates]) => ({
        crypto_id: cryptoId,
        name: this.getCryptoName(cryptoId),
        symbol: this.getCryptoSymbol(cryptoId),
        timestamp: timestampISO, 
        rates: rates,
        provider: "coingecko",
        created_at: timestampISO 
      }));
      
      const results = await Promise.all(
        cryptoDocs.map(doc => cryptoRatesService.create(doc, {}))
      );
      
      return {
        success: true,
        insertedCount: results.length,
        cryptos: Object.keys(cryptoData),
        message: "Tasas crypto guardadas correctamente en el servicio"
      };
      
    } catch (error) {
      console.error('Error en saveCryptoRates:', error);
      throw new Error(`Error ejecutando saveCryptoRates: ${error.message}`);
    }
  }

  getCryptoName(cryptoId) {
    const names = {
      bitcoin: "Bitcoin",
      ethereum: "Ethereum", 
      cardano: "Cardano"
    };
    return names[cryptoId] || cryptoId;
  }

  getCryptoSymbol(cryptoId) {
    const symbols = {
      bitcoin: "BTC",
      ethereum: "ETH",
      cardano: "ADA"
    };
    return symbols[cryptoId] || cryptoId.toUpperCase();
  }
}

export const getOptions = app => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('rates'))
  }
}