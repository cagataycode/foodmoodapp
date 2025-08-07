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

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  meal_type: MealType;
  moods: MoodType[]; // Moods associated with this meal (AI will determine intensity)
  meal_time: string;
  portion_size?: string;
  notes?: string;
  image_base64?: string; // Base64-encoded image
  created_at: string;
  updated_at: string;
}

export interface CreateFoodLogRequest {
  food_name: string;
  food_id?: string;
  meal_type: MealType;
  moods?: MoodType[]; // Moods associated with this meal (AI will determine intensity)
  meal_time: string;
  portion_size?: string;
  notes?: string;
  image_base64?: string; // Base64-encoded image
}

export interface UpdateFoodLogRequest {
  food_name?: string;
  food_id?: string;
  meal_type?: MealType;
  moods?: MoodType[]; // Moods associated with this meal (AI will determine intensity)
  meal_time?: string;
  portion_size?: string;
  notes?: string;
  image_base64?: string; // Base64-encoded image
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
