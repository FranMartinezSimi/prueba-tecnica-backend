import { Brand } from "@/entities/Brand.entity";
import { CreateBrandDto } from "../dto/create.dto";
import { UpdateBrandDto } from "../dto/update.dto";
import { UpdateResult, DeleteResult, InsertResult } from "typeorm";

export interface IBrandsRepository {
  findAllBrands(): Promise<Brand[]>;
  findBrandById(id: number): Promise<Brand>;
  findBrandByName(name: string): Promise<Brand>;
  createBrand(brand: CreateBrandDto): Promise<InsertResult>;
  updateBrand(id: number, brand: UpdateBrandDto): Promise<UpdateResult>;
  deleteBrand(id: number): Promise<DeleteResult>;
}
