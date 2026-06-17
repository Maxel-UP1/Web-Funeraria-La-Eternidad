import { IsNotEmpty, IsString, IsOptional, IsEmail, IsUUID, IsInt, Min, IsEnum, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PreOrderStatus } from '@prisma/client';

export class CreatePreOrderDto {
  @ApiProperty({ example: '550c8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 'Carlos Rodríguez' })
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @ApiProperty({ example: '3009876543' })
  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @ApiPropertyOptional({ example: 'carlos@email.com' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdatePreOrderStatusDto {
  @ApiProperty({ enum: PreOrderStatus })
  @IsEnum(PreOrderStatus)
  status!: PreOrderStatus;
}

export class PreOrderFilterDto {
  @ApiPropertyOptional({ enum: PreOrderStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(PreOrderStatus)
  status?: PreOrderStatus;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
