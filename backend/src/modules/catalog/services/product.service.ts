import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from '../dto/product.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { generateSlug } from '../../../shared/utils/slug.util';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async findAll(
    filters: ProductFilterDto,
  ): Promise<PaginatedResult<Product>> {
    return this.productRepo.findAll(
      {
        categoryId: filters.categoryId,
        search: filters.search,
        isActive: filters.isActive,
      },
      filters.skip,
      filters.limit,
    );
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = generateSlug(dto.name);

    const existing = await this.productRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`Product with slug "${slug}" already exists`);
    }

    return this.productRepo.create({
      name: dto.name,
      slug,
      description: dto.description,
      price: dto.price,
      imageBase64: dto.imageBase64,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
      category: { connect: { id: dto.categoryId } },
    });
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.findById(id);

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
      data.slug = generateSlug(dto.name);
      const existing = await this.productRepo.findBySlug(data.slug as string);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Slug "${data.slug}" already taken`);
      }
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.imageBase64 !== undefined) data.imageBase64 = dto.imageBase64;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.categoryId !== undefined) {
      data.category = { connect: { id: dto.categoryId } };
    }

    return this.productRepo.update(id, data);
  }

  async softDelete(id: string): Promise<Product> {
    await this.findById(id);
    return this.productRepo.softDelete(id);
  }
}

