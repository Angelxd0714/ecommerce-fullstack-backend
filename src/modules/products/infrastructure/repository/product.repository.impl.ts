import { ProductRepository } from "../../domain/ports/product.repository";
import { Product } from "../../domain/entities/product.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: ProductRepository
    ) {}
    reduceStock(id: number, quantity: number): Promise<Product> {
        try {
            if(quantity > 0){
                return this.productRepository.reduceStock(id, quantity) as Promise<Product>;
            }
            throw new Error("Quantity must be greater than 0");
        } catch (error) {
            throw error;
        }
    }
    findAll(): Promise<Product[]> {
        try {   
            return this.productRepository.findAll();
        } catch (error) {
            throw error;
        }
    }
    findById(id: number): Promise<Product | null> {
        try {
            return this.productRepository.findById(id);
        } catch (error) {
            throw error;
        }
    }
    create(product: Product): Promise<Product> {
        try {
            return this.productRepository.create(product);
        } catch (error) {
            throw error;
        }
    }
    update(id: number, product: Product): Promise<Product> {
        try {
            return this.productRepository.update(id, product);
        } catch (error) {
            throw error;
        }
    }
    delete(id: number): Promise<void> {
            try {
            return this.productRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}