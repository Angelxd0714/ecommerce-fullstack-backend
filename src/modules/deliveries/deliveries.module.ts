import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/deliver.controller';
import { ApplicationService } from './application/application.service';

@Module({
  controllers: [InfrastructureController],
  providers: [ApplicationService]
})
export class DeliveriesModule {}
