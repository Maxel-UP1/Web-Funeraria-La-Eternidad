import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Branch } from '@prisma/client';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List active branches (public)' })
  async findAll(): Promise<Branch[]> {
    return this.branchService.findAll(true);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID (public)' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Branch> {
    return this.branchService.findById(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create branch (ADMIN)' })
  async create(@Body() dto: CreateBranchDto): Promise<Branch> {
    return this.branchService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update branch (ADMIN)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBranchDto,
  ): Promise<Branch> {
    return this.branchService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Soft-delete branch (ADMIN)' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Branch> {
    return this.branchService.softDelete(id);
  }
}
