import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { 
  User, 
  AuthRequest, 
  AuthResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  Database
} from '../types';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient<Database>;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  /**
   * Register a new user
   */
  async register(userData: CreateUserRequest & { password: string }): Promise<AuthResponse> {
    const { email, password, username } = userData;

    // Check if user already exists
    const { data: existingUser } = await this.supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError || !authUser.user) {
      throw new UnauthorizedException(authError?.message || 'Failed to create user');
    }

    // Create user profile
    const { data: profile, error: profileError } = await this.supabase
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        email,
        username: username || null,
        subscription_tier: 'free'
      })
      .select()
      .single();

    if (profileError || !profile) {
      throw new UnauthorizedException('Failed to create user profile');
    }

    // Generate JWT token
    const token = this.generateToken(authUser.user.id);

    return {
      user: profile,
      token
    };
  }

  /**
   * Login user
   */
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Authenticate with Supabase
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Get user profile
    const { data: profile, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      throw new NotFoundException('User profile not found');
    }

    // Generate JWT token
    const token = this.generateToken(authData.user.id);

    return {
      user: profile,
      token
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, updateData: UpdateUserRequest): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    // Delete user profile
    const { error: profileError } = await this.supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw new UnauthorizedException('Failed to delete user profile');
    }

    // Delete user from Supabase Auth
    const { error: authError } = await this.supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new UnauthorizedException('Failed to delete user account');
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string): string {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });
  }
} 