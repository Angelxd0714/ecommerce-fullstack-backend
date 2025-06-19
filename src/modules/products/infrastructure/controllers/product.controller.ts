import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ProductService } from '../../application/product.service';

import { ProductResponseDto } from '../../application/dto/product-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Products')
@Controller('products/')
export class InfrastructureController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Productos encontrados exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Productos no encontrados',
  })
  async findAll(): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productService.findAll();
      return products.map((product) => new ProductResponseDto(product));
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    try {
      const product = await this.productService.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return new ProductResponseDto(product);
    } catch (error) {
      throw error;
    }
  }
}
