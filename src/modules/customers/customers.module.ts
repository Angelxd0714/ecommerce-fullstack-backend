import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/costumer.controller';
import { CostumerService } from './application/costumer.service';
import { CostumerRepositoryImpl } from './infrastructure/repository/costumer.repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Costumer } from './domain/entities/costumers';
@Module({
  imports: [TypeOrmModule.forFeature([Costumer])],
  controllers: [InfrastructureController],
  providers: [CostumerService, {
    provide: 'CostumerRepositoryPort',
    useClass: CostumerRepositoryImpl,
  }],
  exports: [CostumerService],
})
export class CustomersModule {}
