import { Injectable } from '@nestjs/common';
import puppeteer, { PDFOptions } from 'puppeteer';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';

const templateHTML = fs.readFileSync(path.join(__dirname, 'templates', 'invoice.html'), 'utf-8');

import { ProductModel, WaybillModel } from '../erp/interfaces';

@Injectable()
export class DocumentService {
  async makeInvoice(invoice: WaybillModel) {
    handlebars.registerHelper('incremented', (index) => {
      return index + 1;
    });
    handlebars.registerHelper('toFixed', function (distance) {
      return distance.toFixed(2);
    });
    const template = handlebars.compile(templateHTML);
    const html = template({
      invoiceDate: invoice.createdAt.toLocaleDateString('ru-RU'),
      invoiceNumber: invoice.title,
      invoiceType: invoice.type === 'OUTCOME' ? 'Расходная' : 'Приходная',
      invoiceStock: (invoice.stock as any).title,
      items: invoice.toObject().transactions.map((t) => ({
        product: t.product,
        price: t.snapshot ? t.snapshot.price : (t.product as any).price_retail,
        quantity: Math.abs(t.quantity),
        total: Math.abs(t.quantity) * (t.snapshot ? t.snapshot.price : (t.product as any).price_retail),
      })),
      subtotal: invoice.transactions.reduce(
        (acc, t) =>
          (acc += Math.abs(t.quantity) * (t.snapshot ? t.snapshot.price : (t.product as any).price_retail)),
        0,
      ),
    });

    const options = {
      width: '1000px',
      format: 'A4',
      headerTemplate: '<p></p>',
      footerTemplate: '<p></p>',
      displayHeaderFooter: false,
      margin: {
        top: '10px',
        bottom: '30px',
        left: '150px',
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

  exportProductsToExcel(data: any): Buffer {
    const wb = xlsx.utils.book_new();
    for (const categoryIndex in data) {
      const categoryTitle = data[categoryIndex].category.title;
      const products = data[categoryIndex].products;
      wb.SheetNames.push(categoryTitle);
      const ws = xlsx.utils.aoa_to_sheet([
        [
          '№',
          'Код',
          'Наименование',
          'Цена опт.',
          'Цена розн.',
          'Остаток',
          `Всего: ${products.length}`,
        ],
        ...products.map((p: ProductModel, index: number) => [
          index + 1,
          p.code,
          p.title,
          p.price_wholesale,
          p.price_retail,
        ]),
      ]);
      wb.Sheets[categoryTitle] = ws;
    }
    return xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
  }
}
