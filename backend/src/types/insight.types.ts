// Insight-related types for the FoodMood app

export interface Insight {
  id: string;
  user_id: string;
  insight_type: 'weekly' | 'monthly' | 'pattern' | 'trend';
  title: string;
  description: string;
  data: Record<string, any>;
  period_start: string;
  period_end: string;
  is_read: boolean;
  created_at: string;
}

export interface InsightFilters {
  page?: number;
  limit?: number;
  offset?: number;
  insight_type?: 'weekly' | 'monthly' | 'pattern' | 'trend';
  is_read?: boolean;
  start_date?: string;
  end_date?: string;
}
