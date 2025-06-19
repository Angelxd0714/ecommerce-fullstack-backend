import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CostumerModule } from '../costumer.module';
import { CostumerService } from '../application/costumer.service';
import { CostumerRepositoryPort } from '../domain/ports/costumer.repository';
import { CreateCostumerDto } from '../application/dto/create-costumer';
import { ResponseCostumerDto } from '../application/dto/reponse-costumer';
import { ValidationPipe } from '@nestjs/common';

describe('CostumerController (e2e)', () => {
  let app: INestApplication;
  let mockCostumerService: jest.Mocked<CostumerService>;
  let mockCostumerRepository: jest.Mocked<CostumerRepositoryPort>;

  const mockCostumer: ResponseCostumerDto = {
    id: '1',
    identity: 123456789,
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockCostumerService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByIdentity: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CostumerService>;

    mockCostumerRepository = {
      findByIdentity: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CostumerModule],
      providers: [
        {
          provide: CostumerService,
          useValue: mockCostumerService,
        },
        {
          provide: 'CostumerRepositoryPort',
          useValue: mockCostumerRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /customers', () => {
    it('should create a new customer (201)', async () => {
      const createDto: CreateCostumerDto = {
        name: 'Test Customer',
        identity: 123456789,
        email: 'test@example.com',
        phone: '1234567890',
      };

      mockCostumerService.create.mockResolvedValue(mockCostumer);

      return request(app.getHttpServer())
        .post('/customers')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockCostumer);
          expect(mockCostumerService.create).toHaveBeenCalledWith(
            expect.objectContaining(createDto)
          );
        });
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        name: '', // Invalid empty name
        identity: 'not-a-number', // Should be number
        email: 'invalid-email',
        phone: '',
      };

      return request(app.getHttpServer())
        .post('/customers')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /customers', () => {
    it('should return all customers (200)', async () => {
      mockCostumerService.findAll.mockResolvedValue([mockCostumer]);

      return request(app.getHttpServer())
        .get('/customers')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([mockCostumer]);
          expect(mockCostumerService.findAll).toHaveBeenCalled();
        });
    });

    it('should return 400 if no customers found', async () => {
      mockCostumerService.findAll.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/customers')
        .expect(400);
    });
  });

  describe('GET /customers/:identity', () => {
    it('should return a customer by identity (200)', async () => {
      mockCostumerService.findByIdentity.mockResolvedValue(mockCostumer);

      return request(app.getHttpServer())
        .get('/customers/123456789')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockCostumer);
          expect(mockCostumerService.findByIdentity).toHaveBeenCalledWith(123456789);
        });
    });

    it('should return 400 if customer not found', async () => {
      mockCostumerService.findByIdentity.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/customers/999999999')
        .expect(400);
    });
  });

  describe('PATCH /customers/:identity', () => {
    it('should update a customer (200)', async () => {
      const updateDto: CreateCostumerDto = {
        name: 'Updated Customer',
        identity: 123456789,
        email: 'updated@example.com',
        phone: '0987654321',
      };

      mockCostumerService.update.mockResolvedValue({
        ...mockCostumer,
        ...updateDto,
      });

      return request(app.getHttpServer())
        .patch('/customers/123456789')
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            ...mockCostumer,
            ...updateDto,
          });
          expect(mockCostumerService.update).toHaveBeenCalledWith(
            123456789,
            expect.objectContaining({
              name: updateDto.name,
              email: updateDto.email,
              phone: updateDto.phone,
            })
          );
        });
    });

    it('should return 400 if update fails', async () => {
      const updateDto: CreateCostumerDto = {
        name: 'Updated Customer',
        identity: 123456789,
        email: 'updated@example.com',
        phone: '0987654321',
      };

      mockCostumerService.update.mockResolvedValue(null);

      return request(app.getHttpServer())
        .patch('/customers/123456789')
        .send(updateDto)
        .expect(400);
    });
  });

  describe('DELETE /customers/:identity', () => {
    it('should delete a customer (204)', async () => {
      mockCostumerService.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete('/customers/123456789')
        .expect(204)
        .then(() => {
          expect(mockCostumerService.delete).toHaveBeenCalledWith(123456789);
        });
    });

    it('should return 400 if deletion fails', async () => {
      mockCostumerService.delete.mockRejectedValue(new Error('Deletion failed'));

      return request(app.getHttpServer())
        .delete('/customers/123456789')
        .expect(400);
    });
  });
});