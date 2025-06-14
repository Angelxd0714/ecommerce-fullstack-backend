import { Product } from "../entities/product.entity";

export interface ProductServiceInterface {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    reduceStock(id: string, quantity: number): Promise<void>;
}