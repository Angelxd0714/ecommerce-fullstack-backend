import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CostumerModule } from './modules/customers/costumer.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/ormconfig';
import { CorsMiddleware } from './middlewares/cors.middleware';
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProductsModule, TransactionsModule, CostumerModule, DeliveriesModule],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorsMiddleware).forRoutes('*');
    }
}
