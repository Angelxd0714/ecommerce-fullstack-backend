import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/infrastructure.controller';
import { ApplicationService } from './application/application.service';

@Module({
  controllers: [InfrastructureController],
  providers: [ApplicationService]
})
export class CustomersModule {}
