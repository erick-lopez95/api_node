// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  reportDataValidator,
  reportPatchValidator,
  reportQueryValidator,
  reportResolver,
  reportExternalResolver,
  reportDataResolver,
  reportPatchResolver,
  reportQueryResolver
} from './report.schema.js'
import { ReportService, getOptions } from './report.class.js'

export const reportPath = 'report'
export const reportMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './report.class.js'
export * from './report.schema.js'

export const report = (app) => {
  // Register our service on the Feathers application
  app.use(reportPath, new ReportService(getOptions(app), app), {
    methods: reportMethods,
    events: []
  })
  
  // Initialize hooks
  app.service(reportPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(reportExternalResolver), 
        schemaHooks.resolveResult(reportResolver)
      ]
    },
    before: {
      all: [
        async context => {
          if (context.method === 'find') {
            return context;
          }
          return schemaHooks.validateQuery(reportQueryValidator)(context);
        },
        schemaHooks.resolveQuery(reportQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(reportDataValidator), 
        schemaHooks.resolveData(reportDataResolver)
      ],
      patch: [
        schemaHooks.validateData(reportPatchValidator), 
        schemaHooks.resolveData(reportPatchResolver)
      ],
      remove: []
    },
    after: {
      find: [
        async context => {
          try {
            // ✅ Verificar si estamos en contexto HTTP/REST y response existe
            const isHttpRequest = context.params && context.params.provider === 'rest';
            const hasResponse = context.response && typeof context.response.setHeader === 'function';
            
            if (context.result && context.result.isPDF && isHttpRequest && hasResponse) {
              console.log('Setting PDF headers for download');
              
              // Configurar headers para descarga de PDF
              context.response.setHeader('Content-Type', context.result.contentType || 'application/pdf');
              context.response.setHeader('Content-Disposition', `attachment; filename="${context.result.filename}"`);
              
              // ✅ Enviar solo el buffer PDF
              context.result = context.result.pdfBuffer;
            } else if (context.result && context.result.isPDF && !isHttpRequest) {
              // ✅ Para llamadas internas (no HTTP), mantener la estructura completa
              console.log('Internal call - keeping PDF structure intact');
              // No hacer nada, mantener el objeto completo con metadata
            }
            // ✅ Si no es PDF, mantener la respuesta original
          } catch (error) {
            console.error('Error in after hook:', error);
            // No lanzar error para no interrumpir el flujo
          }
          return context;
        }
      ]
    },
    error: {
      all: [
        async context => {
          console.error('Error in report service:', context.error);
          return context;
        }
      ]
    }
  })
}