import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FoodLog, CreateFoodLogRequest, MoodType } from '../types';

export const TEST_CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export class TestDataManager {
  private supabase: SupabaseClient;
  private testUserId: string;
  private createdFoodLogs: string[] = [];

  constructor(testUserId: string) {
    this.testUserId = testUserId;
    if (!TEST_CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY environment variable is required',
      );
    }
    if (
      !TEST_CONFIG.SUPABASE_URL.includes('localhost') &&
      !process.env.ALLOW_E2E_ON_REMOTE
    ) {
      throw new Error(
        'Refusing to run tests against a non-local Supabase. Set ALLOW_E2E_ON_REMOTE=true to override.',
      );
    }
    this.supabase = createClient(
      TEST_CONFIG.SUPABASE_URL,
      TEST_CONFIG.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  async createTestFoodLog(
    foodLogData?: Partial<CreateFoodLogRequest>,
  ): Promise<FoodLog> {
    const defaultData: CreateFoodLogRequest = {
      food_name: 'Test Food',
      meal_type: 'lunch',
      moods: ['satisfied'],
      meal_time: new Date().toISOString(),
      ...foodLogData,
    };

    const { data, error } = await this.supabase
      .from('food_logs')
      .insert({ user_id: this.testUserId, ...defaultData })
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create test food log: ${error.message}`);
    this.createdFoodLogs.push(data.id);
    return data;
  }

  async createMultipleTestFoodLogs(
    count: number,
    baseData?: Partial<CreateFoodLogRequest>,
  ): Promise<FoodLog[]> {
    const foodLogs: FoodLog[] = [];
    for (let i = 0; i < count; i++) {
      const foodLog = await this.createTestFoodLog({
        food_name: `Test Food ${i + 1}`,
        meal_time: new Date(Date.now() - i * 60000).toISOString(),
        ...baseData,
      });
      foodLogs.push(foodLog);
    }
    return foodLogs;
  }

  async cleanupFoodLog(foodLogId: string): Promise<void> {
    try {
      await this.supabase
        .from('food_logs')
        .delete()
        .eq('id', foodLogId)
        .eq('user_id', this.testUserId);
      const index = this.createdFoodLogs.indexOf(foodLogId);
      if (index > -1) this.createdFoodLogs.splice(index, 1);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  async cleanupAll(): Promise<void> {
    try {
      await this.supabase
        .from('food_logs')
        .delete()
        .eq('user_id', this.testUserId);
      this.createdFoodLogs = [];
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  async getAllFoodLogs(): Promise<FoodLog[]> {
    const { data, error } = await this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', this.testUserId)
      .order('created_at', { ascending: false });

    if (error)
      throw new Error(`Failed to get test food logs: ${error.message}`);
    return data || [];
  }

  async verifyFoodLogExists(foodLogId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('food_logs')
      .select('id')
      .eq('id', foodLogId)
      .eq('user_id', this.testUserId)
      .single();
    return !error && !!data;
  }

  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('food_logs')
        .select('count')
        .limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const TestDataGenerators = {
  randomFoodLog(
    overrides?: Partial<CreateFoodLogRequest>,
  ): CreateFoodLogRequest {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const moodOptions: MoodType[] = [
      'happy',
      'sad',
      'energised',
      'sleepy',
      'satisfied',
      'anxious',
      'calm',
      'focused',
    ];

    return {
      food_name: `Test Food ${Math.random().toString(36).substring(7)}`,
      meal_type: mealTypes[Math.floor(Math.random() * mealTypes.length)] as any,
      moods: moodOptions.slice(0, Math.floor(Math.random() * 3) + 1),
      meal_time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      ...overrides,
    };
  },

  foodLogForDate(
    date: Date,
    overrides?: Partial<CreateFoodLogRequest>,
  ): CreateFoodLogRequest {
    return {
      food_name: 'Test Food',
      meal_type: 'lunch',
      moods: ['happy'],
      meal_time: date.toISOString(),
      ...overrides,
    };
  },

  foodLogsForDateRange(
    startDate: Date,
    endDate: Date,
    count: number,
  ): CreateFoodLogRequest[] {
    const foodLogs: CreateFoodLogRequest[] = [];
    const timeStep = (endDate.getTime() - startDate.getTime()) / (count - 1);

    for (let i = 0; i < count; i++) {
      const mealTime = new Date(startDate.getTime() + i * timeStep);
      foodLogs.push(
        this.foodLogForDate(mealTime, {
          food_name: `Meal ${i + 1}`,
          meal_type:
            i < count / 3
              ? 'breakfast'
              : i < (count * 2) / 3
                ? 'lunch'
                : 'dinner',
        }),
      );
    }
    return foodLogs;
  },
};

export const TestAssertions = {
  assertFoodLogStructure(foodLog: any): void {
    expect(foodLog).toBeDefined();
    expect(foodLog.id).toBeDefined();
    expect(foodLog.user_id).toBeDefined();
    expect(foodLog.food_name).toBeDefined();
    expect(foodLog.meal_type).toBeDefined();
    expect(foodLog.moods).toBeDefined();
    expect(foodLog.meal_time).toBeDefined();
    expect(foodLog.created_at).toBeDefined();
    expect(foodLog.updated_at).toBeDefined();
    expect(Array.isArray(foodLog.moods)).toBe(true);
  },

  assertFoodLogMatchesRequest(
    foodLog: FoodLog,
    request: CreateFoodLogRequest,
    userId: string,
  ): void {
    expect(foodLog.food_name).toBe(request.food_name);
    expect(foodLog.meal_type).toBe(request.meal_type);
    expect(foodLog.moods).toEqual(request.moods);
    expect(foodLog.meal_time).toBe(request.meal_time);
    expect(foodLog.user_id).toBe(userId);
  },

  assertDateRangeFiltering(
    logs: FoodLog[],
    startDate: string,
    endDate: string,
  ): void {
    logs.forEach(log => {
      const mealTime = new Date(log.meal_time);
      const start = new Date(startDate);
      const end = new Date(endDate);
      expect(mealTime >= start && mealTime <= end).toBe(true);
    });
  },
};

export const TestSetupHelpers = {
  generateTestUserId(): string {
    return `test-user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  },

  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 100,
  ): Promise<T> {
    let lastError: Error;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await this.wait(delay);
        }
      }
    }
    throw lastError!;
  },
};
