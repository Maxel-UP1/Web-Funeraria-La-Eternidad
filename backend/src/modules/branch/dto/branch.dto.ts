import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @ApiProperty({ example: 'Sede Tunja' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Calle 20 #10-45, Centro' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: 'Tunja' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'Boyacá' })
  @IsString()
  @IsNotEmpty()
  department!: string;

  @ApiProperty({ example: 5.5353, description: 'Latitude' })
  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: -73.3678, description: 'Longitude' })
  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @IsNotEmpty()
  contactPhone!: string;

  @ApiPropertyOptional({ example: 'tunja@eternidad.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}

export class UpdateBranchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
