import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '@/entities/Inventory.entity';
import { InventoryRepository } from './repository/inventory.repository';
import { InventoryService } from './service/inventory.service';
import { Perfume } from '@/entities/Perfume.entity';
import { InventoryController } from './controller/inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Perfume])],
  providers: [InventoryService, 
    {
      provide: 'INVENTORY_REPOSITORY',
      useClass: InventoryRepository,
    }, 
    Logger],
  exports: [InventoryService, 'INVENTORY_REPOSITORY'],
  controllers: [InventoryController],
})
export class InventoryModule {}
