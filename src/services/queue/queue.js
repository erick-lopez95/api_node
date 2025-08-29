// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  queueDataValidator,
  queuePatchValidator,
  queueQueryValidator,
  queueResolver,
  queueExternalResolver,
  queueDataResolver,
  queuePatchResolver,
  queueQueryResolver
} from './queue.schema.js'
import { QueueService, getOptions } from './queue.class.js'

export const queuePath = 'queue'
export const queueMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './queue.class.js'
export * from './queue.schema.js'

export const queue = app => {
  app.use(queuePath, new QueueService(getOptions(app)), {
    methods: queueMethods,
    events: []
  })
  // Initialize hooks
  app.service(queuePath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(queueExternalResolver), schemaHooks.resolveResult(queueResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(queueQueryValidator), schemaHooks.resolveQuery(queueQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(queueDataValidator), schemaHooks.resolveData(queueDataResolver)],
      patch: [schemaHooks.validateData(queuePatchValidator), schemaHooks.resolveData(queuePatchResolver)],
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
