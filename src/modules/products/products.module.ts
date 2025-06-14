import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/infrastructure.controller';
import { ApplicationService } from './application/product.service';

@Module({
  controllers: [InfrastructureController],
  providers: [ApplicationService]
})
export class ProductsModule {}
