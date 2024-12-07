import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '@/entities/Inventory.entity';
import { InventoryRepository } from './repository/inventory.repository';
import { InventoryService } from './service/inventory.service';
import { InventoryController } from './controller/inventory.controller';
import { PerfumesModule } from '../perfumes-module/perfumes.module';
import { PerfumesRepository } from '../perfumes-module/repository/perfumes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    forwardRef(() => PerfumesModule)
  ],
  providers: [
    InventoryService, 
    InventoryRepository,
    {
      provide: 'INVENTORY_REPOSITORY',
      useClass: InventoryRepository,
    },
    Logger
  ],
  exports: [
    InventoryService, 
    'INVENTORY_REPOSITORY',
    InventoryRepository
  ],
  controllers: [InventoryController],
})
export class InventoryModule {}