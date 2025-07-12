import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  FoodLog,
  CreateFoodLogRequest,
  UpdateFoodLogRequest,
  FoodLogFilters,
  Database,
} from '../types';

@Injectable()
export class FoodLogsService {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  /**
   * Create a new food log
   */
  async createFoodLog(
    userId: string,
    foodLogData: CreateFoodLogRequest,
  ): Promise<FoodLog> {
    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .insert({
        user_id: userId,
        ...foodLogData,
      })
      .select()
      .single();

    if (error || !foodLog) {
      throw new Error('Failed to create food log');
    }

    return foodLog;
  }

  /**
   * Get food logs for a user with optional filters
   */
  async getFoodLogs(
    userId: string,
    filters: FoodLogFilters = {},
  ): Promise<FoodLog[]> {
    let query = this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('meal_time', { ascending: false });

    // Apply filters
    if (filters.start_date) {
      query = query.gte('meal_time', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('meal_time', filters.end_date);
    }

    if (filters.mood) {
      query = query.eq('mood', filters.mood);
    }

    if (filters.food_name) {
      query = query.ilike('food_name', `%${filters.food_name}%`);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data: foodLogs, error } = await query;

    if (error) {
      throw new Error('Failed to fetch food logs');
    }

    return foodLogs || [];
  }

  /**
   * Get a specific food log by ID
   */
  async getFoodLogById(userId: string, foodLogId: string): Promise<FoodLog> {
    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .select('*')
      .eq('id', foodLogId)
      .eq('user_id', userId)
      .single();

    if (error || !foodLog) {
      throw new NotFoundException('Food log not found');
    }

    return foodLog;
  }

  /**
   * Update a food log
   */
  async updateFoodLog(
    userId: string,
    foodLogId: string,
    updateData: UpdateFoodLogRequest,
  ): Promise<FoodLog> {
    // First check if the food log exists and belongs to the user
    await this.getFoodLogById(userId, foodLogId);

    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .update(updateData)
      .eq('id', foodLogId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !foodLog) {
      throw new Error('Failed to update food log');
    }

    return foodLog;
  }

  /**
   * Delete a food log
   */
  async deleteFoodLog(userId: string, foodLogId: string): Promise<void> {
    // First check if the food log exists and belongs to the user
    await this.getFoodLogById(userId, foodLogId);

    const { error } = await this.supabase
      .from('food_logs')
      .delete()
      .eq('id', foodLogId)
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to delete food log');
    }
  }

  /**
   * Get food log statistics for a user
   */
  async getFoodLogStats(userId: string, startDate?: string, endDate?: string) {
    let query = this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('meal_time', startDate);
    }

    if (endDate) {
      query = query.lte('meal_time', endDate);
    }

    const { data: foodLogs, error } = await query;

    if (error) {
      throw new Error('Failed to fetch food log statistics');
    }

    const logs = foodLogs || [];

    // Calculate statistics
    const totalLogs = logs.length;
    const moodCounts = logs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b,
    )?.[0];

    const averageMoodScore = this.calculateMoodScore(logs);

    return {
      totalLogs,
      moodCounts,
      mostCommonMood,
      averageMoodScore,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  /**
   * Calculate average mood score (1-10 scale)
   */
  private calculateMoodScore(logs: FoodLog[]): number {
    if (logs.length === 0) return 0;

    const moodScores = {
      energised: 9,
      happy: 8,
      satisfied: 7,
      focused: 6,
      calm: 5,
      sluggish: 4,
      sleepy: 3,
      anxious: 2,
      sad: 1,
      irritable: 1,
    };

    const totalScore = logs.reduce((sum, log) => {
      return sum + (moodScores[log.mood] || 5);
    }, 0);

    return Math.round((totalScore / logs.length) * 10) / 10;
  }
}
