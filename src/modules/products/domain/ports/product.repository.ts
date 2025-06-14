import { Product } from "../entities/product.entity";

export interface ProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(product: Product): Promise<Product>;
    update(id: number, product: Product): Promise<Product>;
    delete(id: number): Promise<void>;
}