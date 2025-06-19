import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureController } from '../infrastructure/controllers/deliver.controller';
import { DeliveryService } from '../application/delivery.service';
import { CreateDelivery } from '../application/dto/create-delivery';
import { ResponseDelivery } from '../application/dto/reponse-delivery';
import { Delivery } from '../domain/entities/delivery';

describe('InfrastructureController', () => {
  let controller: InfrastructureController;
  let mockDeliveryService: jest.Mocked<DeliveryService>;

  const mockDelivery: Delivery = {
    id: '1',
    transactionId: 'txn-123',
    address: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    delivered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResponse: ResponseDelivery = {
    id: '1',
    transactionId: 'txn-123',
    address: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    delivered: false,
    createdAt: mockDelivery.createdAt,
    updatedAt: mockDelivery.updatedAt,
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

    controller = module.get<InfrastructureController>(InfrastructureController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /deliveries', () => {
    it('should return an array of deliveries', async () => {
      mockDeliveryService.findAll.mockResolvedValue([mockDelivery]);

      const result = await controller.findAll();

      expect(result).toEqual([mockResponse]);
      expect(mockDeliveryService.findAll).toHaveBeenCalled();
    });

    it('should throw error when service fails', async () => {
      mockDeliveryService.findAll.mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });

  describe('GET /deliveries/:id', () => {
    it('should return a single delivery', async () => {
      mockDeliveryService.findById.mockResolvedValue(mockDelivery);

      const result = await controller.findById('1');

      expect(result).toEqual(mockResponse);
      expect(mockDeliveryService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw 404 error when delivery not found', async () => {
      mockDeliveryService.findById.mockResolvedValue(null);

      await expect(controller.findById('999')).rejects.toThrow();
    });
  });

  describe('POST /deliveries', () => {
    it('should create a new delivery', async () => {
      const createDto: CreateDelivery = {
        transactionId: 'txn-123',
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        delivered: false,
        
      };
  
      mockDeliveryService.create.mockResolvedValue(mockDelivery);
  
      const result = await controller.create(createDto);
  
      expect(result).toEqual(mockResponse);
      expect(mockDeliveryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionId: createDto.transactionId,
          address: createDto.address,
          city: createDto.city,
          postalCode: createDto.postalCode,
          delivered: createDto.delivered,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date), // Ahora pasará con la opción 1
        })
      );
    });
  
    // ... mantener el caso de error
  });

  describe('PATCH /deliveries/:id', () => {
    it('should update a delivery', async () => {
      const updateDto: CreateDelivery = {
        transactionId: 'txn-123-updated',
        address: '456 Second St',
        city: 'Boston',
        postalCode: '02108',
        delivered: true,
       
      };
  
      // Mockear la fecha actual para consistencia en las pruebas
      const testDate = new Date();
      const updatedDelivery = {
        ...mockDelivery,
        ...updateDto,
        updatedAt: testDate,
      };
  
      mockDeliveryService.update.mockResolvedValue(updatedDelivery);
  
      const result = await controller.update('1', updateDto);
  
      // Verificar propiedades sin comparar las fechas directamente
      expect(result).toMatchObject({
        id: '1',
        transactionId: 'txn-123-updated',
        address: '456 Second St',
        city: 'Boston',
        postalCode: '02108',
        delivered: true,
      });
  
      // Verificar que las fechas existen y son instancias de Date
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
  
      // Verificar que se llamó al servicio con los parámetros correctos
      expect(mockDeliveryService.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          transactionId: updateDto.transactionId,
          address: updateDto.address,
          city: updateDto.city,
          postalCode: updateDto.postalCode,
          delivered: updateDto.delivered,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should throw error when update fails', async () => {
      const updateDto: CreateDelivery = {
        transactionId: 'txn-123',
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        delivered: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      mockDeliveryService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update('1', updateDto)).rejects.toThrow('Update failed');
    });
  });

  describe('DELETE /deliveries/:id', () => {
    it('should delete a delivery', async () => {
      mockDeliveryService.delete.mockResolvedValue(undefined);

      await expect(controller.delete('1')).resolves.not.toThrow();
      expect(mockDeliveryService.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error when deletion fails', async () => {
      mockDeliveryService.delete.mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.delete('1')).rejects.toThrow('Deletion failed');
    });
  });
});