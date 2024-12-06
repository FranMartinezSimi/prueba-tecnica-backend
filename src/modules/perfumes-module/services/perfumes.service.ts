import { Injectable, Logger, NotFoundException, HttpException, HttpStatus, Inject, ConflictException } from "@nestjs/common";
import { IPerfumesRepository } from "../interfaces/perfumes.repository.interface";
import { Perfume } from "@/entities/Perfume.entity";
import { CreatePerfumeDto } from "../dto/createPerfume.dto";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { UpdatePerfumeDto } from "../dto/updatePerfume.dto";
import { InventoryRepositoryInterface } from "@/modules/inventory-module/interface/inventory.repository.interface";
import { PerfumeSize } from "../../../entities/Inventory.entity";

@Injectable()
export class PerfumesService {
  constructor(
    @Inject('PERFUMES_REPOSITORY')
    private perfumesRepository: IPerfumesRepository,
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: InventoryRepositoryInterface,
    private readonly logger: Logger
  ) {}

  async findAllPerfumes(): Promise<Perfume[]> {
    this.logger.log('Finding all perfumes');
    try {
      const perfumes = await this.perfumesRepository.findAllPerfumes();
      if (!perfumes || perfumes.length === 0) {
        throw new NotFoundException('No perfumes registered');
      }
      return perfumes;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding all perfumes: ${error.message}`);
      throw new HttpException(
        'Error when getting the list of perfumes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findPerfumeById(id: number): Promise<Perfume> {
    this.logger.log(`Finding perfume by id: ${id}`);
    try {
      const perfume = await this.perfumesRepository.findPerfumeById(id);
      if (!perfume) {
        throw new NotFoundException(`Perfume not found with id: ${id}`);
      }
      return perfume;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding perfume by id ${id}: ${error.message}`);
      throw new HttpException(
        'Error when searching for perfume',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async createPerfume(perfume: CreatePerfumeDto): Promise<InsertResult> {
    this.logger.log(`Creating perfume: ${JSON.stringify(perfume)}`);
    try {
      if (!perfume.name?.trim()) {
        throw new HttpException(
          'Perfume name is required',
          HttpStatus.BAD_REQUEST
        );
      }
      const existingPerfume = await this.perfumesRepository.findPerfumeByName(perfume.name);
      if (existingPerfume) {
          throw new ConflictException(`Another perfume with the name already exists: ${perfume.name}`);
      }

      const result = await this.perfumesRepository.createPerfume(perfume);

      await Promise.all(Object.values(PerfumeSize).map(async (size) => {
        await this.inventoryRepository.createInventory({
          perfume: result.identifiers[0].id,
          size: size as PerfumeSize,
          stock: 0,
          price: 0,
        });
      }));
      this.logger.log(`Perfume created successfully with id: ${result.identifiers[0].id}`);
      return result;
    } catch (error) {
      if (error instanceof HttpException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error creating perfume: ${error.message}`);
      throw new HttpException(
        'Error when creating perfume',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePerfume(id: number, perfume: UpdatePerfumeDto): Promise<UpdateResult> {
    this.logger.log(`Updating perfume ${id}: ${JSON.stringify(perfume)}`);
    try {
      await this.findPerfumeById(id);
      if (perfume.name) {
        const existingPerfume = await this.perfumesRepository.findPerfumeByName(perfume.name);
        if (existingPerfume && existingPerfume.id !== id) {
          throw new ConflictException(`Another perfume with the name already exists: ${perfume.name}`);
        }
      }

      const result = await this.perfumesRepository.updatePerfume(id, perfume);
      this.logger.log(`Perfume ${id} updated successfully`);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error updating perfume ${id}: ${error.message}`);
      throw new HttpException(
        'Error when updating perfume',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deletePerfume(id: number): Promise<DeleteResult> {
    this.logger.log(`Deleting perfume by id: ${id}`);
    try {
      await this.findPerfumeById(id);
      
      const result = await this.perfumesRepository.deletePerfume(id);
      this.logger.log(`Perfume ${id} deleted successfully`);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error deleting perfume ${id}: ${error.message}`);
      throw new HttpException(
        'Error when deleting perfume',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}