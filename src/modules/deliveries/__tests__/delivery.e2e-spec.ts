import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DeliveryService } from '../application/delivery.service';
import { DeliveryRepositoryPort } from '../domain/ports/delivery.repository';
import { ResponseDelivery } from '../application/dto/reponse-delivery';
import { InfrastructureController } from '../infrastructure/controllers/deliver.controller';
import { CreateDelivery } from '../application/dto/create-delivery';
 describe('DeliveryController (e2e)', () => {
  let app: INestApplication;
  let mockDeliveryService: jest.Mocked<DeliveryService>;
  let mockDeliveryRepository: jest.Mocked<DeliveryRepositoryPort>;

  const mockDelivery: ResponseDelivery = {
    id: '1',
    transactionId: '123456789',
    address: '123 Main St',
    city: 'Test City',
    postalCode: '12345',
    delivered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
   beforeEach(async () => {
    mockDeliveryService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<DeliveryService>;

    mockDeliveryRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureController],
      providers: [
        {
          provide: DeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('DeliveryController (e2e)', () => {
    let app: INestApplication;
    let mockDeliveryService: jest.Mocked<DeliveryService>;
  
    // Configuración de fechas mockeadas
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-06-19T00:00:00Z'));
    });
  
    afterAll(() => {
      jest.useRealTimers();
    });
  
    const mockDelivery: ResponseDelivery = {
      id: '1',
      transactionId: '123456789',
      address: '123 Main St',
      city: 'Test City',
      postalCode: '12345',
      delivered: false,
      createdAt: new Date('2025-06-19T00:00:00Z'),
      updatedAt: new Date('2025-06-19T00:00:00Z'),
    };
  
    beforeEach(async () => {
      mockDeliveryService = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      } as unknown as jest.Mocked<DeliveryService>;
  
      const module: TestingModule = await Test.createTestingModule({
        controllers: [InfrastructureController],
        providers: [
          {
            provide: DeliveryService,
            useValue: mockDeliveryService,
          },
        ],
      }).compile();
  
      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }));
      await app.init();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    describe('GET /deliveries', () => {
      it('should return all deliveries (200)', async () => {
        mockDeliveryService.findAll.mockResolvedValue([mockDelivery]);
  
        return request(app.getHttpServer())
          .get('/deliveries')
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual([mockDelivery]);
            expect(mockDeliveryService.findAll).toHaveBeenCalled();
          });
      });
  
      it('should handle service errors (500)', async () => {
        mockDeliveryService.findAll.mockRejectedValue(new Error('DB Error'));
  
        return request(app.getHttpServer())
          .get('/deliveries')
          .expect(500);
      });
    });
  
    describe('GET /deliveries/:id', () => {
      it('should return a delivery by id (200)', async () => {
        mockDeliveryService.findById.mockResolvedValue(mockDelivery);
  
        return request(app.getHttpServer())
          .get('/deliveries/1')
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual(mockDelivery);
            expect(mockDeliveryService.findById).toHaveBeenCalledWith('1');
          });
      });
  
      it('should return 404 for non-existent delivery', async () => {
        mockDeliveryService.findById.mockResolvedValue(null);
  
        return request(app.getHttpServer())
          .get('/deliveries/999')
          .expect(404);
      });
    });
  
    describe('POST /deliveries', () => {
      const validDto: CreateDelivery = {
        transactionId: '123456789',
        address: '123 Main St',
        city: 'Test City',
        postalCode: '12345',
        delivered: false,
      };
  
      it('should create a new delivery (201)', async () => {
        mockDeliveryService.create.mockResolvedValue(mockDelivery);
  
        return request(app.getHttpServer())
          .post('/deliveries')
          .send(validDto)
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual(mockDelivery);
            expect(mockDeliveryService.create).toHaveBeenCalledWith(
              expect.objectContaining(validDto)
            );
          });
      });
  
      it('should return 400 for invalid data', async () => {
        const invalidDto = {
          address: '', // Inválido: vacío
          city: 'A', // Inválido: muy corto
          postalCode: 'invalid', // Inválido: no numérico
        };
  
        return request(app.getHttpServer())
          .post('/deliveries')
          .send(invalidDto)
          .expect(400);
      });
  
      it('should ignore non-whitelisted properties', async () => {
        const dtoWithExtra = { ...validDto, extraField: 'should be ignored' };
        mockDeliveryService.create.mockResolvedValue(mockDelivery);
  
        return request(app.getHttpServer())
          .post('/deliveries')
          .send(dtoWithExtra)
          .expect(201)
          .expect(res => {
            expect(res.body).not.toHaveProperty('extraField');
          });
      });
    });
  
    describe('PATCH /deliveries/:id', () => {
      const updateDto: CreateDelivery = {
        transactionId: '123456789',
        address: '123 Main St',
        city: 'Test City',
        postalCode: '12345',
        delivered: false,
      };
  
      it('should update a delivery (200)', async () => {
        mockDeliveryService.update.mockResolvedValue(mockDelivery);
  
        return request(app.getHttpServer())
          .patch('/deliveries/1')
          .send(updateDto)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual(mockDelivery);
            expect(mockDeliveryService.update).toHaveBeenCalledWith(
              '1',
              expect.objectContaining(updateDto)
            );
          });
      });
  
      it('should return 404 for non-existent delivery', async () => {
        mockDeliveryService.update.mockResolvedValue(null);
  
        return request(app.getHttpServer())
          .patch('/deliveries/999')
          .send(updateDto)
          .expect(404);
      });
    });
  
    describe('DELETE /deliveries/:id', () => {
      it('should delete a delivery (204)', async () => {
        mockDeliveryService.delete.mockResolvedValue(undefined);
  
        return request(app.getHttpServer())
          .delete('/deliveries/1')
          .expect(204)
          .then(() => {
            expect(mockDeliveryService.delete).toHaveBeenCalledWith('1');
          });
      });
  
      it('should return 500 on service error', async () => {
        mockDeliveryService.delete.mockRejectedValue(new Error('DB Error'));
  
        return request(app.getHttpServer())
          .delete('/deliveries/1')
          .expect(500);
      });
    });
  });
});