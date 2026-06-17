import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { LeadController } from './controllers/lead.controller';
import { PreOrderController } from './controllers/pre-order.controller';
import { LeadService } from './services/lead.service';
import { PreOrderService } from './services/pre-order.service';
import { LeadRepository } from './repositories/lead.repository';
import { PreOrderRepository } from './repositories/pre-order.repository';

@Module({
  imports: [CatalogModule], // PreOrderService needs ProductService
  controllers: [LeadController, PreOrderController],
  providers: [LeadService, PreOrderService, LeadRepository, PreOrderRepository],
})
export class CrmModule {}
