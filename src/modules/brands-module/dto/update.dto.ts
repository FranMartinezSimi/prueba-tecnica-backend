import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBrandDto {
  @ApiProperty({ description: 'Nombre de la marca' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Logo de la marca' })
  @IsOptional()
  @IsString()
  logo: string;
}
