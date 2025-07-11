// User-related types for the FoodMood app

export interface User {
  id: string;
  email: string;
  username?: string;
  subscription_tier: 'free' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  username?: string;
}

export interface UpdateUserRequest {
  username?: string;
  subscription_tier?: 'free' | 'premium';
}
