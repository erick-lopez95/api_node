// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  convertDataValidator,
  convertPatchValidator,
  convertQueryValidator,
  convertResolver,
  convertExternalResolver,
  convertDataResolver,
  convertPatchResolver,
  convertQueryResolver
} from './convert.schema.js'
import { ConvertService, getOptions } from './convert.class.js'

export const convertPath = 'convert'
export const convertMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './convert.class.js'
export * from './convert.schema.js'

export const convert = app => {
  app.use(convertPath, new ConvertService(getOptions(app), app), {
    methods: convertMethods,
    events: []
  })
  
  // Initialize hooks
  app.service(convertPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(convertExternalResolver), schemaHooks.resolveResult(convertResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(convertQueryValidator), schemaHooks.resolveQuery(convertQueryResolver)],
      find: [],
      get: [],
      create: [
      ],
      patch: [schemaHooks.validateData(convertPatchValidator), schemaHooks.resolveData(convertPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}