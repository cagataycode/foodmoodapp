// Authentication-related types for the FoodMood app

import { User } from './user.types';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthenticatedRequest {
  user?: User;
  headers: Record<string, string | string[] | undefined>;
  body: any;
  params: any;
  query: any;
}
