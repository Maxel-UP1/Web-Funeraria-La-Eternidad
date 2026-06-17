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
import { PreOrder } from '@prisma/client';
import { PreOrderService } from '../services/pre-order.service';
import { CreatePreOrderDto, UpdatePreOrderStatusDto, PreOrderFilterDto } from '../dto/pre-order.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Pre-Orders')
@Controller('pre-orders')
export class PreOrderController {
  constructor(private readonly preOrderService: PreOrderService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create pre-order → generates WhatsApp link (public)' })
  async create(@Body() dto: CreatePreOrderDto): Promise<PreOrder> {
    return this.preOrderService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List pre-orders (ADMIN)' })
  async findAll(
    @Query() filters: PreOrderFilterDto,
  ): Promise<PaginatedResult<PreOrder>> {
    return this.preOrderService.findAll(filters);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get pre-order by ID (ADMIN)' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<PreOrder> {
    return this.preOrderService.findById(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/status')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update pre-order status (ADMIN)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePreOrderStatusDto,
  ): Promise<PreOrder> {
    return this.preOrderService.updateStatus(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete pre-order permanently (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Pre-order deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<PreOrder> {
    return this.preOrderService.delete(id);
  }
}
