import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SUPABASE_CLIENT } from '../common/services/supabase-client.provider';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FoodLogsService } from './food-logs.service';
import { CreateFoodLogRequest, UpdateFoodLogRequest } from '../types';
import { TestDataGenerators } from '../test/integration.utils';

describe('FoodLogsService Integration Tests', () => {
  let service: FoodLogsService;
  let testUserId: string;
  let testFoodLogId: string;
  let supabase: SupabaseClient;
  let createdTestUser: { id: string } | null = null;

  beforeAll(async () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY environment variable is required for integration tests',
      );
    }
    // Initialize admin client and guard against accidental remote runs
    const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
    if (
      !supabaseUrl.includes('localhost') &&
      !process.env.ALLOW_E2E_ON_REMOTE
    ) {
      throw new Error(
        'Refusing to run integration tests against a non-local Supabase. Set ALLOW_E2E_ON_REMOTE=true to override.',
      );
    }
    supabase = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    );

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<FoodLogsService>(FoodLogsService);

    // Create an ephemeral test user to satisfy FK constraints
    const uniqueEmail = `itest-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`;
    const { data, error } = await supabase.auth.admin.createUser({
      email: uniqueEmail,
      password: 'Test1234!',
      email_confirm: true,
    });
    if (error || !data?.user) {
      throw new Error(`Failed to create test user: ${error?.message}`);
    }
    createdTestUser = { id: data.user.id };
    testUserId = data.user.id;
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
  });
  beforeEach(async () => await setupTestData());
  afterEach(async () => await cleanupTestData());

  const setupTestData = async () => {
    try {
      const testFoodLog: CreateFoodLogRequest = {
        food_name: 'Test Pizza',
        meal_type: 'lunch',
        moods: ['happy', 'energised'],
        meal_time: new Date().toISOString(),
      };
      const createdFoodLog = await service.createFoodLog(
        testUserId,
        testFoodLog,
      );
      testFoodLogId = createdFoodLog.id;
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  };

  const cleanupTestData = async () => {
    try {
      if (testFoodLogId) await service.deleteFoodLog(testUserId, testFoodLogId);
    } catch (error) {
      // Ignore errors if food log doesn't exist
    }
  };

  const cleanupAllTestData = async () => {
    try {
      const allLogs = await service.getFoodLogs(testUserId);
      for (const log of allLogs)
        await service.deleteFoodLog(testUserId, log.id);
    } catch (error) {
      // Ignore errors during cleanup
    }
  };

  describe('Service Initialization', () => {
    it('should initialize with test database configuration', async () => {
      expect(service).toBeDefined();
    });
  });

  describe('CRUD Operations with Real Database', () => {
    it('should create food log and persist to database', async () => {
      const foodLogData: CreateFoodLogRequest = {
        food_name: 'Integration Test Burger',
        meal_type: 'dinner',
        moods: ['satisfied', 'calm'],
        meal_time: new Date().toISOString(),
      };
      const createdFoodLog = await service.createFoodLog(
        testUserId,
        foodLogData,
      );
      expect(createdFoodLog).toBeDefined();
      expect(createdFoodLog.food_name).toBe(foodLogData.food_name);
      expect(createdFoodLog.meal_type).toBe(foodLogData.meal_type);
      expect(createdFoodLog.moods).toEqual(foodLogData.moods);
      expect(createdFoodLog.user_id).toBe(testUserId);
      expect(createdFoodLog.id).toBeDefined();
      expect(createdFoodLog.created_at).toBeDefined();
      expect(createdFoodLog.updated_at).toBeDefined();
    });

    it('should retrieve created food log from database', async () => {
      const retrievedFoodLog = await service.getFoodLogById(
        testUserId,
        testFoodLogId,
      );
      expect(retrievedFoodLog).toBeDefined();
      expect(retrievedFoodLog.id).toBe(testFoodLogId);
      expect(retrievedFoodLog.food_name).toBe('Test Pizza');
      expect(retrievedFoodLog.user_id).toBe(testUserId);
    });

    it('should update food log and persist changes to database', async () => {
      const updateData: UpdateFoodLogRequest = {
        food_name: 'Updated Test Pizza',
        moods: ['happy', 'satisfied', 'anxious'],
      };
      const updatedFoodLog = await service.updateFoodLog(
        testUserId,
        testFoodLogId,
        updateData,
      );
      expect(updatedFoodLog).toBeDefined();
      expect(updatedFoodLog.food_name).toBe(updateData.food_name);
      expect(updatedFoodLog.moods).toEqual(updateData.moods);
      const retrievedFoodLog = await service.getFoodLogById(
        testUserId,
        testFoodLogId,
      );
      expect(retrievedFoodLog.food_name).toBe(updateData.food_name);
      expect(retrievedFoodLog.moods).toEqual(updateData.moods);
    });

    it('should delete food log from database', async () => {
      await service.deleteFoodLog(testUserId, testFoodLogId);
      await expect(
        service.getFoodLogById(testUserId, testFoodLogId),
      ).rejects.toThrow();
    });
  });

  describe('Query Operations with Real Database', () => {
    it('should retrieve all food logs for user', async () => {
      const allLogs = await service.getFoodLogs(testUserId);
      expect(Array.isArray(allLogs)).toBe(true);
      expect(allLogs.length).toBeGreaterThan(0);
      expect(allLogs.every(log => log.user_id === testUserId)).toBe(true);
    });

    it('should handle multiple food logs correctly', async () => {
      const testFoodLogs = TestDataGenerators.foodLogsForDateRange(
        new Date('2024-01-01T08:00:00Z'),
        new Date('2024-01-01T12:00:00Z'),
        2,
      );
      await Promise.all(
        testFoodLogs.map(foodLog =>
          service.createFoodLog(testUserId, foodLog as CreateFoodLogRequest),
        ),
      );
      const allLogs = await service.getFoodLogs(testUserId);
      expect(allLogs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Data Validation and Constraints', () => {
    it('should enforce required fields', async () => {
      const invalidFoodLog = {} as CreateFoodLogRequest;
      await expect(
        service.createFoodLog(testUserId, invalidFoodLog),
      ).rejects.toThrow();
    });

    it('should validate meal type constraints', async () => {
      const invalidFoodLog: CreateFoodLogRequest = {
        food_name: 'Test Food',
        meal_type: 'invalid-meal' as any,
        moods: ['happy'],
        meal_time: new Date().toISOString(),
      };
      await expect(
        service.createFoodLog(testUserId, invalidFoodLog),
      ).rejects.toThrow();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple concurrent operations', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        service.createFoodLog(testUserId, {
          food_name: `Concurrent Test ${i}`,
          meal_type: 'snack',
          moods: ['energised'],
          meal_time: new Date().toISOString(),
        }),
      );
      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      expect(results.every(log => log.user_id === testUserId)).toBe(true);
    });
  });
});
