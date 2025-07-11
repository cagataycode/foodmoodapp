// Database types for the FoodMood app

import { User } from './user.types';
import { FoodLog } from './food-log.types';
import { Insight } from './insight.types';

// Database types (will be generated from Supabase)
export interface Database {
  public: {
    Tables: {
      food_logs: {
        Row: FoodLog;
        Insert: Omit<FoodLog, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FoodLog, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_profiles: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      insights: {
        Row: Insight;
        Insert: Omit<Insight, 'id' | 'created_at'>;
        Update: Partial<Omit<Insight, 'id' | 'created_at'>>;
      };
    };
  };
}
