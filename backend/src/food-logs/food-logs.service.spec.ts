import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FoodLogsService } from './food-logs.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FoodLog, CreateFoodLogRequest, UpdateFoodLogRequest } from '../types';

jest.mock('@supabase/supabase-js');

describe('FoodLogsService', () => {
  let service: FoodLogsService;
  let mockSupabase: jest.Mocked<SupabaseClient<any>>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'SUPABASE_URL') return 'https://test.supabase.co';
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'test-key';
        return null;
      }),
    } as any;

    const mockSupabaseClient = { from: jest.fn() };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    mockSupabase = mockSupabaseClient as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodLogsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<FoodLogsService>(FoodLogsService);
  });

  describe('Constructor', () => {
    it('should throw error when Supabase config is missing', () => {
      mockConfigService.get.mockReturnValue(null);
      expect(() => new FoodLogsService(mockConfigService)).toThrow(
        'Missing Supabase configuration',
      );
    });
  });

  describe('CRUD Operations', () => {
    const mockFoodLog: FoodLog = {
      id: '1',
      user_id: 'user-1',
      food_name: 'Pizza',
      meal_type: 'lunch',
      moods: ['happy', 'energised'],
      meal_time: '2025-08-07T12:00:00Z',
      created_at: '2025-08-07T12:00:00Z',
      updated_at: '2025-08-07T12:00:00Z',
    };

    const createRequest: CreateFoodLogRequest = {
      food_name: 'Pizza',
      meal_type: 'lunch',
      moods: ['happy', 'energised'],
      meal_time: '2025-08-07T12:00:00Z',
    };

    it('should create food log successfully', async () => {
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockFoodLog, error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const result = await service.createFoodLog('user-1', createRequest);

      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: 'user-1',
        ...createRequest,
      });
      expect(result).toEqual(mockFoodLog);
    });

    it('should throw BadRequestException when creation fails', async () => {
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      await expect(
        service.createFoodLog('user-1', createRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should get food logs with filters', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        ilike: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest
          .fn()
          .mockResolvedValue({ data: [mockFoodLog], error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      await service.getFoodLogs('user-1', {
        start_date: '2025-08-07T00:00:00Z',
        end_date: '2025-08-07T23:59:59Z',
        moods: ['happy'],
        food_name: 'pizza',
        limit: 10,
        offset: 10,
      });

      expect(mockQuery.gte).toHaveBeenCalledWith(
        'meal_time',
        '2025-08-07T00:00:00Z',
      );
      expect(mockQuery.lte).toHaveBeenCalledWith(
        'meal_time',
        '2025-08-07T23:59:59Z',
      );
      expect(mockQuery.in).toHaveBeenCalledWith('moods', ['happy']);
      expect(mockQuery.ilike).toHaveBeenCalledWith('food_name', '%pizza%');
      expect(mockQuery.range).toHaveBeenCalledWith(10, 19);
    });

    it('should get food log by id', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockFoodLog, error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const result = await service.getFoodLogById('user-1', '1');

      expect(result).toEqual(mockFoodLog);
    });

    it('should throw NotFoundException when food log not found', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      await expect(service.getFoodLogById('user-1', '999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update food log successfully', async () => {
      const mockGetQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockFoodLog, error: null }),
      };
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockFoodLog, error: null }),
      };
      mockSupabase.from
        .mockReturnValueOnce(mockGetQuery as any)
        .mockReturnValueOnce(mockUpdateQuery as any);

      const updateRequest: UpdateFoodLogRequest = {
        food_name: 'Updated Pizza',
        moods: ['happy', 'satisfied'],
      };

      const result = await service.updateFoodLog('user-1', '1', updateRequest);

      expect(mockUpdateQuery.update).toHaveBeenCalledWith(updateRequest);
      expect(result).toEqual(mockFoodLog);
    });

    it('should delete food log successfully', async () => {
      const mockGetQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockFoodLog, error: null }),
      };
      const mockDeleteQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };
      mockDeleteQuery.eq
        .mockReturnValueOnce(mockDeleteQuery)
        .mockResolvedValueOnce({ error: null });
      mockSupabase.from
        .mockReturnValueOnce(mockGetQuery as any)
        .mockReturnValueOnce(mockDeleteQuery as any);

      await service.deleteFoodLog('user-1', '1');

      expect(mockDeleteQuery.delete).toHaveBeenCalled();
      expect(mockDeleteQuery.eq).toHaveBeenCalledWith('id', '1');
      expect(mockDeleteQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    });
  });

  describe('Statistics', () => {
    it('should get food log stats', async () => {
      const mockLogs = [
        { id: '1', user_id: 'user-1', food_name: 'Pizza', meal_type: 'lunch' },
        {
          id: '2',
          user_id: 'user-1',
          food_name: 'Burger',
          meal_type: 'dinner',
        },
      ];
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockResolvedValue({ data: mockLogs, error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const result = await service.getFoodLogStats(
        'user-1',
        '2025-08-07T00:00:00Z',
        '2025-08-07T23:59:59Z',
      );

      expect(result).toEqual({
        totalLogs: 2,
        period: {
          start: '2025-08-07T00:00:00Z',
          end: '2025-08-07T23:59:59Z',
        },
      });
    });
  });
});
