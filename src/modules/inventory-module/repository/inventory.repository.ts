import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Inventory, PerfumeSize } from '../../../entities/Inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryRepositoryInterface } from '../interface/inventory.repository.interface';
import { UpdateInventoryData } from '../dto/UpdateInventory.dto';
import { CreateInventoryData } from '../dto/CreateInventory.dto';
import { Perfume } from '@/entities/Perfume.entity';

@Injectable()
export class InventoryRepository
  extends Repository<Inventory>
  implements InventoryRepositoryInterface
{
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @Inject('PERFUMES_REPOSITORY')
    private perfumeRepository: Repository<Perfume>,
    private readonly logger: Logger,
  ) {
    super(
      inventoryRepository.target,
      inventoryRepository.manager,
      inventoryRepository.queryRunner,
    );
  }
  async findAllInventories(): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      relations: ['perfume', 'perfume.brand'],
    });
  }

  async findInventoryById(id: number): Promise<Inventory> {
    return await this.inventoryRepository.findOne({
      where: { id },
      relations: ['perfume', 'perfume.brand'],
    });
  }

  async createInventory(
    createInventoryData: CreateInventoryData,
  ): Promise<InsertResult> {
    const perfume = await this.perfumeRepository.findOne({
      where: { id: createInventoryData.perfume },
    });

    if (!perfume) {
      throw new NotFoundException('Perfume not found');
    }

    return this.inventoryRepository.insert({
      perfume,
      size: createInventoryData.size,
      price: createInventoryData.price,
      stock: createInventoryData.stock,
    });
  }

  async updateInventory(
    id: number,
    data: UpdateInventoryData,
  ): Promise<UpdateResult> {
    this.logger.log(`Updating inventory with id: ${id}`);
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    return await this.inventoryRepository.update(id, {
      size: data.size,
      price: data.price,
      stock: data.stock,
    });
  }

  async updateStock(id: number, quantity: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);
    }
    inventory.stock = quantity;
    return await this.inventoryRepository.save(inventory);
  }

  async deleteInventory(id: number): Promise<DeleteResult> {
    try {
      return this.inventoryRepository
        .createQueryBuilder('inventory')
        .delete()
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      this.logger.error(`Error ${error} deleting inventory with id: ${id}`);
      throw new HttpException(
        'Error when deleting inventory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findInventoryByPerfumeId(id: number): Promise<Inventory> {
    return await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.perfumeId = :id', { id })
      .getOne();
  }

  async searchInventory(filters: {
    query?: string;
    size?: PerfumeSize;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Inventory[]> {
    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.perfume', 'perfume')
      .leftJoinAndSelect('perfume.brand', 'brand');

    if (filters.query) {
      queryBuilder.andWhere(
        '(perfume.name ILIKE :query OR brand.name ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.size) {
      queryBuilder.andWhere('inventory.size = :size', { size: filters.size });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('inventory.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('inventory.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.inStock) {
      queryBuilder.andWhere('inventory.stock > 0');
    }

    return queryBuilder.getMany();
  }
}
