import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum PerfumeSize {
  SMALL = '50',
  MEDIUM = '100',
  LARGE = '200',
}

export class CreateInventoryData {
  @ApiProperty({ description: 'The id of the perfume' })
  @IsNotEmpty()
  @IsNumber()
  perfume: number;

  @ApiProperty({ description: 'The size of the perfume' })
  @IsNotEmpty()
  @IsEnum(PerfumeSize)
  size: PerfumeSize;

  @ApiProperty({ description: 'The price of the perfume' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The stock of the perfume' })
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
