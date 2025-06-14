import { Injectable } from '@nestjs/common';
import { ProductServiceInterface } from '../domain/ports/product.service.interface';
import { ProductRepository } from '../domain/ports/product.repository';
import { Product } from '../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService implements ProductServiceInterface {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
  ) {}
  reduceStock(id: number, quantity: number) {
    return this.productRepository.reduceStock(id, quantity);
  }
  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  findById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  create(product: Product): Promise<Product> {
    return this.productRepository.create(product);
  }

  update(id: number, product: Product): Promise<Product> {
    return this.productRepository.update(id, product);
  }

  delete(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }
}
