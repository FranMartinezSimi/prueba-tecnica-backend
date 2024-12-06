import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePerfumeDto {
  @ApiProperty({ description: 'Nombre del perfume' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del perfume' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'URL de la imagen del perfume' })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'ID de la marca del perfume' })
  @IsOptional()
  @IsNumber()
  brandId: number;
}
