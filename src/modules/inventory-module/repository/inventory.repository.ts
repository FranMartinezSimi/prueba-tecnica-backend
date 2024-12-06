import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DeleteResult, InsertResult, LessThan, Raw, Repository, UpdateResult } from "typeorm";
import { Inventory, PerfumeSize } from "../../../entities/Inventory.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { InventoryRepositoryInterface } from "../interface/inventory.repository.interface";
import { UpdateInventoryData } from "../dto/UpdateInventory.dto";
import { CreateInventoryData } from "../dto/CreateInventory.dto";
import { Like } from "typeorm";
import { Perfume } from "@/entities/Perfume.entity";


@Injectable()
export class InventoryRepository extends Repository<Inventory> implements InventoryRepositoryInterface {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Perfume)
    private perfumeRepository: Repository<Perfume>,
    private readonly logger: Logger,
  ) {
    super(inventoryRepository.target, inventoryRepository.manager, inventoryRepository.queryRunner);
  }
  async findAllInventories(): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      relations: ['perfume', 'perfume.brand']
    });
  }

  async findInventoryById(id: number): Promise<Inventory> {
    return await this.inventoryRepository.findOne({ 
      where: { id },
      relations: ['perfume', 'perfume.brand']
    });
  }

  async createInventory(createInventoryData: CreateInventoryData): Promise<InsertResult> {
    const perfume = await this.perfumeRepository.findOne({ 
      where: { id: createInventoryData.perfume }
    });

    if (!perfume) {
      throw new NotFoundException('Perfume not found');
    }

    return this.inventoryRepository.insert({
      perfume,
      size: createInventoryData.size,
      price: createInventoryData.price,
      stock: createInventoryData.stock
    });
  }

  async updateInventory(id: number, data: UpdateInventoryData): Promise<UpdateResult> {
    this.logger.log(`Updating inventory with id: ${id}`);
    return await this.inventoryRepository.update(id, data);
  }

  async updateStock(id: number, quantity: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);
    }
    inventory.stock = quantity;
    return await this.inventoryRepository.save(inventory);
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
        { query: `%${filters.query}%` }
      );
    }

    if (filters.size) {
      queryBuilder.andWhere('inventory.size = :size', { size: filters.size });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('inventory.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('inventory.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.inStock) {
      queryBuilder.andWhere('inventory.stock > 0');
    }

    return queryBuilder.getMany();
  }
}