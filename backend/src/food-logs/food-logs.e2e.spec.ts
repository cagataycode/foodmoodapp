import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SUPABASE_CLIENT } from '../common/services/supabase-client.provider';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FoodLogsController } from './food-logs.controller';
import { FoodLogsService } from './food-logs.service';
import {
  CreateFoodLogRequest,
  UpdateFoodLogRequest,
  MealType,
  MoodType,
} from '../types';
import { TestDataGenerators } from '../test/integration.utils';

describe('FoodLogs E2E Integration Tests', () => {
  let app: INestApplication;
  let controller: FoodLogsController;
  let service: FoodLogsService;
  let testUserId: string;
  let testFoodLogId: string;
  let supabase: SupabaseClient;
  let createdTestUser: { id: string } | null = null;

  beforeAll(async () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY environment variable is required for E2E tests',
      );
    }
    const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
    if (
      !supabaseUrl.includes('localhost') &&
      !process.env.ALLOW_E2E_ON_REMOTE
    ) {
      throw new Error(
        'Refusing to run E2E tests against a non-local Supabase. Set ALLOW_E2E_ON_REMOTE=true to override.',
      );
    }
    supabase = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FoodLogsController],
      providers: [FoodLogsService],
    })
      .useMocker(token => {
        if (token === SUPABASE_CLIENT) return supabase as any;
        if (token === ConfigService)
          return {
            get: (key: string) => {
              if (key === 'SUPABASE_URL') return supabaseUrl;
              if (key === 'SUPABASE_SERVICE_ROLE_KEY')
                return process.env.SUPABASE_SERVICE_ROLE_KEY;
              return null;
            },
          } as any;
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    controller = moduleFixture.get<FoodLogsController>(FoodLogsController);
    service = moduleFixture.get<FoodLogsService>(FoodLogsService);

    // Create an ephemeral test user so we don't touch real accounts
    const uniqueEmail = `e2e-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`;
    const { data, error } = await supabase.auth.admin.createUser({
      email: uniqueEmail,
      password: 'Test1234!',
      email_confirm: true,
    });
    if (error || !data?.user) {
      throw new Error(`Failed to create E2E test user: ${error?.message}`);
    }
    createdTestUser = { id: data.user.id };
    testUserId = data.user.id;
  });

  // Create a mock request object for testing
  const createMockRequest = (userId: string) => ({
    user: { id: userId },
  });

  afterAll(async () => {
    await cleanupAllTestData();
    if (createdTestUser) {
      try {
        await supabase.auth.admin.deleteUser(createdTestUser.id);
      } catch (_) {
        // ignore
      }
    }
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    await setupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  const setupTestData = async () => {
    const testFoodLog: CreateFoodLogRequest = {
      food_name: 'Test Pizza',
      meal_type: 'lunch',
      moods: ['happy', 'energised'],
      meal_time: new Date().toISOString(),
    };
    const createdFoodLog = await service.createFoodLog(testUserId, testFoodLog);
    testFoodLogId = createdFoodLog.id;
  };

  const cleanupTestData = async () => {
    try {
      if (testFoodLogId) {
        await service.deleteFoodLog(testUserId, testFoodLogId);
      }
    } catch (error) {
      // Ignore errors if food log doesn't exist
    }
  };

  const cleanupAllTestData = async () => {
    try {
      const allLogs = await service.getFoodLogs(testUserId);
      await Promise.all(
        allLogs.map(log => service.deleteFoodLog(testUserId, log.id)),
      );
    } catch (error) {
      // Ignore errors during cleanup
    }
  };

  describe('Controller-Service Integration', () => {
    it('should create food log through controller', async () => {
      const foodLogData: CreateFoodLogRequest = {
        food_name: 'Controller Test Burger',
        meal_type: 'dinner',
        moods: ['satisfied', 'energised'],
        meal_time: new Date().toISOString(),
      };
      const response = await controller.createFoodLog(
        createMockRequest(testUserId),
        foodLogData,
      );
      expect(response.success).toBe(true);
      expect(response.data.food_name).toBe(foodLogData.food_name);
      expect(response.data.moods).toEqual(foodLogData.moods);
      expect(response.data.user_id).toBe(testUserId);
      const retrievedFoodLog = await service.getFoodLogById(
        testUserId,
        response.data.id,
      );
      expect(retrievedFoodLog).toEqual(response.data);
    });

    it('should get food logs through controller', async () => {
      const response = await controller.getFoodLogs(
        createMockRequest(testUserId),
        {},
      );
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      const testLog = response.data.find(log => log.id === testFoodLogId);
      expect(testLog).toBeDefined();
      expect(testLog.food_name).toBe('Test Pizza');
    });

    it('should get food log by ID through controller', async () => {
      const response = await controller.getFoodLogById(
        createMockRequest(testUserId),
        testFoodLogId,
      );
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(testFoodLogId);
      expect(response.data.user_id).toBe(testUserId);
      expect(response.data.food_name).toBe('Test Pizza');
    });

    it('should update food log through controller', async () => {
      const updateData: UpdateFoodLogRequest = {
        food_name: 'Controller Updated Pizza',
        moods: ['happy', 'satisfied', 'energised'],
      };
      const response = await controller.updateFoodLog(
        createMockRequest(testUserId),
        testFoodLogId,
        updateData,
      );
      expect(response.success).toBe(true);
      expect(response.data.food_name).toBe(updateData.food_name);
      expect(response.data.moods).toEqual(updateData.moods);
      const retrievedFoodLog = await service.getFoodLogById(
        testUserId,
        testFoodLogId,
      );
      expect(retrievedFoodLog.food_name).toBe(updateData.food_name);
      expect(retrievedFoodLog.moods).toEqual(updateData.moods);
    });

    it('should delete food log through controller', async () => {
      const response = await controller.getFoodLogById(
        createMockRequest(testUserId),
        testFoodLogId,
      );
      expect(response.success).toBe(true);
      await controller.deleteFoodLog(
        createMockRequest(testUserId),
        testFoodLogId,
      );
      await expect(
        controller.getFoodLogById(createMockRequest(testUserId), testFoodLogId),
      ).rejects.toThrow();
    });
  });

  describe('Filtering and Pagination Integration', () => {
    beforeEach(async () => {
      const testFoodLogs = TestDataGenerators.foodLogsForDateRange(
        new Date('2024-01-01T08:00:00Z'),
        new Date('2024-01-01T18:00:00Z'),
        3,
      ).map((log, index) => ({
        ...log,
        food_name: index === 1 ? 'Lunch Salad' : log.food_name,
      }));
      await Promise.all(
        testFoodLogs.map(foodLog =>
          controller.createFoodLog(createMockRequest(testUserId), foodLog),
        ),
      );
    });

    it('should filter food logs by date range through controller', async () => {
      const response = await controller.getFoodLogs(
        createMockRequest(testUserId),
        {
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-01-01T23:59:59Z',
        },
      );
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThanOrEqual(3);
      response.data.forEach(log => {
        const mealTime = new Date(log.meal_time);
        expect(
          mealTime >= new Date('2024-01-01T00:00:00Z') &&
            mealTime <= new Date('2024-01-01T23:59:59Z'),
        ).toBe(true);
      });
    });

    it('should filter food logs by food name through controller', async () => {
      const response = await controller.getFoodLogs(
        createMockRequest(testUserId),
        { food_name: 'salad' },
      );
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(
        response.data.every(log =>
          log.food_name.toLowerCase().includes('salad'),
        ),
      ).toBe(true);
    });

    it('should apply pagination through controller', async () => {
      const allLogsResponse = await controller.getFoodLogs(
        createMockRequest(testUserId),
        {},
      );
      expect(allLogsResponse.data.length).toBeGreaterThanOrEqual(3);
      const paginatedResponse = await controller.getFoodLogs(
        createMockRequest(testUserId),
        { limit: 2, offset: 0 },
      );
      expect(paginatedResponse.success).toBe(true);
      expect(paginatedResponse.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Data Consistency Between Controller and Service', () => {
    it('should maintain data consistency across controller and service operations', async () => {
      const foodLogData: CreateFoodLogRequest = {
        food_name: 'Consistency Test Food',
        meal_type: 'snack',
        moods: ['energised'],
        meal_time: new Date().toISOString(),
      };
      const response = await controller.createFoodLog(
        createMockRequest(testUserId),
        foodLogData,
      );
      const retrievedThroughService = await service.getFoodLogById(
        testUserId,
        response.data.id,
      );
      expect(retrievedThroughService).toEqual(response.data);

      const updateData: UpdateFoodLogRequest = {
        food_name: 'Updated Consistency Test Food',
        moods: ['happy', 'energised'],
      };
      const updatedResponse = await controller.updateFoodLog(
        createMockRequest(testUserId),
        response.data.id,
        updateData,
      );
      const retrievedAfterUpdate = await service.getFoodLogById(
        testUserId,
        response.data.id,
      );
      expect(retrievedAfterUpdate).toEqual(updatedResponse.data);
      expect(retrievedAfterUpdate.food_name).toBe(updateData.food_name);
      expect(retrievedAfterUpdate.moods).toEqual(updateData.moods);

      await service.deleteFoodLog(testUserId, response.data.id);

      // Verify the food log was actually deleted
      try {
        await service.getFoodLogById(testUserId, response.data.id);
        throw new Error('Food log should have been deleted');
      } catch (error) {
        expect(error.message).toContain('Food log not found');
      }
    });
  });
});
