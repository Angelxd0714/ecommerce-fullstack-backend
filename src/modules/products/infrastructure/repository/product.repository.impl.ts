import { Product } from "../../domain/entities/product.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepositoryPort } from "../../domain/ports/product.repository";
import { Repository } from "typeorm";
@Injectable()
export class ProductRepositoryImpl implements ProductRepositoryPort {
    constructor(
        @InjectRepository(Product)
        private readonly repo: Repository<Product>
    ) {}
    async reduceStock(id: string, quantity: number): Promise<void> {
        await this.repo.update(id, {
          stock: () => `stock - ${quantity}`,
          updatedAt: new Date(), // opcional si usas timestamps
        });
      }
      
    findAll(): Promise<Product[]> {
        return this.repo.find();
    }
    findById(id: string): Promise<Product | null> {
        return this.repo.findOneBy({ id });
    }
  
}