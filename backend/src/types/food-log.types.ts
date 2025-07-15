// Food log-related types for the FoodMood app

export type MoodType =
  | 'energised'
  | 'sleepy'
  | 'calm'
  | 'focused'
  | 'anxious'
  | 'happy'
  | 'sad'
  | 'irritable'
  | 'satisfied'
  | 'sluggish'
  | 'guilty'
  | 'craving_more';

export interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  food_id?: string; // Open Food Facts ID for future integration
  moods: MoodType[];
  meal_time: string;
  portion_size?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFoodLogRequest {
  food_name: string;
  food_id?: string;
  moods: MoodType[];
  meal_time: string;
  portion_size?: string;
  notes?: string;
}

export interface UpdateFoodLogRequest {
  food_name?: string;
  food_id?: string;
  moods?: MoodType[];
  meal_time?: string;
  portion_size?: string;
  notes?: string;
}

export interface FoodLogFilters {
  page?: number;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
  moods?: MoodType[];
  food_name?: string;
}
