// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema - Actualizado para el servicio de reportes
export const reportSchema = {
  $id: 'Report',
  type: 'object',
  additionalProperties: true,
  properties: {
    _id: ObjectIdSchema(),
    message: { type: 'string' },
    pdf: { type: 'object' },
    contentType: { type: 'string' },
    filename: { type: 'string' },
    pdfAvailable: { type: 'boolean' },
    timestamp: { type: 'string' }
  }
}

export const reportValidator = getValidator(reportSchema, dataValidator)
export const reportResolver = resolve({})

export const reportExternalResolver = resolve({})

// Schema for creating new data
export const reportDataSchema = {
  $id: 'ReportData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    text: { type: 'string' }
  }
}

export const reportDataValidator = getValidator(reportDataSchema, dataValidator)
export const reportDataResolver = resolve({})

// Schema for updating existing data
export const reportPatchSchema = {
  $id: 'ReportPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    text: { type: 'string' }
  }
}

export const reportPatchValidator = getValidator(reportPatchSchema, dataValidator)
export const reportPatchResolver = resolve({})

// Schema for allowed query properties
export const reportQuerySchema = {
  $id: 'ReportQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(reportSchema.properties)
  }
}

export const reportQueryValidator = getValidator(reportQuerySchema, queryValidator)
export const reportQueryResolver = resolve({})