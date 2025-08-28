// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  cryptoRatesDataValidator,
  cryptoRatesPatchValidator,
  cryptoRatesQueryValidator,
  cryptoRatesResolver,
  cryptoRatesExternalResolver,
  cryptoRatesDataResolver,
  cryptoRatesPatchResolver,
  cryptoRatesQueryResolver
} from './crypto-rates.schema.js'
import { CryptoRatesService, getOptions } from './crypto-rates.class.js'

export const cryptoRatesPath = 'crypto-rates'
export const cryptoRatesMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './crypto-rates.class.js'
export * from './crypto-rates.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const cryptoRates = app => {
  // Register our service on the Feathers application
  app.use(cryptoRatesPath, new CryptoRatesService(getOptions(app), app), {
    // A list of all methods this service exposes externally
    methods: cryptoRatesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(cryptoRatesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(cryptoRatesExternalResolver),
        schemaHooks.resolveResult(cryptoRatesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(cryptoRatesQueryValidator),
        schemaHooks.resolveQuery(cryptoRatesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(cryptoRatesDataValidator),
        schemaHooks.resolveData(cryptoRatesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(cryptoRatesPatchValidator),
        schemaHooks.resolveData(cryptoRatesPatchResolver)
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
