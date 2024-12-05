import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ description: 'Nombre de la marca' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Logo de la marca' })
  @IsOptional()
  @IsString()
  logo: string;
}
