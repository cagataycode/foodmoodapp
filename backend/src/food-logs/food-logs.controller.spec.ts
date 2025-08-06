import { Test, TestingModule } from '@nestjs/testing';
import { FoodLogsController } from './food-logs.controller';
import { FoodLogsService } from './food-logs.service';
import {
  CreateFoodLogDto,
  UpdateFoodLogDto,
  FoodLogFiltersDto,
} from '../common/dto/food-log.dto';
import { NotFoundException } from '@nestjs/common';

describe('FoodLogsController', () => {
  let controller: FoodLogsController;
  let foodLogsService: FoodLogsService;

  const mockFoodLogsService = {
    createFoodLog: jest.fn(),
    getFoodLogs: jest.fn(),
    getFoodLogById: jest.fn(),
    updateFoodLog: jest.fn(),
    deleteFoodLog: jest.fn(),
    getFoodLogStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodLogsController],
      providers: [
        {
          provide: FoodLogsService,
          useValue: mockFoodLogsService,
        },
      ],
    }).compile();

    controller = module.get<FoodLogsController>(FoodLogsController);
    foodLogsService = module.get<FoodLogsService>(FoodLogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFoodLog', () => {
    const validCreateFoodLogDto: CreateFoodLogDto = {
      food_name: 'Oatmeal with berries',
      meal_type: 'breakfast',
      moods: ['energised', 'satisfied'],
      meal_time: '2024-01-15T08:30:00Z',
      portion_size: '1 cup',
      notes: 'Added honey and cinnamon',
    };

    const mockFoodLog = {
      id: 'food-log-123',
      user_id: 'user-123',
      food_name: 'Oatmeal with berries',
      meal_type: 'breakfast',
      moods: ['energised', 'satisfied'],
      meal_time: '2024-01-15T08:30:00Z',
      portion_size: '1 cup',
      notes: 'Added honey and cinnamon',
      created_at: '2024-01-15T08:30:00Z',
      updated_at: '2024-01-15T08:30:00Z',
    };

    describe('happy path', () => {
      it('should create a food log successfully', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.createFoodLog.mockResolvedValue(mockFoodLog);

        // Act
        const result = await controller.createFoodLog(
          mockRequest,
          validCreateFoodLogDto,
        );

        // Assert
        expect(foodLogsService.createFoodLog).toHaveBeenCalledWith(
          'user-123',
          validCreateFoodLogDto,
        );
        expect(result).toEqual({
          success: true,
          data: mockFoodLog,
          message: 'Food log created successfully',
        });
      });
    });

    describe('unhappy path', () => {
      it('should throw error when service fails', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.createFoodLog.mockRejectedValue(
          new Error('Failed to create food log'),
        );

        // Act & Assert
        await expect(
          controller.createFoodLog(mockRequest, validCreateFoodLogDto),
        ).rejects.toThrow('Failed to create food log');
        expect(foodLogsService.createFoodLog).toHaveBeenCalledWith(
          'user-123',
          validCreateFoodLogDto,
        );
      });
    });
  });

  describe('getFoodLogs', () => {
    const mockFoodLogs = [
      {
        id: 'food-log-123',
        user_id: 'user-123',
        food_name: 'Oatmeal with berries',
        meal_type: 'breakfast',
        moods: ['energised', 'satisfied'],
        meal_time: '2024-01-15T08:30:00Z',
        portion_size: '1 cup',
        notes: 'Added honey and cinnamon',
        created_at: '2024-01-15T08:30:00Z',
        updated_at: '2024-01-15T08:30:00Z',
      },
    ];

    const filters: FoodLogFiltersDto = {
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-01-31T23:59:59Z',
      moods: ['energised'],
      food_name: 'oatmeal',
      limit: 10,
      offset: 0,
    };

    describe('happy path', () => {
      it('should get food logs successfully', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.getFoodLogs.mockResolvedValue(mockFoodLogs);

        // Act
        const result = await controller.getFoodLogs(mockRequest, filters);

        // Assert
        expect(foodLogsService.getFoodLogs).toHaveBeenCalledWith(
          'user-123',
          filters,
        );
        expect(result).toEqual({
          success: true,
          data: mockFoodLogs,
        });
      });

      it('should get food logs without filters', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.getFoodLogs.mockResolvedValue(mockFoodLogs);

        // Act
        const result = await controller.getFoodLogs(mockRequest, {});

        // Assert
        expect(foodLogsService.getFoodLogs).toHaveBeenCalledWith(
          'user-123',
          {},
        );
        expect(result).toEqual({
          success: true,
          data: mockFoodLogs,
        });
      });
    });

    describe('unhappy path', () => {
      it('should throw error when service fails', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.getFoodLogs.mockRejectedValue(
          new Error('Failed to fetch food logs'),
        );

        // Act & Assert
        await expect(
          controller.getFoodLogs(mockRequest, filters),
        ).rejects.toThrow('Failed to fetch food logs');
        expect(foodLogsService.getFoodLogs).toHaveBeenCalledWith(
          'user-123',
          filters,
        );
      });
    });
  });

  describe('getFoodLogStats', () => {
    const mockStats = {
      totalLogs: 5,
      moodCounts: { energised: 3, satisfied: 2 },
      mostCommonMood: 'energised',
      averageMoodScore: 7.5,
      period: {
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-31T23:59:59Z',
      },
    };

    describe('happy path', () => {
      it('should get food log stats successfully', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const startDate = '2024-01-01T00:00:00Z';
        const endDate = '2024-01-31T23:59:59Z';
        mockFoodLogsService.getFoodLogStats.mockResolvedValue(mockStats);

        // Act
        const result = await controller.getFoodLogStats(
          mockRequest,
          startDate,
          endDate,
        );

        // Assert
        expect(foodLogsService.getFoodLogStats).toHaveBeenCalledWith(
          'user-123',
          startDate,
          endDate,
        );
        expect(result).toEqual({
          success: true,
          data: mockStats,
        });
      });

      it('should get food log stats without date range', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.getFoodLogStats.mockResolvedValue(mockStats);

        // Act
        const result = await controller.getFoodLogStats(mockRequest);

        // Assert
        expect(foodLogsService.getFoodLogStats).toHaveBeenCalledWith(
          'user-123',
          undefined,
          undefined,
        );
        expect(result).toEqual({
          success: true,
          data: mockStats,
        });
      });
    });

    describe('unhappy path', () => {
      it('should throw error when service fails', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        mockFoodLogsService.getFoodLogStats.mockRejectedValue(
          new Error('Failed to fetch food log statistics'),
        );

        // Act & Assert
        await expect(controller.getFoodLogStats(mockRequest)).rejects.toThrow(
          'Failed to fetch food log statistics',
        );
        expect(foodLogsService.getFoodLogStats).toHaveBeenCalledWith(
          'user-123',
          undefined,
          undefined,
        );
      });
    });
  });

  describe('getFoodLogById', () => {
    const mockFoodLog = {
      id: 'food-log-123',
      user_id: 'user-123',
      food_name: 'Oatmeal with berries',
      meal_type: 'breakfast',
      moods: ['energised', 'satisfied'],
      meal_time: '2024-01-15T08:30:00Z',
      portion_size: '1 cup',
      notes: 'Added honey and cinnamon',
      created_at: '2024-01-15T08:30:00Z',
      updated_at: '2024-01-15T08:30:00Z',
    };

    describe('happy path', () => {
      it('should get food log by ID successfully', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'food-log-123';
        mockFoodLogsService.getFoodLogById.mockResolvedValue(mockFoodLog);

        // Act
        const result = await controller.getFoodLogById(mockRequest, foodLogId);

        // Assert
        expect(foodLogsService.getFoodLogById).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
        );
        expect(result).toEqual({
          success: true,
          data: mockFoodLog,
        });
      });
    });

    describe('unhappy path', () => {
      it('should throw NotFoundException when food log not found', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'non-existent-id';
        mockFoodLogsService.getFoodLogById.mockRejectedValue(
          new NotFoundException('Food log not found'),
        );

        // Act & Assert
        await expect(
          controller.getFoodLogById(mockRequest, foodLogId),
        ).rejects.toThrow(NotFoundException);
        await expect(
          controller.getFoodLogById(mockRequest, foodLogId),
        ).rejects.toThrow('Food log not found');
        expect(foodLogsService.getFoodLogById).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
        );
      });
    });
  });

  describe('updateFoodLog', () => {
    const validUpdateFoodLogDto: UpdateFoodLogDto = {
      food_name: 'Updated oatmeal',
      moods: ['happy', 'satisfied'],
      notes: 'Updated notes',
    };

    const updatedFoodLog = {
      id: 'food-log-123',
      user_id: 'user-123',
      food_name: 'Updated oatmeal',
      meal_type: 'breakfast',
      moods: ['happy', 'satisfied'],
      meal_time: '2024-01-15T08:30:00Z',
      portion_size: '1 cup',
      notes: 'Updated notes',
      created_at: '2024-01-15T08:30:00Z',
      updated_at: '2024-01-15T08:30:00Z',
    };

    describe('happy path', () => {
      it('should update food log successfully', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'food-log-123';
        mockFoodLogsService.updateFoodLog.mockResolvedValue(updatedFoodLog);

        // Act
        const result = await controller.updateFoodLog(
          mockRequest,
          foodLogId,
          validUpdateFoodLogDto,
        );

        // Assert
        expect(foodLogsService.updateFoodLog).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
          validUpdateFoodLogDto,
        );
        expect(result).toEqual({
          success: true,
          data: updatedFoodLog,
          message: 'Food log updated successfully',
        });
      });
    });

    describe('unhappy path', () => {
      it('should throw NotFoundException when food log not found', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'non-existent-id';
        mockFoodLogsService.updateFoodLog.mockRejectedValue(
          new NotFoundException('Food log not found'),
        );

        // Act & Assert
        await expect(
          controller.updateFoodLog(
            mockRequest,
            foodLogId,
            validUpdateFoodLogDto,
          ),
        ).rejects.toThrow(NotFoundException);
        await expect(
          controller.updateFoodLog(
            mockRequest,
            foodLogId,
            validUpdateFoodLogDto,
          ),
        ).rejects.toThrow('Food log not found');
        expect(foodLogsService.updateFoodLog).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
          validUpdateFoodLogDto,
        );
      });

      it('should throw error when update fails', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'food-log-123';
        mockFoodLogsService.updateFoodLog.mockRejectedValue(
          new Error('Failed to update food log'),
        );

        // Act & Assert
        await expect(
          controller.updateFoodLog(
            mockRequest,
            foodLogId,
            validUpdateFoodLogDto,
          ),
        ).rejects.toThrow('Failed to update food log');
        expect(foodLogsService.updateFoodLog).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
          validUpdateFoodLogDto,
        );
      });
    });
  });

  describe('deleteFoodLog', () => {
    describe('happy path', () => {
      it('should delete food log successfully', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'food-log-123';
        mockFoodLogsService.deleteFoodLog.mockResolvedValue(undefined);

        // Act
        await controller.deleteFoodLog(mockRequest, foodLogId);

        // Assert
        expect(foodLogsService.deleteFoodLog).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
        );
      });
    });

    describe('unhappy path', () => {
      it('should throw NotFoundException when food log not found', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'non-existent-id';
        mockFoodLogsService.deleteFoodLog.mockRejectedValue(
          new NotFoundException('Food log not found'),
        );

        // Act & Assert
        await expect(
          controller.deleteFoodLog(mockRequest, foodLogId),
        ).rejects.toThrow(NotFoundException);
        await expect(
          controller.deleteFoodLog(mockRequest, foodLogId),
        ).rejects.toThrow('Food log not found');
        expect(foodLogsService.deleteFoodLog).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
        );
      });

      it('should throw error when deletion fails', async () => {
        // Arrange
        const mockRequest = { user: { id: 'user-123' } };
        const foodLogId = 'food-log-123';
        mockFoodLogsService.deleteFoodLog.mockRejectedValue(
          new Error('Failed to delete food log'),
        );

        // Act & Assert
        await expect(
          controller.deleteFoodLog(mockRequest, foodLogId),
        ).rejects.toThrow('Failed to delete food log');
        expect(foodLogsService.deleteFoodLog).toHaveBeenCalledWith(
          'user-123',
          foodLogId,
        );
      });
    });
  });
});
