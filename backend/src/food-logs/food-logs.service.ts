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

    if (filters.moods && filters.moods.length > 0) {
      query = query.in('mood', filters.moods);
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
        log.moods.forEach(mood => {
          acc[mood] = (acc[mood] || 0) + 1;
        });
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
      energised: 1,
      happy: 1,
      satisfied: 1,
      focused: 1,
      calm: 1,
      sluggish: 1,
      sleepy: 1,
      anxious: 1,
      sad: 1,
      irritable: 1,
      guilty: 1,
      craving_more: 1,
    };

    const totalScore = logs.reduce((sum, log) => {
      const moodScoreSum = log.moods.reduce((moodSum, mood) => {
        return moodSum + (moodScores[mood] || 5);
      }, 0);
      return sum + moodScoreSum;
    }, 0);

    const totalMoods = logs.reduce((count, log) => count + log.moods.length, 0);

    return totalMoods > 0 ? Math.round((totalScore / totalMoods) * 10) / 10 : 0;
  }
}
