// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  fiatRatesDataValidator,
  fiatRatesPatchValidator,
  fiatRatesQueryValidator,
  fiatRatesResolver,
  fiatRatesExternalResolver,
  fiatRatesDataResolver,
  fiatRatesPatchResolver,
  fiatRatesQueryResolver
} from './fiat-rates.schema.js'
import { FiatRatesService, getOptions } from './fiat-rates.class.js'

export const fiatRatesPath = 'fiat-rates'
export const fiatRatesMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './fiat-rates.class.js'
export * from './fiat-rates.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const fiatRates = app => {
  // Register our service on the Feathers application
  app.use(fiatRatesPath, new FiatRatesService(getOptions(app), app), {
    // A list of all methods this service exposes externally
    methods: fiatRatesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(fiatRatesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(fiatRatesExternalResolver),
        schemaHooks.resolveResult(fiatRatesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(fiatRatesQueryValidator),
        schemaHooks.resolveQuery(fiatRatesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(fiatRatesDataValidator),
        schemaHooks.resolveData(fiatRatesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(fiatRatesPatchValidator),
        schemaHooks.resolveData(fiatRatesPatchResolver)
      ],
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
