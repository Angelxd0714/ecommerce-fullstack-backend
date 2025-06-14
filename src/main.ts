import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { AwsS3Service } from './shared/aws/s3/aws-s3.service';
import { seedProducts } from './seed/product.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  const dataSource = app.get(DataSource);
  const s3Service = app.get(AwsS3Service);

  await seedProducts(dataSource, s3Service);
}
bootstrap();
