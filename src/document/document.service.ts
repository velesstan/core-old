import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import puppeteer, { PDFOptions } from 'puppeteer';

import templateHTML from './templates/invoice';

import { WaybillModel } from '../erp/interfaces';

@Injectable()
export class DocumentService {
  constructor() {}

  async makeInvoice(invoice: WaybillModel) {
    handlebars.registerHelper('incremented', (index) => {
      return index + 1;
    });
    const template = handlebars.compile(templateHTML);
    const html = template({
      invoiceDate: invoice.createdAt.toLocaleDateString(),
      invoiceNumber: invoice.title,
      invoiceStock: invoice.stock,
      items: invoice.toObject().transactions.map((t) => ({
        product: t.product,
        quantity: t.quantity,
        total: (t.product as any).price * t.quantity,
      })),
      subtotal: invoice.transactions.reduce(
        (acc, t) => (acc += (t.product as any).price * t.quantity),
        0,
      ),
    });

    const options = {
      width: '1230px',
      format: 'A4',
      headerTemplate: '<p></p>',
      footerTemplate: '<p></p>',
      displayHeaderFooter: false,
      margin: {
        top: '10px',
        bottom: '30px',
      },
      printBackground: true,
    };

    const browserOptions = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      headless: true,
    };
    if (process.env.NODE_ENV === 'production') {
      browserOptions['executablePath'] = '/usr/bin/google-chrome-stable';
    }
    const browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfFile = await page.pdf(options as PDFOptions);
    await browser.close();
    return pdfFile;
  }
}