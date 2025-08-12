import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  FoodLog,
  CreateFoodLogRequest,
  UpdateFoodLogRequest,
  FoodLogFilters,
  Database,
} from '../types';
import { SUPABASE_CLIENT } from '../common/services/supabase-client.provider';

@Injectable()
export class FoodLogsService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async createFoodLog(
    userId: string,
    foodLogData: CreateFoodLogRequest,
  ): Promise<FoodLog> {
    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .insert({ user_id: userId, ...foodLogData })
      .select()
      .single();
    if (error || !foodLog)
      throw new BadRequestException('Failed to create food log');
    return foodLog;
  }

  async getFoodLogs(
    userId: string,
    filters: FoodLogFilters = {},
  ): Promise<FoodLog[]> {
    let query = this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('meal_time', { ascending: false });

    if (filters.start_date) query = query.gte('meal_time', filters.start_date);
    if (filters.end_date) query = query.lte('meal_time', filters.end_date);
    if (filters.moods?.length > 0) query = query.in('moods', filters.moods);
    if (filters.food_name)
      query = query.ilike('food_name', `%${filters.food_name}%`);
    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset)
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );

    const { data: foodLogs, error } = await query;
    if (error) throw new BadRequestException('Failed to fetch food logs');
    return foodLogs || [];
  }

  async getFoodLogById(userId: string, foodLogId: string): Promise<FoodLog> {
    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .select('*')
      .eq('id', foodLogId)
      .eq('user_id', userId)
      .single();
    if (error || !foodLog) throw new NotFoundException('Food log not found');
    return foodLog;
  }

  async updateFoodLog(
    userId: string,
    foodLogId: string,
    updateData: UpdateFoodLogRequest,
  ): Promise<FoodLog> {
    await this.getFoodLogById(userId, foodLogId);
    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .update(updateData)
      .eq('id', foodLogId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error || !foodLog)
      throw new BadRequestException('Failed to update food log');
    return foodLog;
  }

  async deleteFoodLog(userId: string, foodLogId: string): Promise<void> {
    await this.getFoodLogById(userId, foodLogId);
    const { error } = await this.supabase
      .from('food_logs')
      .delete()
      .eq('id', foodLogId)
      .eq('user_id', userId);
    if (error) throw new BadRequestException('Failed to delete food log');
  }

  async getFoodLogStats(userId: string, startDate?: string, endDate?: string) {
    let query = this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId);
    if (startDate) query = query.gte('meal_time', startDate);
    if (endDate) query = query.lte('meal_time', endDate);
    const { data: logs, error } = await query;
    if (error)
      throw new BadRequestException('Failed to fetch food log statistics');
    return {
      totalLogs: logs?.length || 0,
      period: { start: startDate, end: endDate },
    };
  }
}
