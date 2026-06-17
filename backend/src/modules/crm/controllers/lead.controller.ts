import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Lead } from '@prisma/client';
import { LeadService } from '../services/lead.service';
import { CreateLeadDto, UpdateLeadStatusDto, LeadFilterDto } from '../dto/lead.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create lead / PQRS (public)' })
  async create(@Body() dto: CreateLeadDto): Promise<Lead> {
    return this.leadService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List leads (ADMIN)' })
  async findAll(
    @Query() filters: LeadFilterDto,
  ): Promise<PaginatedResult<Lead>> {
    return this.leadService.findAll(filters);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get lead by ID (ADMIN)' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Lead> {
    return this.leadService.findById(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/status')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update lead status (ADMIN)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ): Promise<Lead> {
    return this.leadService.updateStatus(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete lead permanently (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lead deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Lead> {
    return this.leadService.delete(id);
  }
}
