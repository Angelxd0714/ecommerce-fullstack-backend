import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsModule } from '../products.module';
import { ProductService } from '../application/product.service';
import { ProductResponseDto } from '../application/dto/product-response.dto';

describe('InfrastructureController (e2e)', () => {
  let app: INestApplication;
  let productService: ProductService;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    category: 'electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'Test Product',
    image: 'test.jpg',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productService = moduleFixture.get<ProductService>(ProductService);
  });

  describe('GET /products', () => {
    it('should return array of products (200)', async () => {
      jest.spyOn(productService, 'findAll').mockResolvedValue([mockProduct]);

      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([new ProductResponseDto(mockProduct)]);
        });
    });

    it('should return 404 when no products found', async () => {
      jest.spyOn(productService, 'findAll').mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/products')
        .expect(404);
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product (200)', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValue(mockProduct);

      return request(app.getHttpServer())
        .get('/products/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(new ProductResponseDto(mockProduct));
        });
    });

    it('should return 404 when product not found', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/products/999')
        .expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
}); 