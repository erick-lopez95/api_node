// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const ratesSchema = {
  $id: 'Rates',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' }
  }
}
export const ratesValidator = getValidator(ratesSchema, dataValidator)
export const ratesResolver = resolve({})

export const ratesExternalResolver = resolve({})

// Schema for creating new data
export const ratesDataSchema = {
  $id: 'RatesData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...ratesSchema.properties
  }
}
export const ratesDataValidator = getValidator(ratesDataSchema, dataValidator)
export const ratesDataResolver = resolve({})

// Schema for updating existing data
export const ratesPatchSchema = {
  $id: 'RatesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...ratesSchema.properties
  }
}
export const ratesPatchValidator = getValidator(ratesPatchSchema, dataValidator)
export const ratesPatchResolver = resolve({})

// Schema for allowed query properties
export const ratesQuerySchema = {
  $id: 'RatesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(ratesSchema.properties),
    _method: {
      type: 'string',
    }
  },
  
}
export const ratesQueryValidator = getValidator(ratesQuerySchema, queryValidator)
export const ratesQueryResolver = resolve({})
