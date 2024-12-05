import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '@/entities/Brand.entity';
import { BrandsRepository } from './repository/brands.repository';
import { BrandsService } from './services/brands.service';
import { BrandsController } from './controller/brands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandsService, BrandsRepository, {
    provide: 'BRANDS_REPOSITORY',
    useClass: BrandsRepository,
    },
    Logger
  ],
  exports: [BrandsService, 'BRANDS_REPOSITORY'],
  controllers: [BrandsController],
})
export class BrandsModuleModule {}
