import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { AwsS3Service } from './shared/aws/s3/aws-s3.service';
import { seedProducts } from './seed/product.seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Backend API Ecommerce')
    .setDescription('API for Ecommerce Fullstack')
    .setVersion('1.0')
    .addTag('Ecommerce Fullstack')
    
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
   // Configuración CORS más estricta
   app.enableCors({
    origin: 'http://localhost:5173', // Especifica exactamente tu origen frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
  const dataSource = app.get(DataSource);
  const s3Service = app.get(AwsS3Service);

  await seedProducts(dataSource, s3Service);
}
bootstrap();
