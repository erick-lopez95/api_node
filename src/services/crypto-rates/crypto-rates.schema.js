import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const cryptoRatesSchema = {
  $id: 'CryptoRates',
  type: 'object',
  additionalProperties: false,
  required: ['crypto_id', 'rates', 'timestamp'],
  properties: {
    _id: ObjectIdSchema(),
    crypto_id: { type: 'string' },
    name: { type: 'string' },
    symbol: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    rates: { 
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    provider: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' }
  }
}
export const cryptoRatesValidator = getValidator(cryptoRatesSchema, dataValidator)
export const cryptoRatesResolver = resolve({})

export const cryptoRatesExternalResolver = resolve({})

// Schema for creating new data
export const cryptoRatesDataSchema = {
  $id: 'CryptoRatesData',
  type: 'object',
  additionalProperties: false,
  required: ['crypto_id', 'rates', 'timestamp'],
  properties: {
    crypto_id: { type: 'string' },
    name: { type: 'string' },
    symbol: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    rates: { 
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    provider: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' }
  }
}
export const cryptoRatesDataValidator = getValidator(cryptoRatesDataSchema, dataValidator)
export const cryptoRatesDataResolver = resolve({})

// Schema for updating existing data
export const cryptoRatesPatchSchema = {
  $id: 'CryptoRatesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    crypto_id: { type: 'string' },
    name: { type: 'string' },
    symbol: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    rates: { 
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    provider: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' }
  }
}
export const cryptoRatesPatchValidator = getValidator(cryptoRatesPatchSchema, dataValidator)
export const cryptoRatesPatchResolver = resolve({})

// Schema for allowed query properties
export const cryptoRatesQuerySchema = {
  $id: 'CryptoRatesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(cryptoRatesSchema.properties),
    _method: {
      type: 'string'
    }
  }
}
export const cryptoRatesQueryValidator = getValidator(cryptoRatesQuerySchema, queryValidator)
export const cryptoRatesQueryResolver = resolve({})