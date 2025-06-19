import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from '../application/delivery.service';
import { DeliveryRepositoryPort } from '../domain/ports/delivery.repository';
import { Delivery } from '../domain/entities/delivery';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let mockRepository: jest.Mocked<DeliveryRepositoryPort>;

  const mockDelivery: Delivery = {
    id: '1',
    transactionId: '1',
    address: '123 Main St',
    city: 'City',
    postalCode: '12345',
    delivered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: 'DeliveryRepositoryPort',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of deliveries', async () => {
      mockRepository.findAll.mockResolvedValue([mockDelivery]);

      const result = await service.findAll();

      expect(result).toEqual([mockDelivery]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should throw error when no deliveries found', async () => {
      mockRepository.findAll.mockResolvedValue(null);

      await expect(service.findAll()).rejects.toThrow('Delivery not found');
    });
  });

  describe('findById', () => {
    it('should return a delivery by id', async () => {
      mockRepository.findById.mockResolvedValue(mockDelivery);

      const result = await service.findById('1');

      expect(result).toEqual(mockDelivery);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when delivery not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow('Delivery not found');
    });
  });

  describe('create', () => {
    it('should create and return a new delivery', async () => {
      const newDelivery = { ...mockDelivery, id: undefined };
      mockRepository.create.mockResolvedValue(mockDelivery);

      const result = await service.create(newDelivery);

      expect(result).toEqual(mockDelivery);
      expect(mockRepository.create).toHaveBeenCalledWith(newDelivery);
    });

    it('should throw error when creation fails', async () => {
      const newDelivery = { ...mockDelivery, id: undefined };
      mockRepository.create.mockResolvedValue(null);

      await expect(service.create(newDelivery)).rejects.toThrow('Delivery not found');
    });
  });

  describe('update', () => {
    it('should update and return the delivery', async () => {
      const updatedData = { ...mockDelivery, status: 'shipped' };
      mockRepository.update.mockResolvedValue(updatedData);

      const result = await service.update('1', updatedData);

      expect(result).toEqual(updatedData);
      expect(mockRepository.update).toHaveBeenCalledWith('1', updatedData);
    });

    it('should throw error when update fails', async () => {
      const updatedData = { ...mockDelivery, status: 'shipped' };
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('1', updatedData)).rejects.toThrow('Delivery not found');
    });
  });

  describe('delete', () => {
    it('should delete the delivery without throwing', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete('1')).resolves.not.toThrow();
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should propagate repository errors', async () => {
      mockRepository.delete.mockRejectedValue(new Error('DB Error'));

      await expect(service.delete('1')).rejects.toThrow('DB Error');
    });
  });
});