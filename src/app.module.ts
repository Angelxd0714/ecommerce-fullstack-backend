import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/ormconfig';
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProductsModule, TransactionsModule, CustomersModule, DeliveriesModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
