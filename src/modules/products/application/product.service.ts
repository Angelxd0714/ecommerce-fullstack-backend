import { Inject, Injectable } from '@nestjs/common';
import { ProductServiceInterface } from '../domain/ports/product.service.interface';
import { Product } from '../domain/entities/product.entity';
import { ProductRepositoryPort } from '../domain/ports/product.repository';

@Injectable()
export class ProductService implements ProductServiceInterface {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async reduceStock(id: string, quantity: number): Promise<void> {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.stock < quantity) {
      throw new Error('Not enough stock');
    }
    product.stock -= quantity;
    return this.productRepository.reduceStock(id, quantity);
  }
  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    if (!products) {
      throw new Error('Products not found');
    }
    return products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}
