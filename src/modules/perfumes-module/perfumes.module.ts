import { Module, Logger, forwardRef } from '@nestjs/common';
import { PerfumesService } from './services/perfumes.service';
import { PerfumesRepository } from './repository/perfumes.repository';
import { PerfumesController } from './controller/perfumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfume } from '@/entities/Perfume.entity';
import { InventoryModule } from '../inventory-module/inventory.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([Perfume]),
    forwardRef(() => InventoryModule)
  ],
  providers: [
    PerfumesService,
    PerfumesRepository,
    {
      provide: 'PERFUMES_REPOSITORY',
      useClass: PerfumesRepository,
    },
    Logger,
    JwtService
  ],
  exports: [
    PerfumesService,
    'PERFUMES_REPOSITORY',
    PerfumesRepository
  ],
  controllers: [PerfumesController],
})
export class PerfumesModule {}