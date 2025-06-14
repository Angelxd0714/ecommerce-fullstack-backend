import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/product.controller';
import { ProductService } from './application/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [InfrastructureController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductsModule {}
