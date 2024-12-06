import { Perfume } from "@/entities/Perfume.entity";
import { InsertResult, UpdateResult, DeleteResult } from "typeorm";
import { CreatePerfumeDto } from "../dto/createPerfume.dto";
import { UpdatePerfumeDto } from "../dto/updatePerfume.dto";

export interface IPerfumesRepository {
  findAllPerfumes(): Promise<Perfume[]>;
  findPerfumeById(id: number): Promise<Perfume>;
  findPerfumeByName(name: string): Promise<Perfume>;
  createPerfume(perfume: CreatePerfumeDto): Promise<InsertResult>;
  updatePerfume(id: number, perfume: UpdatePerfumeDto): Promise<UpdateResult>;
  deletePerfume(id: number): Promise<DeleteResult>;
}
