import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { LeadRepository } from '../repositories/lead.repository';
import { CreateLeadDto, UpdateLeadStatusDto, LeadFilterDto } from '../dto/lead.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(private readonly leadRepo: LeadRepository) {}

  async findAll(
    filters: LeadFilterDto,
  ): Promise<PaginatedResult<Lead>> {
    return this.leadRepo.findAll(filters.status, filters.skip, filters.limit);
  }

  async findById(id: string): Promise<Lead> {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }
    return lead;
  }

  async create(dto: CreateLeadDto): Promise<Lead> {
    const lead = await this.leadRepo.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      message: dto.message,
      source: dto.source ?? 'website',
    });

    this.logger.log(`New lead created: ${lead.id} — ${lead.name}`);
    return lead;
  }

  async updateStatus(id: string, dto: UpdateLeadStatusDto): Promise<Lead> {
    await this.findById(id);
    return this.leadRepo.updateStatus(id, dto.status);
  }

  async delete(id: string): Promise<Lead> {
    await this.findById(id);
    this.logger.log(`Lead deleted: ${id}`);
    return this.leadRepo.delete(id);
  }
}
