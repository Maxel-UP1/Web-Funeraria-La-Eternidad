import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepository } from '../repositories/category.repository';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: {
    findAll: jest.Mock;
    findById: jest.Mock;
    findBySlug: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    softDelete: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  describe('findAll', () => {
    it('should return active categories', async () => {
      const mockCats = [
        { id: '1', name: 'Ramos', isActive: true },
        { id: '2', name: 'Coronas', isActive: true },
      ];
      repo.findAll.mockResolvedValue(mockCats);

      const result = await service.findAll(true);

      expect(result).toHaveLength(2);
      expect(repo.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('findById', () => {
    it('should return category when found', async () => {
      const mockCat = { id: '1', name: 'Ramos' };
      repo.findById.mockResolvedValue(mockCat);

      const result = await service.findById('1');

      expect(result.name).toBe('Ramos');
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create category with auto-generated slug', async () => {
      repo.findBySlug.mockResolvedValue(null);
      repo.create.mockResolvedValue({
        id: '1',
        name: 'Ramos Fúnebres',
        slug: 'ramos-funebres',
        type: 'FLOWER',
      });

      const result = await service.create({
        name: 'Ramos Fúnebres',
        type: 'FLOWER' as any,
      });

      expect(result.slug).toBe('ramos-funebres');
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'ramos-funebres' }),
      );
    });

    it('should throw on duplicate slug', async () => {
      repo.findBySlug.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create({ name: 'Ramos Fúnebres', type: 'FLOWER' as any }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('softDelete', () => {
    it('should soft-delete existing category', async () => {
      repo.findById.mockResolvedValue({ id: '1', name: 'Test' });
      repo.softDelete.mockResolvedValue({ id: '1', isActive: false });

      const result = await service.softDelete('1');

      expect(result.isActive).toBe(false);
    });

    it('should throw when category not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.softDelete('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
