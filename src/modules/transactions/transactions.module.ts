import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/transaction.controller';
import { TransactionService } from './application/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/entities/transaction';
import { TransactionRepositoryImpl } from './infrastructure/repository/transaction.repository.impl';
import { HttpModule } from '@nestjs/axios';
import { AwsModule } from 'src/shared/aws/aws.module';
import { CostumerModule } from 'src/modules/customers/costumer.module';
import { ProductsModule } from 'src/modules/products/products.module';
import { DeliveriesModule } from 'src/modules/deliveries/deliveries.module';
@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),AwsModule,CostumerModule,ProductsModule,DeliveriesModule],
  controllers: [InfrastructureController],
  providers: [TransactionService,{
    provide: 'TransactionRepositoryPort',
    useClass: TransactionRepositoryImpl,
    
    
  }],
  exports: [TransactionService]

})
export class TransactionsModule {}
