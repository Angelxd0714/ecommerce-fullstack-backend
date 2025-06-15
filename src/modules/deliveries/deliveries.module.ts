import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/deliver.controller';
import { DeliveryService } from './application/delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './domain/entities/delivery';
import { DeliveryRepositoryImpl } from './infrastructure/repository/deliver.repository.impl';
@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  controllers: [InfrastructureController],
  providers: [DeliveryService,{
     provide: 'DeliveryRepositoryPort',
     useClass: DeliveryRepositoryImpl
  }],
  exports: [DeliveryService]
})
export class DeliveriesModule {}
