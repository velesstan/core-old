import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import puppeteer, { PDFOptions } from 'puppeteer';
import fs from 'fs';
import path from 'path';

@Injectable()
export class DocumentService {
  constructor() {}

  async makeInvoice() {
    const templateHTML = fs.readFileSync(
      path.join(process.cwd(), 'src', 'document', 'templates', 'invoice.html'),
      'utf-8',
    );
    const template = handlebars.compile(templateHTML);
    const html = template({});

    const pdfPath = path.join(`some-invoice.pdf`);
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
      path: pdfPath,
    };

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf(options as PDFOptions);
    await browser.close();
  }
}
