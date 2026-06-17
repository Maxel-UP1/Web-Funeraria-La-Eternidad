import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { PreOrder, Prisma, PreOrderStatus } from '@prisma/client';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class PreOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    status: PreOrderStatus | undefined,
    skip: number,
    take: number,
  ): Promise<PaginatedResult<PreOrder>> {
    const where: Prisma.PreOrderWhereInput = {};
    if (status) where.status = status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.preOrder.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, price: true } },
        },
      }),
      this.prisma.preOrder.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findById(id: string): Promise<PreOrder | null> {
    return this.prisma.preOrder.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, price: true } },
      },
    });
  }

  async create(data: Prisma.PreOrderCreateInput): Promise<PreOrder> {
    return this.prisma.preOrder.create({
      data,
      include: {
        product: { select: { id: true, name: true, price: true } },
      },
    });
  }

  async updateStatus(id: string, status: PreOrderStatus): Promise<PreOrder> {
    return this.prisma.preOrder.update({
      where: { id },
      data: { status },
      include: {
        product: { select: { id: true, name: true, price: true } },
      },
    });
  }

  async delete(id: string): Promise<PreOrder> {
    return this.prisma.preOrder.delete({
      where: { id },
    });
  }
}
