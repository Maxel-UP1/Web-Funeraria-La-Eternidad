import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { CategoryRepository } from './repositories/category.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [CategoryController, ProductController],
  providers: [
    CategoryService,
    ProductService,
    CategoryRepository,
    ProductRepository,
  ],
  exports: [ProductService],
})
export class CatalogModule {}
