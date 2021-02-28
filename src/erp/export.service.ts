import { Injectable } from '@nestjs/common';

import { DocumentService } from '../document';
import { CategoryService } from './category.service';
import { FindTransactionsDto } from './dto';
import { ProductService } from './product.service';
import { TransactionService } from './transaction.service';

@Injectable()
export class ExportService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly documentService: DocumentService,
    private readonly transactionService: TransactionService,
  ) {}

  async exportProducts(): Promise<Buffer> {
    const categories = await this.categoryService.find();
    const data: any = {};
    for (let i = 0; i < categories.length; i++) {
      data[i] = {
        category: {
          title: categories[i].title,
          id: categories[i]._id,
        },
        products: await this.productService.find({
          category: categories[i]._id,
        }),
      };
    }
    return this.documentService.exportProductsToExcel(data);
  }

  async exportResidue(query: FindTransactionsDto): Promise<Buffer> {
    const transactions = await this.transactionService.count(query);
    const category = await this.categoryService.getById(query.category);
    const data = {
      category,
      transactions,
    };
    return this.documentService.exportResidueTransactionsToExcel(data);
  }
}
