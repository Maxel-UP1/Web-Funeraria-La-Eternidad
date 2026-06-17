import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PreOrder, PreOrderStatus } from '@prisma/client';
import { PreOrderRepository } from '../repositories/pre-order.repository';
import { ProductService } from '../../catalog/services/product.service';
import { CreatePreOrderDto, UpdatePreOrderStatusDto, PreOrderFilterDto } from '../dto/pre-order.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp.util';

@Injectable()
export class PreOrderService {
  private readonly logger = new Logger(PreOrderService.name);

  constructor(
    private readonly preOrderRepo: PreOrderRepository,
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(
    filters: PreOrderFilterDto,
  ): Promise<PaginatedResult<PreOrder>> {
    return this.preOrderRepo.findAll(filters.status, filters.skip, filters.limit);
  }

  async findById(id: string): Promise<PreOrder> {
    const preOrder = await this.preOrderRepo.findById(id);
    if (!preOrder) {
      throw new NotFoundException(`PreOrder ${id} not found`);
    }
    return preOrder;
  }

  async create(dto: CreatePreOrderDto): Promise<PreOrder & { waLink: string | null }> {
    // Verify product exists
    const product = await this.productService.findById(dto.productId);

    // Generate WA link
    const waPhone = this.configService.get<string>('app.waPhoneNumber') ?? '';
    const waLink = generateWhatsAppLink(
      waPhone,
      product.name,
      dto.customerName,
      dto.quantity ?? 1,
    );

    // Persist pre-order BEFORE redirect (prevents data loss per business rule)
    const preOrder = await this.preOrderRepo.create({
      product: { connect: { id: dto.productId } },
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail,
      quantity: dto.quantity ?? 1,
      status: PreOrderStatus.REDIRECTED_TO_WA,
      waLink,
    });

    this.logger.log(
      `PreOrder created: ${preOrder.id} — Product: ${product.name} — Customer: ${dto.customerName}`,
    );

    return preOrder;
  }

  async updateStatus(id: string, dto: UpdatePreOrderStatusDto): Promise<PreOrder> {
    await this.findById(id);
    return this.preOrderRepo.updateStatus(id, dto.status);
  }

  async delete(id: string): Promise<PreOrder> {
    await this.findById(id);
    this.logger.log(`PreOrder deleted: ${id}`);
    return this.preOrderRepo.delete(id);
  }
}
