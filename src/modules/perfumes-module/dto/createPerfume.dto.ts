import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfumeDto {
  @ApiProperty({ description: 'Nombre del perfume' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del perfume' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'URL de la imagen del perfume' })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'ID de la marca del perfume' })
  @IsNotEmpty()
  @IsNumber()
  brandId: number;
}
