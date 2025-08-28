// report.class.js - Usar import en lugar de require
import PDFDocument from 'pdfkit';

export class ReportService {
  constructor(options, app) {
    this.options = options;
    this.app = app;
  }

  async find(params) {
    try {
      console.log('Fetching today conversions...');
      const conversions = await this.getTodayConversions();
      
      if (!conversions || conversions.length === 0) {
        console.log('No conversions found for today');
        return { 
          message: 'No conversions found for today',
          status: 'empty'
        };
      }

      console.log(`Found ${conversions.length} conversions for today`);
      
      const pdfBuffer = await this.generatePDF(conversions);
      
      return {
        pdfBuffer: pdfBuffer,
        contentType: 'application/pdf',
        filename: `report-${new Date().toISOString().split('T')[0]}.pdf`,
        isPDF: true
      };
    } catch (error) {
      console.error('Error in find method:', error);
      throw new Error(`Error generating PDF report: ${error.message}`);
    }
  }

  async get(id, params) {
    return {
      id,
      message: 'Individual report not implemented',
      timestamp: new Date().toISOString()
    };
  }

  async create(data, params) {
    return {
      message: 'Create operation not implemented for reports',
      data,
      timestamp: new Date().toISOString()
    };
  }

  async patch(id, data, params) {
    return {
      id,
      message: 'Patch operation not implemented for reports',
      data,
      timestamp: new Date().toISOString()
    };
  }

  async remove(id, params) {
    return {
      id,
      message: 'Remove operation not implemented for reports',
      timestamp: new Date().toISOString()
    };
  }

  async getTodayConversions() {
    try {
      const convertService = this.app.service('convert');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const conversions = await convertService.find({
        query: {
          timestamp: { 
            $gte: today.toISOString() 
          }
        },
        paginate: false
      });
      
      return conversions;
    } catch (error) {
      console.error('Error fetching conversions from service:', error);
      throw new Error('Failed to fetch conversion data from service');
    }
  }

  async generatePDF(conversions) {
    const doc = new PDFDocument();
    const chunks = [];
    
    return new Promise((resolve, reject) => {
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
      
      // Mejorar el contenido del PDF para conversiones de moneda
      doc.fontSize(20).text('Daily Currency Conversions Report', 100, 80);
      doc.fontSize(12).text(`Report Date: ${new Date().toLocaleDateString()}`, 100, 110);
      doc.text(`Total conversions today: ${conversions.length}`, 100, 130);
      doc.moveDown();

      // Encabezados de la tabla
      doc.font('Helvetica-Bold');
      doc.text('#', 50, 180);
      doc.text('From', 80, 180);
      doc.text('To', 150, 180);
      doc.text('Amount', 200, 180);
      doc.text('Converted', 280, 180);
      doc.text('Rate', 360, 180);
      doc.text('Time', 420, 180);
      
      doc.font('Helvetica');
      let yPosition = 200;
      
      conversions.forEach((conv, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 100;
          // Volver a dibujar encabezados en nueva página
          doc.font('Helvetica-Bold');
          doc.text('#', 50, 80);
          doc.text('From', 80, 80);
          doc.text('To', 150, 80);
          doc.text('Amount', 200, 80);
          doc.text('Converted', 280, 80);
          doc.text('Rate', 360, 80);
          doc.text('Time', 420, 80);
          doc.font('Helvetica');
          yPosition = 100;
        }
        
        doc.text(`${index + 1}`, 50, yPosition);
        doc.text(conv.from_currency || 'N/A', 80, yPosition);
        doc.text(conv.to_currency || 'N/A', 150, yPosition);
        doc.text(conv.amount?.toString() || '0', 200, yPosition);
        doc.text(conv.converted_amount?.toString() || '0', 280, yPosition);
        doc.text(conv.rate?.toString() || '0', 360, yPosition);
        doc.text(new Date(conv.timestamp).toLocaleTimeString(), 420, yPosition);
        
        yPosition += 25;
      });
      
      // Agregar totales al final
      doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).stroke();
      
      const totalAmount = conversions.reduce((sum, conv) => sum + (conv.amount || 0), 0);
      const totalConverted = conversions.reduce((sum, conv) => sum + (conv.converted_amount || 0), 0);
      
      doc.font('Helvetica-Bold');
      doc.text('TOTALS:', 150, yPosition + 25);
      doc.text(totalAmount.toString(), 200, yPosition + 25);
      doc.text(totalConverted.toString(), 280, yPosition + 25);
      
      doc.end();
    });
  }
}

export const getOptions = (app) => {
  return { app }
}