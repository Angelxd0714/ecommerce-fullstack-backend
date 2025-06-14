import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ProductService } from '../../application/product.service';

import { UpdateStockDto } from '../../application/dto/update-stock.dto';
import { ProductResponseDto } from '../../application/dto/product-response.dto';

@Controller('products')
export class InfrastructureController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productService.findAll();
    return products.map(product => new ProductResponseDto(product));
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ProductResponseDto> {
    const product = await this.productService.findById(id);
    return new ProductResponseDto(product);
  }
  @Patch(':id/reduce-stock')
  async updateStock(@Param('id') id: number, @Body() body: UpdateStockDto) {
    const product = await this.productService.reduceStock(id, body.quantity);
    return new ProductResponseDto(product);
  }
}
