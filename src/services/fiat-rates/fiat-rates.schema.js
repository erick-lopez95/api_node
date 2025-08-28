// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const fiatRatesSchema = {
  $id: 'FiatRates',
  type: 'object',
  additionalProperties: false,
  required: ['base_currency', 'rates', 'timestamp'],
  properties: {
    _id: ObjectIdSchema(),
    base_currency: { type: 'string' },
    date: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    time_last_updated: { type: 'number' },
    rates: { 
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    provider: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
}
export const fiatRatesValidator = getValidator(fiatRatesSchema, dataValidator)
export const fiatRatesResolver = resolve({})

export const fiatRatesExternalResolver = resolve({})

// Schema for creating new data
export const fiatRatesDataSchema = {
  $id: 'FiatRatesData',
  type: 'object',
  additionalProperties: false,
  required: ['base_currency', 'rates', 'timestamp'],
  properties: {
    base_currency: { type: 'string' },
    date: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    time_last_updated: { type: 'number' },
    rates: { 
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    provider: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
}
export const fiatRatesDataValidator = getValidator(fiatRatesDataSchema, dataValidator)
export const fiatRatesDataResolver = resolve({})

// Schema for updating existing data
export const fiatRatesPatchSchema = {
  $id: 'FiatRatesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    base_currency: { type: 'string' },
    date: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    time_last_updated: { type: 'number' },
    rates: { 
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    provider: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
}
export const fiatRatesPatchValidator = getValidator(fiatRatesPatchSchema, dataValidator)
export const fiatRatesPatchResolver = resolve({})

// Schema for allowed query properties
export const fiatRatesQuerySchema = {
  $id: 'FiatRatesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(fiatRatesSchema.properties),
    _method: {
      type: 'string'
    }
  }
}
export const fiatRatesQueryValidator = getValidator(fiatRatesQuerySchema, queryValidator)
export const fiatRatesQueryResolver = resolve({})