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

export const fiatRates = app => {
  app.use(fiatRatesPath, new FiatRatesService(getOptions(app), app), {
    methods: fiatRatesMethods,
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
