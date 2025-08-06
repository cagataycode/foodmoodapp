import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FoodLogsService } from './food-logs.service';
import { NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('FoodLogsService', () => {
  let service: FoodLogsService;
  let mockSupabaseClient: any;

  // Test data
  const userId = 'user-123';
  const foodLogId = 'food-log-123';
  const baseFoodLog = {
    id: foodLogId,
    user_id: userId,
    food_name: 'Oatmeal with berries',
    meal_type: 'breakfast' as const,
    moods: ['energised', 'satisfied'] as ['energised', 'satisfied'],
    meal_time: '2024-01-15T08:30:00Z',
    portion_size: '1 cup',
    notes: 'Added honey and cinnamon',
    created_at: '2024-01-15T08:30:00Z',
    updated_at: '2024-01-15T08:30:00Z',
  };

  const mockStatsFoodLogs = [
    {
      id: '1',
      user_id: userId,
      food_name: 'Oatmeal',
      moods: ['energised', 'satisfied'],
      meal_time: '2024-01-15T08:30:00Z',
    },
    {
      id: '2',
      user_id: userId,
      food_name: 'Salad',
      moods: ['energised', 'happy'],
      meal_time: '2024-01-15T12:30:00Z',
    },
    {
      id: '3',
      user_id: userId,
      food_name: 'Pizza',
      moods: ['satisfied', 'sluggish'],
      meal_time: '2024-01-15T18:30:00Z',
    },
  ];

  // Generic test helpers
  const createMockQuery = () => {
    const query: any = {};
    [
      'select',
      'eq',
      'order',
      'gte',
      'lte',
      'in',
      'ilike',
      'limit',
      'range',
      'single',
      'update',
      'delete',
    ].forEach(method => {
      query[method] = jest.fn().mockReturnThis();
    });
    return query;
  };

  const createAsyncMock = (data: any, error: any = null) => {
    const query = createMockQuery();
    Object.assign(query, { then: (resolve: any) => resolve({ data, error }) });
    return query;
  };

  const setupMock = (mockFrom: any) => {
    mockSupabaseClient.from.mockImplementation(mockFrom);
  };

  beforeEach(async () => {
    mockSupabaseClient = { from: jest.fn() };
    const mockConfigService = {
      get: jest.fn(
        (key: string) =>
          ({
            SUPABASE_URL: 'https://test.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
          })[key] || null,
      ),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    const module = await Test.createTestingModule({
      providers: [
        FoodLogsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<FoodLogsService>(FoodLogsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createFoodLog', () => {
    const createData = {
      food_name: 'Oatmeal with berries',
      meal_type: 'breakfast' as const,
      moods: ['energised', 'satisfied'] as ['energised', 'satisfied'],
      meal_time: '2024-01-15T08:30:00Z',
      portion_size: '1 cup',
      notes: 'Added honey and cinnamon',
    };

    it('should create successfully', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest
              .fn()
              .mockResolvedValue({ data: baseFoodLog, error: null }),
          }),
        }),
      });
      setupMock(mockFrom);
      const result = await service.createFoodLog(userId, createData);
      expect(result).toEqual(baseFoodLog);
    });

    it('should throw on creation failure', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Creation failed' },
            }),
          }),
        }),
      });
      setupMock(mockFrom);
      await expect(service.createFoodLog(userId, createData)).rejects.toThrow(
        'Failed to create food log',
      );
    });
  });

  describe('getFoodLogs', () => {
    it('should get logs without filters', async () => {
      const mockQuery = createMockQuery();
      mockQuery.order.mockResolvedValue({ data: [baseFoodLog], error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogs(userId);
      expect(result).toEqual([baseFoodLog]);
    });

    it('should get logs with filters', async () => {
      const filters = {
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        moods: ['energised'] as ['energised'],
        food_name: 'oatmeal',
        limit: 10,
        offset: 5,
      };
      const mockQuery = createAsyncMock([baseFoodLog]);
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogs(userId, filters);
      expect(result).toEqual([baseFoodLog]);
    });

    it('should throw on fetch failure', async () => {
      const mockQuery = createMockQuery();
      mockQuery.order.mockResolvedValue({
        data: null,
        error: { message: 'Fetch failed' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      await expect(service.getFoodLogs(userId)).rejects.toThrow(
        'Failed to fetch food logs',
      );
    });

    it('should return empty array when no logs', async () => {
      const mockQuery = createMockQuery();
      mockQuery.order.mockResolvedValue({ data: null, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogs(userId);
      expect(result).toEqual([]);
    });
  });

  describe('getFoodLogById', () => {
    it('should get log by ID', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({ data: baseFoodLog, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogById(userId, foodLogId);
      expect(result).toEqual(baseFoodLog);
    });

    it('should throw when not found', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      await expect(service.getFoodLogById(userId, foodLogId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateFoodLog', () => {
    const updateData = {
      food_name: 'Updated oatmeal',
      moods: ['happy', 'satisfied'] as ['happy', 'satisfied'],
      notes: 'Updated notes',
    };
    const updatedFoodLog = { ...baseFoodLog, ...updateData };

    it('should update successfully', async () => {
      const mockGetQuery = createMockQuery();
      mockGetQuery.single.mockResolvedValue({
        data: updatedFoodLog,
        error: null,
      });
      const mockUpdateQuery = createMockQuery();
      mockUpdateQuery.single.mockResolvedValue({
        data: updatedFoodLog,
        error: null,
      });
      const mockFrom = jest
        .fn()
        .mockReturnValueOnce(mockGetQuery)
        .mockReturnValueOnce(mockUpdateQuery);
      setupMock(mockFrom);
      const result = await service.updateFoodLog(userId, foodLogId, updateData);
      expect(result).toEqual(updatedFoodLog);
    });

    it('should throw when not found', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      await expect(
        service.updateFoodLog(userId, foodLogId, updateData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw on update failure', async () => {
      const mockGetQuery = createMockQuery();
      mockGetQuery.single.mockResolvedValue({
        data: updatedFoodLog,
        error: null,
      });
      const mockUpdateQuery = createMockQuery();
      mockUpdateQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });
      const mockFrom = jest
        .fn()
        .mockReturnValueOnce(mockGetQuery)
        .mockReturnValueOnce(mockUpdateQuery);
      setupMock(mockFrom);
      await expect(
        service.updateFoodLog(userId, foodLogId, updateData),
      ).rejects.toThrow('Failed to update food log');
    });
  });

  describe('deleteFoodLog', () => {
    it('should delete successfully', async () => {
      const mockGetQuery = createMockQuery();
      mockGetQuery.single.mockResolvedValue({
        data: { id: foodLogId },
        error: null,
      });
      const mockDeleteQuery = createAsyncMock(null, null);
      const mockFrom = jest
        .fn()
        .mockReturnValueOnce(mockGetQuery)
        .mockReturnValueOnce(mockDeleteQuery);
      setupMock(mockFrom);
      await service.deleteFoodLog(userId, foodLogId);
      expect(mockDeleteQuery.delete).toHaveBeenCalled();
    });

    it('should throw when not found', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      await expect(service.deleteFoodLog(userId, foodLogId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw on delete failure', async () => {
      const mockGetQuery = createMockQuery();
      mockGetQuery.single.mockResolvedValue({
        data: { id: foodLogId },
        error: null,
      });
      const mockDeleteQuery = createAsyncMock(null, {
        message: 'Delete failed',
      });
      const mockFrom = jest
        .fn()
        .mockReturnValueOnce(mockGetQuery)
        .mockReturnValueOnce(mockDeleteQuery);
      setupMock(mockFrom);
      await expect(service.deleteFoodLog(userId, foodLogId)).rejects.toThrow(
        'Failed to delete food log',
      );
    });
  });

  describe('getFoodLogStats', () => {
    it('should get stats without date range', async () => {
      const mockQuery = createAsyncMock(mockStatsFoodLogs);
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogStats(userId);
      expect(result.totalLogs).toBe(3);
      expect(result.mostCommonMood).toBe('satisfied');
    });

    it('should get stats with date range', async () => {
      const mockQuery = createMockQuery();
      mockQuery.lte.mockResolvedValue({ data: mockStatsFoodLogs, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogStats(
        userId,
        '2024-01-01',
        '2024-01-31',
      );
      expect(result.totalLogs).toBe(3);
      expect(result.period).toEqual({ start: '2024-01-01', end: '2024-01-31' });
    });

    it('should handle empty logs', async () => {
      const mockQuery = createMockQuery();
      mockQuery.lte.mockResolvedValue({ data: [], error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      const result = await service.getFoodLogStats(userId);
      expect(result.totalLogs).toBe(0);
      expect(result.moodCounts).toEqual({});
    });

    it('should throw on stats failure', async () => {
      const mockQuery = createAsyncMock(null, { message: 'Fetch failed' });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      await expect(service.getFoodLogStats(userId)).rejects.toThrow(
        'Failed to fetch food log statistics',
      );
    });
  });
});
