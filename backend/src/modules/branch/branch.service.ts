import { Injectable, NotFoundException } from '@nestjs/common';
import { Branch } from '@prisma/client';
import { BranchRepository } from './branch.repository';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepo: BranchRepository) {}

  async findAll(onlyActive = true): Promise<Branch[]> {
    return this.branchRepo.findAll(onlyActive);
  }

  async findById(id: string): Promise<Branch> {
    const branch = await this.branchRepo.findById(id);
    if (!branch) {
      throw new NotFoundException(`Branch ${id} not found`);
    }
    return branch;
  }

  async create(dto: CreateBranchDto): Promise<Branch> {
    return this.branchRepo.create({
      name: dto.name,
      address: dto.address,
      city: dto.city,
      department: dto.department,
      latitude: dto.latitude,
      longitude: dto.longitude,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
    });
  }

  async update(id: string, dto: UpdateBranchDto): Promise<Branch> {
    await this.findById(id);
    return this.branchRepo.update(id, dto);
  }

  async softDelete(id: string): Promise<Branch> {
    await this.findById(id);
    return this.branchRepo.softDelete(id);
  }
}
