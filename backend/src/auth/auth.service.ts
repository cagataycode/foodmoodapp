import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Scope } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  User,
  AuthRequest,
  AuthResponse,
  CreateUserRequest,
  UpdateUserRequest,
  Database,
} from '../types';
import { SUPABASE_CLIENT } from '../common/services/supabase-client.provider';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  /**
   * Register a new user
   */
  async register(
    userData: CreateUserRequest & { password: string },
  ): Promise<AuthResponse> {
    const { email, password, username } = userData;

    // Pre-check: does a profile already exist for this email?
    const { data: existingUser } = await this.supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user in Supabase Auth (public sign-up)
    const { data: authUser, error: authError } =
      await this.supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined },
      });

    if (authError || !authUser.user) {
      throw new UnauthorizedException(
        authError?.message || 'Failed to create user',
      );
    }

    // Profile is created by DB trigger (see migrations). Try to fetch it; if not yet available, fallback.
    const { data: fetchedProfile, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (profileError || !fetchedProfile) {
      throw new UnauthorizedException('Failed to create user profile');
    }

    return {
      user: fetchedProfile as unknown as User,
      access_token: authUser.session?.access_token,
      refresh_token: authUser.session?.refresh_token,
    };
  }

  /**
   * Login user
   */
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
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

    return {
      user: profile,
      // Return Supabase tokens for the client to store
      access_token: authData.session?.access_token,
      refresh_token: authData.session?.refresh_token,
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
  async updateUser(
    userId: string,
    updateData: UpdateUserRequest,
  ): Promise<User> {
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
    const { error: authError } =
      await this.supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new UnauthorizedException('Failed to delete user account');
    }
  }
}
