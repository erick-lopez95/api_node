// report.js - Solución con middleware Express
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
  
  // ✅ Middleware Express personalizado para interceptar respuestas PDF
  app.use(`/${reportPath}`, (req, res, next) => {
    // Guardar los métodos originales
    const originalJson = res.json;
    const originalSend = res.send;
    
    // Override de res.json
    res.json = function(data) {
      if (data && data.isPDF) {
        console.log('📄 Intercepting PDF response in middleware');
        try {
          res.setHeader('Content-Type', data.contentType || 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${data.filename}"`);
          originalSend.call(this, data.pdfBuffer);
        } catch (error) {
          console.error('Error in PDF middleware:', error);
          originalJson.call(this, data);
        }
      } else {
        originalJson.call(this, data);
      }
    };
    
    // Override de res.send
    res.send = function(data) {
      if (data && data.isPDF) {
        console.log('📄 Intercepting PDF response in middleware');
        try {
          res.setHeader('Content-Type', data.contentType || 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${data.filename}"`);
          originalSend.call(this, data.pdfBuffer);
        } catch (error) {
          console.error('Error in PDF middleware:', error);
          originalSend.call(this, data);
        }
      } else {
        originalSend.call(this, data);
      }
    };
    
    next();
  });
  
  // Initialize hooks (simplificados sin manejo de PDF)
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