import { Inventory, PerfumeSize } from "@/entities/Inventory.entity";
import { UpdateResult, InsertResult } from "typeorm";
import { CreateInventoryData } from "../dto/CreateInventory.dto";
import { UpdateInventoryData } from "../dto/UpdateInventory.dto";

export interface InventoryRepositoryInterface {
    findAllInventories(): Promise<Inventory[]>;
    findInventoryById(id: number): Promise<Inventory>;
    createInventory(data: CreateInventoryData): Promise<InsertResult>;
    updateInventory(id: number, data: UpdateInventoryData): Promise<UpdateResult>;
    updateStock(id: number, quantity: number): Promise<Inventory>;
    searchInventory(filters: {
        query?: string;
        size?: PerfumeSize;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
    }): Promise<Inventory[]>;
}