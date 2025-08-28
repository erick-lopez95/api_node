// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  ratesDataValidator,
  ratesPatchValidator,
  ratesQueryValidator,
  ratesResolver,
  ratesExternalResolver,
  ratesDataResolver,
  ratesPatchResolver,
  ratesQueryResolver
} from './rates.schema.js'
import { RatesService, getOptions } from './rates.class.js'

export const ratesPath = 'rates'
export const ratesMethods = ['find', 'get', 'create', 'patch', 'remove','getFiatRates', 'getCryptoRates']

export * from './rates.class.js'
export * from './rates.schema.js'

export const rates = app => {
  app.use(ratesPath, new RatesService(getOptions(app), app), {
    methods: ratesMethods,
    events: []
  })
  // Initialize hooks
  app.service(ratesPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(ratesExternalResolver), schemaHooks.resolveResult(ratesResolver)]
    },
    before: {
      all: [
        schemaHooks.validateQuery(ratesQueryValidator), 
        schemaHooks.resolveQuery(ratesQueryResolver),
      
        async context => {
          const { provider, query } = context.params;
          const methodName = query?._method;
          
          if (provider === 'rest' && methodName) {
            if (typeof context.service[methodName] !== 'function') {
              throw new Error(`Método '${methodName}' no existe`);
            }
            
            try {
              context.result = await context.service[methodName](context.params);
              return context;
            } catch (error) {
              throw new Error(`Error ejecutando ${methodName}: ${error.message}`);
            }
          }
          return context;
        }
      ],
      find: [],
      get: [],
      create: [schemaHooks.validateData(ratesDataValidator), schemaHooks.resolveData(ratesDataResolver)],
      patch: [schemaHooks.validateData(ratesPatchValidator), schemaHooks.resolveData(ratesPatchResolver)],
      remove: [],
      rateTest: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
