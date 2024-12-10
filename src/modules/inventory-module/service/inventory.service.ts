import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InventoryRepositoryInterface } from '../interface/inventory.repository.interface';
import { Inventory, PerfumeSize } from '@/entities/Inventory.entity';
import { UpdateInventoryData } from '../dto/UpdateInventory.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: InventoryRepositoryInterface,
  ) {}

  async findAllInventories(): Promise<Inventory[]> {
    this.logger.log('Finding all inventories');
    try {
      return await this.inventoryRepository.findAllInventories();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error getting inventories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findInventoryById(id: number): Promise<Inventory> {
    this.logger.log(`Finding inventory by id: ${id}`);
    try {
      const inventory = await this.inventoryRepository.findInventoryById(id);
      if (!inventory) {
        this.logger.error(`Inventory with id ${id} not found`);
        throw new NotFoundException('Inventory not found');
      }
      return inventory;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error getting inventory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateInventory(id: number, data: UpdateInventoryData): Promise<void> {
    this.logger.log(`Updating inventory with id: ${id}`);
    try {
      const inventory = await this.findInventoryById(id);
      if (!inventory) {
        this.logger.error(`Inventory with id ${id} not found`);
        throw new NotFoundException('Inventory not found');
      }
      this.logger.log(`Updating inventory with id: ${id}`);
      await this.inventoryRepository.updateInventory(id, data);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error updating inventory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStock(id: number, quantity: number): Promise<void> {
    this.logger.log(`Updating stock for inventory with id: ${id}`);
    try {
      const inventory = await this.findInventoryById(id);
      if (!inventory) {
        this.logger.error(`Inventory with id ${id} not found`);
        throw new NotFoundException('Inventory not found');
      }
      this.logger.log(
        `Updating stock for inventory with id: ${id} to ${quantity}`,
      );
      await this.inventoryRepository.updateStock(id, quantity);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error updating stock',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchInventory(filters: {
    query?: string;
    size?: PerfumeSize;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Inventory[]> {
    this.logger.log('Searching inventory');
    try {
      return await this.inventoryRepository.searchInventory(filters);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error searching inventory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteInventory(id: number): Promise<DeleteResult> {
    this.logger.log(`Deleting inventory with id: ${id}`);
    try {
      return await this.inventoryRepository.deleteInventory(id);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error deleting inventory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
