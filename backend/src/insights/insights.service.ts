import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Insight, InsightFilters, Database, MoodType } from '../types';

@Injectable()
export class InsightsService {
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
   * Get insights for a user with optional filters
   */
  async getInsights(
    userId: string,
    filters: InsightFilters = {},
  ): Promise<Insight[]> {
    let query = this.supabase
      .from('insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.insight_type) {
      query = query.eq('insight_type', filters.insight_type);
    }

    if (filters.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read);
    }

    if (filters.start_date) {
      query = query.gte('created_at', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('created_at', filters.end_date);
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

    const { data: insights, error } = await query;

    if (error) {
      throw new Error('Failed to fetch insights');
    }

    return insights || [];
  }

  /**
   * Get a specific insight by ID
   */
  async getInsightById(userId: string, insightId: string): Promise<Insight> {
    const { data: insight, error } = await this.supabase
      .from('insights')
      .select('*')
      .eq('id', insightId)
      .eq('user_id', userId)
      .single();

    if (error || !insight) {
      throw new NotFoundException('Insight not found');
    }

    return insight;
  }

  /**
   * Mark an insight as read
   */
  async markInsightAsRead(userId: string, insightId: string): Promise<Insight> {
    // First check if the insight exists and belongs to the user
    await this.getInsightById(userId, insightId);

    const { data: insight, error } = await this.supabase
      .from('insights')
      .update({ is_read: true })
      .eq('id', insightId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !insight) {
      throw new Error('Failed to mark insight as read');
    }

    return insight;
  }

  /**
   * Generate weekly insights for a user
   */
  async generateWeeklyInsights(userId: string): Promise<Insight> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Get food logs for the week
    const { data: foodLogs, error } = await this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_time', startDate.toISOString())
      .lte('meal_time', endDate.toISOString());

    if (error) {
      throw new Error('Failed to fetch food logs for insight generation');
    }

    const logs = foodLogs || [];
    const insight = this.generateWeeklyInsightData(logs, startDate, endDate);

    // Save the insight
    const { data: savedInsight, error: saveError } = await this.supabase
      .from('insights')
      .insert({
        user_id: userId,
        insight_type: 'weekly',
        title: insight.title,
        description: insight.description,
        data: insight.data,
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        is_read: false,
      })
      .select()
      .single();

    if (saveError || !savedInsight) {
      throw new Error('Failed to save weekly insight');
    }

    return savedInsight;
  }

  /**
   * Generate monthly insights for a user
   */
  async generateMonthlyInsights(userId: string): Promise<Insight> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    // Get food logs for the month
    const { data: foodLogs, error } = await this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_time', startDate.toISOString())
      .lte('meal_time', endDate.toISOString());

    if (error) {
      throw new Error('Failed to fetch food logs for insight generation');
    }

    const logs = foodLogs || [];
    const insight = this.generateMonthlyInsightData(logs, startDate, endDate);

    // Save the insight
    const { data: savedInsight, error: saveError } = await this.supabase
      .from('insights')
      .insert({
        user_id: userId,
        insight_type: 'monthly',
        title: insight.title,
        description: insight.description,
        data: insight.data,
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        is_read: false,
      })
      .select()
      .single();

    if (saveError || !savedInsight) {
      throw new Error('Failed to save monthly insight');
    }

    return savedInsight;
  }

  /**
   * Generate pattern insights for a user
   */
  async generatePatternInsights(userId: string): Promise<Insight> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    // Get food logs for pattern analysis
    const { data: foodLogs, error } = await this.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_time', startDate.toISOString())
      .lte('meal_time', endDate.toISOString());

    if (error) {
      throw new Error('Failed to fetch food logs for pattern analysis');
    }

    const logs = foodLogs || [];
    const insight = this.generatePatternInsightData(logs, startDate, endDate);

    // Save the insight
    const { data: savedInsight, error: saveError } = await this.supabase
      .from('insights')
      .insert({
        user_id: userId,
        insight_type: 'pattern',
        title: insight.title,
        description: insight.description,
        data: insight.data,
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        is_read: false,
      })
      .select()
      .single();

    if (saveError || !savedInsight) {
      throw new Error('Failed to save pattern insight');
    }

    return savedInsight;
  }

  /**
   * Delete an insight
   */
  async deleteInsight(userId: string, insightId: string): Promise<void> {
    // First check if the insight exists and belongs to the user
    await this.getInsightById(userId, insightId);

    const { error } = await this.supabase
      .from('insights')
      .delete()
      .eq('id', insightId)
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to delete insight');
    }
  }

  /**
   * Generate weekly insight data
   */
  private generateWeeklyInsightData(
    logs: any[],
    startDate: Date,
    endDate: Date,
  ) {
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
    const uniqueFoods = [...new Set(logs.map(log => log.food_name))].length;

    let title = 'Weekly Summary';
    let description = `You logged ${totalLogs} meals this week with an average mood score of ${averageMoodScore}/10.`;

    if (mostCommonMood) {
      description += ` Your most common mood was ${mostCommonMood}.`;
    }

    if (uniqueFoods > 0) {
      description += ` You tried ${uniqueFoods} different foods.`;
    }

    return {
      title,
      description,
      data: {
        totalLogs,
        moodCounts,
        mostCommonMood,
        averageMoodScore,
        uniqueFoods,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    };
  }

  /**
   * Generate monthly insight data
   */
  private generateMonthlyInsightData(
    logs: any[],
    startDate: Date,
    endDate: Date,
  ) {
    const totalLogs = logs.length;
    const moodCounts = logs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const averageMoodScore = this.calculateMoodScore(logs);
    const uniqueFoods = [...new Set(logs.map(log => log.food_name))].length;

    // Calculate consistency (how many days had at least one log)
    const daysWithLogs = new Set(
      logs.map(log => new Date(log.meal_time).toDateString()),
    ).size;
    const consistencyPercentage = Math.round((daysWithLogs / 30) * 100);

    let title = 'Monthly Overview';
    let description = `This month you logged ${totalLogs} meals with an average mood score of ${averageMoodScore}/10.`;

    if (consistencyPercentage > 70) {
      description += ` Great consistency! You tracked on ${consistencyPercentage}% of days.`;
    } else if (consistencyPercentage > 50) {
      description += ` Good effort! You tracked on ${consistencyPercentage}% of days.`;
    } else {
      description += ` You tracked on ${consistencyPercentage}% of days. Consider logging more regularly for better insights.`;
    }

    return {
      title,
      description,
      data: {
        totalLogs,
        moodCounts,
        averageMoodScore,
        uniqueFoods,
        consistencyPercentage,
        daysWithLogs,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    };
  }

  /**
   * Generate pattern insight data
   */
  private generatePatternInsightData(
    logs: any[],
    startDate: Date,
    endDate: Date,
  ) {
    const moodCounts = logs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Find food-mood patterns
    const foodMoodPatterns = logs.reduce(
      (acc, log) => {
        if (!acc[log.food_name]) {
          acc[log.food_name] = {};
        }
        acc[log.food_name][log.mood] = (acc[log.food_name][log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    // Find foods that consistently boost mood
    const moodBoosters = Object.entries(foodMoodPatterns)
      .filter(([food, moods]) => {
        const positiveMoods =
          ((moods as Record<MoodType, number>).energised || 0) +
          ((moods as Record<MoodType, number>).happy || 0) +
          ((moods as Record<MoodType, number>).satisfied || 0);
        const totalLogs = Object.values(moods).reduce(
          (sum, count) => sum + count,
          0,
        );
        return positiveMoods / totalLogs > 0.6; // 60% positive mood rate
      })
      .slice(0, 3); // Top 3

    let title = 'Food-Mood Patterns';
    let description =
      'Here are some interesting patterns from your food and mood tracking:';

    if (moodBoosters.length > 0) {
      description += ` ${moodBoosters.map(([food]) => food).join(', ')} consistently boost your mood.`;
    }

    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b,
    )?.[0];

    if (mostCommonMood) {
      description += ` Your most common mood is ${mostCommonMood}.`;
    }

    return {
      title,
      description,
      data: {
        foodMoodPatterns,
        moodBoosters: moodBoosters.map(([food, moods]) => ({
          food,
          moods,
          positiveRate:
            Object.values(moods).reduce((sum, count) => sum + count, 0) > 0
              ? (((moods as Record<MoodType, number>).energised || 0) +
                  ((moods as Record<MoodType, number>).happy || 0) +
                  ((moods as Record<MoodType, number>).satisfied || 0)) /
                Object.values(moods).reduce((sum, count) => sum + count, 0)
              : 0,
        })),
        mostCommonMood,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    };
  }

  /**
   * Calculate average mood score (1-10 scale)
   */
  private calculateMoodScore(logs: any[]): number {
    if (logs.length === 0) return 0;

    const moodScores: Record<MoodType, number> = {
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
      return sum + (moodScores[log.mood as MoodType] || 5);
    }, 0);

    return Math.round((totalScore / logs.length) * 10) / 10;
  }
}
