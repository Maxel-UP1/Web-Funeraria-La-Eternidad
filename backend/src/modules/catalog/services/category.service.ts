import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { generateSlug } from '../../../shared/utils/slug.util';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async findAll(onlyActive = true): Promise<Category[]> {
    return this.categoryRepo.findAll(onlyActive);
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = generateSlug(dto.name);

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`Category with slug "${slug}" already exists`);
    }

    return this.categoryRepo.create({
      name: dto.name,
      slug,
      type: dto.type,
      description: dto.description,
      isActive: dto.isActive,
    });
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await this.findById(id); // verify exists

    const data: Record<string, unknown> = { ...dto };
    if (dto.name) {
      data.slug = generateSlug(dto.name);
      const existing = await this.categoryRepo.findBySlug(data.slug as string);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Slug "${data.slug}" already taken`);
      }
    }

    return this.categoryRepo.update(id, data);
  }

  async softDelete(id: string): Promise<Category> {
    await this.findById(id);
    return this.categoryRepo.softDelete(id);
  }
}
