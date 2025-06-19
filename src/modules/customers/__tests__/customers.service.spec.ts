import { Test, TestingModule } from '@nestjs/testing';
import { CostumerService } from '../application/costumer.service';
import { CostumerRepositoryPort } from '../domain/ports/costumer.repository';
import { Costumer } from '../domain/entities/costumers';

describe('CostumerService', () => {
  let service: CostumerService;
  let mockRepository: jest.Mocked<CostumerRepositoryPort>;

  const mockCostumer: Costumer = {
    id: '1',
    identity: 123456789,
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
  };

  beforeEach(async () => {
    // Mock del repositorio
    mockRepository = {
      findByIdentity: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CostumerService,
        {
          provide: 'CostumerRepositoryPort',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CostumerService>(CostumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByIdentity', () => {
    it('should return a customer when found', async () => {
      mockRepository.findByIdentity.mockResolvedValue(mockCostumer);
      const result = await service.findByIdentity(123456789);
      expect(result).toEqual(mockCostumer);
      expect(mockRepository.findByIdentity).toHaveBeenCalledWith(123456789);
    });

    it('should return null when customer not found', async () => {
      mockRepository.findByIdentity.mockResolvedValue(null);
      const result = await service.findByIdentity(999999999);
      expect(result).toBeNull();
      expect(mockRepository.findByIdentity).toHaveBeenCalledWith(999999999);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      mockRepository.findAll.mockResolvedValue([mockCostumer]);
      const result = await service.findAll();
      expect(result).toEqual([mockCostumer]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should throw error when no customers found', async () => {
      mockRepository.findAll.mockResolvedValue(null);
      await expect(service.findAll()).rejects.toThrow('Costumers not found');
    });
  });

  describe('findById', () => {
    it('should return a customer by id', async () => {
      mockRepository.findById.mockResolvedValue(mockCostumer);
      const result = await service.findById('1');
      expect(result).toEqual(mockCostumer);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when customer not found by id', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findById('999')).rejects.toThrow(
        'Costumer not found',
      );
    });
  });

  describe('create', () => {
    it('should create and return a new customer', async () => {
      const newCostumer = { ...mockCostumer, id: undefined };
      mockRepository.create.mockResolvedValue(mockCostumer);
      const result = await service.create(newCostumer);
      expect(result).toEqual(mockCostumer);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: newCostumer.name,
          identity: newCostumer.identity,
        }),
      );
    });

    it('should throw error when creation fails', async () => {
      const newCostumer = { ...mockCostumer, id: undefined };
      mockRepository.create.mockResolvedValue(null);
      await expect(service.create(newCostumer)).rejects.toThrow(
        'Costumer not created',
      );
    });
  });

  describe('update', () => {
    const existingCustomer = {
      id: '1',
      identity: 123456789,
      name: 'Existing Customer',
      email: 'existing@example.com',
      phone: '1234567890',
    };
  
    const updateData = {
      name: 'Updated Customer',
      email: 'updated@example.com',
      phone: '0987654321',
    };
  
    it('should update and return the customer', async () => {
      mockRepository.findByIdentity.mockResolvedValue(existingCustomer);
      
      mockRepository.update.mockResolvedValue({
        ...existingCustomer,
        ...updateData
      });
  
      const result = await service.update(123456789, updateData as Costumer);
  
      expect(result).toEqual({
        id: '1',
        identity: 123456789,
        name: 'Updated Customer',
        email: 'updated@example.com',
        phone: '0987654321',
      });
  
      expect(mockRepository.findByIdentity).toHaveBeenCalledWith(123456789);
  
      expect(mockRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          name: 'Updated Customer',
          email: 'updated@example.com',
          phone: '0987654321',
        })
      );
    });
  
    it('should throw error when customer not found', async () => {
      mockRepository.findByIdentity.mockResolvedValue(null);
      
      await expect(service.update(999999999, updateData as Costumer))
        .rejects.toThrow('Costumer not found');
        
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  
    it('should propagate repository errors', async () => {
      mockRepository.findByIdentity.mockResolvedValue(existingCustomer);
      mockRepository.update.mockRejectedValue(new Error('DB Error'));
      
      await expect(service.update(123456789, updateData as Costumer))
        .rejects.toThrow('DB Error');
    });
  });

  it('should delete the customer', async () => {
    mockRepository.findByIdentity.mockResolvedValue({
      id: '1',
      identity: 123456789,
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '1234567890',
    });

    mockRepository.delete.mockResolvedValue(undefined);

    await expect(service.delete(123456789)).resolves.not.toThrow();

    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw error when customer to delete not found', async () => {
    mockRepository.findByIdentity.mockResolvedValue(null);

    await expect(service.delete(999999999)).rejects.toThrow(
      'Costumer not found',
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when customer to delete not found', async () => {
    mockRepository.delete.mockRejectedValue(new Error('Not found'));
    await expect(service.delete(999)).rejects.toThrow('Costumer not found');
  });
});
