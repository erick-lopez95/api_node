API de Conversión de Divisas y Generación de Reportes
Una API robusta construida con Node.js, Feathers.js y MongoDB que proporciona conversión de divisas, generación de reportes PDF y integración con colas de mensajes.

Características
✅ Conversión de divisas en tiempo real (USD, EUR, MXN, BTC, ETH)

✅ Generación de reportes PDF automáticos

✅ Integración con RabbitMQ para procesamiento asíncrono

✅ Validación de datos con Joi

✅ Tests automatizados con Jest

✅ Arquitectura escalable y mantenible

Instalación y Configuración

Prerrequisitos

Node.js 18+ 
MongoDB 5+
RabbitMQ

1. Clonar e instalar dependencias

git clone <tu-repositorio>
cd api_node
npm install

2. Variables de Entorno
Crea un archivo .env en la raíz:

# Servidor
PORT=3030
NODE_ENV=development
HOST=localhost

# MongoDB
MONGODB_URI=mongodb://localhost:27017/"currency_api"

# RabbitMQ (Opcional)
RABBITMQ_URL=amqp://localhost:5672

# APIs Externas
FIAT_API_URL=https://api.exchangerate-api.com/v4/latest
CRYPTO_API_URL=https://api.coingecko.com/api/v3/simple/price

3. Inicializar Base de Datos

# MongoDB debe estar ejecutándose
sudo systemctl start mongod
# o
mongod

4. Ejecutar la aplicación

# Desarrollo
npm run dev

# Producción
npm start

Documentación de la API

# Endpoints Principales

1. Conversión de Divisas

# crytpo -> fiat

POST http://localhost:3030/convert

body:

{
  "from": "BTC",
  "to": "USD",
  "amount": 0.5
}

respuesta:

{
    "success": true,
    "conversion": {
        "from": "BTC",
        "to": "USD",
        "amount": 0.5,
        "converted_amount": 53923.5,
        "rate": 107847,
        "timestamp": "2025-08-29T21:15:41.759Z",
        "type": "crypto_to_fiat"
    }
}

# fiat -> crypto

POST http://localhost:3030/convert

body:

{
  "from": "USD",
  "to": "ETH", 
  "amount": 1000
}

respuesta:

{
    "success": true,
    "conversion": {
        "from": "USD",
        "to": "ETH",
        "amount": 1000,
        "converted_amount": 4334710,
        "rate": 0.0002307,
        "timestamp": "2025-08-29T21:15:51.008Z",
        "type": "fiat_to_crypto"
    }
}

# crypto -> crypto

POST http://localhost:3030/convert

body: 

{
  "from": "BTC",
  "to": "ETH",
  "amount": 1
}

respuesta

{
    "success": true,
    "conversion": {
        "from": "BTC",
        "to": "ETH",
        "amount": 1,
        "converted_amount": 24.87986509,
        "rate": 24.87986509,
        "timestamp": "2025-08-29T21:15:58.365Z",
        "type": "crypto_to_crypto"
    }
}

# fiat -> fiat

POST http://localhost:3030/convert

body: 

{
  "from": "USD",
  "to": "MXN",
  "amount": 100
}

respuesta:

{
    "success": true,
    "conversion": {
        "from": "USD",
        "to": "MXN",
        "amount": 100,
        "converted_amount": 1865,
        "rate": 18.65,
        "timestamp": "2025-08-29T21:16:06.132Z",
        "type": "fiat_to_fiat"
    }
}

2. Registro y Manipulacion de las tasas de conversion

# Guarda fiat

GET http://localhost:3030/rates?_method=saveFiatRates

params:

_method = saveFiatRates

respuesta:

{
    "success": true,
    "insertedId": "68b2183eb2507a7abb4da8fd",
    "base_currency": "USD",
    "message": "Tasas fiat guardadas correctamente en el servicio"
}

# Consultar fiat

GET http://localhost:3030/fiat-rates?base_currency=USD

params:

base_currency = USD

respuesta:

{
    "total": 2,
    "data": [
        {
            "_id": "68b0b06287d12397d3353655",
            "base_currency": "USD",
            "date": "2025-08-28",
            "timestamp": "2025-08-28T00:00:01.000Z",
            "time_last_updated": 1756339201,
            "rates": {
                "USD": 1,
                "AED": 3.67,
                "AFN": 68.49,
                "ALL": 83.97,
                "AMD": 382.06,
                "ANG": 1.79,
                "AOA": 918.95,
                "ARS": 1359.42,
                "AUD": 1.54,
                "AWG": 1.79,
                "AZN": 1.7,
                "BAM": 1.68,
                "BBD": 2,
                "BDT": 121.78,
                "BGN": 1.68,
                "BHD": 0.376,
                "BIF": 2976.3,
                "BMD": 1,
                "BND": 1.29,
                "BOB": 6.93,
                "BRL": 5.43,
                "BSD": 1,
                "BTN": 87.73,
                "BWP": 13.67,
                "BYN": 3.28,
                "BZD": 2,
                "CAD": 1.38,
                "CDF": 2893.28,
                "CHF": 0.803,
                "CLP": 966.63,
                "CNY": 7.16,
                "COP": 4058.06,
                "CRC": 503.47,
                "CUP": 24,
                "CVE": 94.81,
                "CZK": 21.11,
                "DJF": 177.72,
                "DKK": 6.41,
                "DOP": 62.79,
                "DZD": 130.1,
                "EGP": 48.64,
                "ERN": 15,
                "ETB": 141.03,
                "EUR": 0.86,
                "FJD": 2.27,
                "FKP": 0.742,
                "FOK": 6.41,
                "GBP": 0.742,
                "GEL": 2.7,
                "GGP": 0.742,
                "GHS": 11.33,
                "GIP": 0.742,
                "GMD": 72.88,
                "GNF": 8680.1,
                "GTQ": 7.66,
                "GYD": 209.01,
                "HKD": 7.79,
                "HNL": 26.2,
                "HRK": 6.48,
                "HTG": 130.75,
                "HUF": 341.29,
                "IDR": 16394.36,
                "ILS": 3.34,
                "IMP": 0.742,
                "INR": 87.73,
                "IQD": 1309.7,
                "IRR": 42370.6,
                "ISK": 123.31,
                "JEP": 0.742,
                "JMD": 160,
                "JOD": 0.709,
                "JPY": 147.53,
                "KES": 129.21,
                "KGS": 87.33,
                "KHR": 4009.55,
                "KID": 1.54,
                "KMF": 423.03,
                "KRW": 1394.28,
                "KWD": 0.306,
                "KYD": 0.833,
                "KZT": 538.57,
                "LAK": 21710.24,
                "LBP": 89500,
                "LKR": 302.12,
                "LRD": 200.78,
                "LSL": 17.71,
                "LYD": 5.42,
                "MAD": 9.06,
                "MDL": 16.6,
                "MGA": 4438.89,
                "MKD": 52.91,
                "MMK": 2100.89,
                "MNT": 3580.53,
                "MOP": 8.02,
                "MRU": 40.06,
                "MUR": 46.13,
                "MVR": 15.44,
                "MWK": 1739.37,
                "MXN": 18.68,
                "MYR": 4.23,
                "MZN": 63.72,
                "NAD": 17.71,
                "NGN": 1534.4,
                "NIO": 36.81,
                "NOK": 10.12,
                "NPR": 140.36,
                "NZD": 1.71,
                "OMR": 0.384,
                "PAB": 1,
                "PEN": 3.55,
                "PGK": 4.22,
                "PHP": 57.23,
                "PKR": 283.62,
                "PLN": 3.67,
                "PYG": 7245.07,
                "QAR": 3.64,
                "RON": 4.37,
                "RSD": 100.96,
                "RUB": 80.36,
                "RWF": 1448.19,
                "SAR": 3.75,
                "SBD": 8.29,
                "SCR": 14.64,
                "SDG": 543.94,
                "SEK": 9.54,
                "SGD": 1.29,
                "SHP": 0.742,
                "SLE": 23.33,
                "SLL": 23327.2,
                "SOS": 571.39,
                "SRD": 37.6,
                "SSP": 4603.49,
                "STN": 21.07,
                "SYP": 12933.59,
                "SZL": 17.71,
                "THB": 32.44,
                "TJS": 9.5,
                "TMT": 3.5,
                "TND": 2.89,
                "TOP": 2.36,
                "TRY": 41.07,
                "TTD": 6.78,
                "TVD": 1.54,
                "TWD": 30.56,
                "TZS": 2493.28,
                "UAH": 41.35,
                "UGX": 3541.7,
                "UYU": 40,
                "UZS": 12351.46,
                "VES": 145.75,
                "VND": 26275.19,
                "VUV": 119.35,
                "WST": 2.69,
                "XAF": 564.03,
                "XCD": 2.7,
                "XCG": 1.79,
                "XDR": 0.734,
                "XOF": 564.03,
                "XPF": 102.61,
                "YER": 240.03,
                "ZAR": 17.71,
                "ZMW": 23.41,
                "ZWL": 26.75
            },
            "provider": "exchangerate-api",
            "created_at": "2025-08-28T19:39:14.985Z",
            "updated_at": "2024-01-18T12:00:00.000Z"
        },
        {
            "_id": "68b2183eb2507a7abb4da8fd",
            "base_currency": "USD",
            "date": "2025-08-29",
            "timestamp": "2025-08-29T00:00:01.000Z",
            "time_last_updated": 1756425601,
            "rates": {
                "USD": 1,
                "AED": 3.67,
                "AFN": 68.45,
                "ALL": 83.7,
                "AMD": 382.36,
                "ANG": 1.79,
                "AOA": 919.67,
                "ARS": 1343.67,
                "AUD": 1.53,
                "AWG": 1.79,
                "AZN": 1.7,
                "BAM": 1.67,
                "BBD": 2,
                "BDT": 121.6,
                "BGN": 1.67,
                "BHD": 0.376,
                "BIF": 2974.63,
                "BMD": 1,
                "BND": 1.28,
                "BOB": 6.91,
                "BRL": 5.41,
                "BSD": 1,
                "BTN": 87.63,
                "BWP": 13.73,
                "BYN": 3.33,
                "BZD": 2,
                "CAD": 1.38,
                "CDF": 2889.25,
                "CHF": 0.802,
                "CLP": 967.82,
                "CNY": 7.13,
                "COP": 4025.72,
                "CRC": 503.63,
                "CUP": 24,
                "CVE": 94.42,
                "CZK": 21.02,
                "DJF": 177.72,
                "DKK": 6.39,
                "DOP": 62.9,
                "DZD": 129.78,
                "EGP": 48.61,
                "ERN": 15,
                "ETB": 140.97,
                "EUR": 0.856,
                "FJD": 2.26,
                "FKP": 0.74,
                "FOK": 6.39,
                "GBP": 0.74,
                "GEL": 2.7,
                "GGP": 0.74,
                "GHS": 11.53,
                "GIP": 0.74,
                "GMD": 72.89,
                "GNF": 8685.92,
                "GTQ": 7.66,
                "GYD": 209.07,
                "HKD": 7.79,
                "HNL": 26.2,
                "HRK": 6.45,
                "HTG": 130.81,
                "HUF": 339.88,
                "IDR": 16351.23,
                "ILS": 3.33,
                "IMP": 0.74,
                "INR": 87.63,
                "IQD": 1309.87,
                "IRR": 42510.14,
                "ISK": 122.6,
                "JEP": 0.74,
                "JMD": 159.81,
                "JOD": 0.709,
                "JPY": 146.97,
                "KES": 129.05,
                "KGS": 87.28,
                "KHR": 4012,
                "KID": 1.53,
                "KMF": 421.29,
                "KRW": 1385.63,
                "KWD": 0.305,
                "KYD": 0.833,
                "KZT": 537.34,
                "LAK": 21696.8,
                "LBP": 89500,
                "LKR": 301.97,
                "LRD": 200.62,
                "LSL": 17.68,
                "LYD": 5.43,
                "MAD": 9.02,
                "MDL": 16.6,
                "MGA": 4456.94,
                "MKD": 53.02,
                "MMK": 2098.79,
                "MNT": 3562.15,
                "MOP": 8.03,
                "MRU": 40.1,
                "MUR": 46.09,
                "MVR": 15.43,
                "MWK": 1741.34,
                "MXN": 18.65,
                "MYR": 4.22,
                "MZN": 63.69,
                "NAD": 17.68,
                "NGN": 1533.62,
                "NIO": 36.76,
                "NOK": 10.07,
                "NPR": 140.2,
                "NZD": 1.7,
                "OMR": 0.384,
                "PAB": 1,
                "PEN": 3.55,
                "PGK": 4.21,
                "PHP": 56.98,
                "PKR": 283.51,
                "PLN": 3.65,
                "PYG": 7235.97,
                "QAR": 3.64,
                "RON": 4.34,
                "RSD": 100.48,
                "RUB": 80.33,
                "RWF": 1448.4,
                "SAR": 3.75,
                "SBD": 8.24,
                "SCR": 14.78,
                "SDG": 511.29,
                "SEK": 9.48,
                "SGD": 1.28,
                "SHP": 0.74,
                "SLE": 23.33,
                "SLL": 23327.2,
                "SOS": 571.48,
                "SRD": 37.61,
                "SSP": 4640.45,
                "STN": 20.98,
                "SYP": 12902.5,
                "SZL": 17.68,
                "THB": 32.3,
                "TJS": 9.5,
                "TMT": 3.5,
                "TND": 2.89,
                "TOP": 2.36,
                "TRY": 41.12,
                "TTD": 6.76,
                "TVD": 1.53,
                "TWD": 30.46,
                "TZS": 2497.02,
                "UAH": 41.25,
                "UGX": 3535.59,
                "UYU": 39.96,
                "UZS": 12365.21,
                "VES": 147.08,
                "VND": 26244.07,
                "VUV": 120.12,
                "WST": 2.69,
                "XAF": 561.71,
                "XCD": 2.7,
                "XCG": 1.79,
                "XDR": 0.731,
                "XOF": 561.71,
                "XPF": 102.19,
                "YER": 239.82,
                "ZAR": 17.68,
                "ZMW": 23.47,
                "ZWL": 26.75
            },
            "provider": "exchangerate-api",
            "created_at": "2025-08-29T21:14:38.836Z",
            "updated_at": "2025-08-29T21:14:38.836Z"
        }
    ],
    "limit": 10,
    "skip": 0
}

# Actualizar fiat

PATCH http://localhost:3030/fiat-rates/68b0b06287d12397d3353655

body:

{
  "$set": {
    "rates.AED": 3.67,
    "rates.AFN": 68.49,
    "updated_at": "2024-01-18T12:00:00.000Z"
  }
}

# Guardar crypto

GET http://localhost:3030/rates?_method=saveCryptoRates

params:

_method = saveCryptoRates

respuesta:

{
    "success": true,
    "insertedCount": 3,
    "cryptos": [
        "bitcoin",
        "cardano",
        "ethereum"
    ],
    "message": "Tasas crypto guardadas correctamente en el servicio"
}

# Consultar crypto

GET http://localhost:3030/crypto-rates?crypto_id=bitcoin

params:

crypto_id = bitcoin

respuesta:

{
    "total": 2,
    "data": [
        {
            "_id": "68afa6645899470cb055a61f",
            "crypto_id": "bitcoin",
            "name": "Bitcoin",
            "symbol": "BTC",
            "timestamp": "2025-08-28T00:44:20.861Z",
            "rates": {
                "usd": 111137,
                "eur": 95446,
                "mxn": 2072480
            },
            "provider": "coingecko",
            "created_at": "2025-08-28T00:44:20.861Z"
        },
        {
            "_id": "68b2185db2507a7abb4da8fe",
            "crypto_id": "bitcoin",
            "name": "Bitcoin",
            "symbol": "BTC",
            "timestamp": "2025-08-29T21:15:09.847Z",
            "rates": {
                "usd": 107847,
                "eur": 92292,
                "mxn": 2011959
            },
            "provider": "coingecko",
            "created_at": "2025-08-29T21:15:09.847Z"
        }
    ],
    "limit": 10,
    "skip": 0
}

# Actualizar crypto

PATCH http://localhost:3030/crypto-rates/68afa6645899470cb055a620

body:

{
  "$set": {
    "rates.usd": 0.847363,
    "updated_at": "2024-01-18T12:00:00.000Z"
  }
}


respuesta:

{
    "_id": "68afa6645899470cb055a620",
    "crypto_id": "cardano",
    "name": "Cardano",
    "symbol": "ADA",
    "timestamp": "2025-08-28T00:44:20.861Z",
    "rates": {
        "usd": 0.847363,
        "eur": 0.727724,
        "mxn": 15.8
    },
    "provider": "coingecko",
    "created_at": "2025-08-28T00:44:20.861Z",
    "updated_at": "2024-01-18T12:00:00.000Z"
}

3. GENERACION DE REPORTES

# Generar reporte

GET http://localhost:3030/report