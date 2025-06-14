import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/product.controller';
import { ProductService } from './application/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';
import { AwsModule } from 'src/shared/aws/aws.module';
import { ProductRepositoryImpl } from './infrastructure/repository/product.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),AwsModule],
  controllers: [InfrastructureController],
  providers: [ProductService,{
    provide: 'ProductRepositoryPort',
    useClass: ProductRepositoryImpl,
  }, ],     
  exports: [ProductService],       
})
export class ProductsModule {}

