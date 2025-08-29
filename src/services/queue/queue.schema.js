import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

export const queueSchema = {
  $id: 'Queue',
  type: 'object',
  additionalProperties: true,
  properties: {
    _id: ObjectIdSchema(),
    message: { type: 'object' },
    status: { 
      type: 'string',
      enum: ['pending', 'processed', 'failed']
    },
    queueName: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    error: { type: 'string' }
  }
}

export const queueValidator = getValidator(queueSchema, dataValidator)
export const queueResolver = resolve({})

export const queueExternalResolver = resolve({})

// Schema for creating new data
export const queueDataSchema = {
  $id: 'QueueData',
  type: 'object',
  additionalProperties: true,
  required: ['message'],
  properties: {
    message: { type: 'object' },
    queueName: { type: 'string' },
    status: { 
      type: 'string',
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  }
}

export const queueDataValidator = getValidator(queueDataSchema, dataValidator)
export const queueDataResolver = resolve({})

// Schema for updating existing data
export const queuePatchSchema = {
  $id: 'QueuePatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    status: { 
      type: 'string',
      enum: ['pending', 'processed', 'failed']
    },
    error: { type: 'string' }
  }
}

export const queuePatchValidator = getValidator(queuePatchSchema, dataValidator)
export const queuePatchResolver = resolve({})

// Schema for allowed query properties
export const queueQuerySchema = {
  $id: 'QueueQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(queueSchema.properties),
    status: { 
      type: 'string',
      enum: ['pending', 'processed', 'failed']
    },
    queueName: { type: 'string' }
  }
}

export const queueQueryValidator = getValidator(queueQuerySchema, queryValidator)
export const queueQueryResolver = resolve({})