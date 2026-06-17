import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Lead, Prisma, LeadStatus } from '@prisma/client';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    status: LeadStatus | undefined,
    skip: number,
    take: number,
  ): Promise<PaginatedResult<Lead>> {
    const where: Prisma.LeadWhereInput = {};
    if (status) where.status = status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
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

  async findById(id: string): Promise<Lead | null> {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  async create(data: Prisma.LeadCreateInput): Promise<Lead> {
    return this.prisma.lead.create({ data });
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Lead> {
    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
