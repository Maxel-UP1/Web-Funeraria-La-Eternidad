import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { Branch, Prisma } from '@prisma/client';

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(onlyActive = true): Promise<Branch[]> {
    const where: Prisma.BranchWhereInput = onlyActive
      ? { isActive: true }
      : {};
    return this.prisma.branch.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Branch | null> {
    return this.prisma.branch.findUnique({ where: { id } });
  }

  async create(data: Prisma.BranchCreateInput): Promise<Branch> {
    return this.prisma.branch.create({ data });
  }

  async update(id: string, data: Prisma.BranchUpdateInput): Promise<Branch> {
    return this.prisma.branch.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Branch> {
    return this.prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
