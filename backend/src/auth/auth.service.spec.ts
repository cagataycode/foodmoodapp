import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SUPABASE_CLIENT } from '../common/services/supabase-client.provider';
import { AuthService } from './auth.service';
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('AuthService', () => {
  let service: AuthService;
  let mockSupabaseClient: any;

  // Test data
  const userId = 'user-123';
  const mockUser = {
    id: userId,
    email: 'test@example.com',
    username: 'testuser',
    subscription_tier: 'free',
  };
  const mockAuthUser = { user: { id: userId, email: 'test@example.com' } };
  const validUserData = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
  };
  const validCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  // Helper functions
  const createMockQuery = () => {
    const query: any = {};
    ['select', 'eq', 'single', 'insert', 'update', 'delete'].forEach(method => {
      query[method] = jest.fn().mockReturnThis();
    });
    return query;
  };

  const setupMock = (mockFrom: any) => {
    mockSupabaseClient.from.mockImplementation(mockFrom);
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      auth: {
        admin: { createUser: jest.fn(), deleteUser: jest.fn() },
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
      },
      from: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(
        (key: string) =>
          ({
            SUPABASE_URL: 'https://test.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
            JWT_SECRET: 'test-jwt-secret',
          })[key] || null,
      ),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    const module = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(token => {
        if (token === SUPABASE_CLIENT) return mockSupabaseClient;

        if (token === ConfigService) return mockConfigService as any;
      })
      .compile();
    service = await module.resolve<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register successfully', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValueOnce({ data: null, error: null });
      mockQuery.single.mockResolvedValueOnce({ data: mockUser, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: { id: userId },
          session: { access_token: 'at', refresh_token: 'rt' },
        },
        error: null,
      });

      const result = await service.register(validUserData);

      expect(result).toEqual({
        user: mockUser,
        access_token: 'at',
        refresh_token: 'rt',
      });
    });

    it('should register without username', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValueOnce({ data: null, error: null });
      mockQuery.single.mockResolvedValueOnce({
        data: { ...mockUser, username: null },
        error: null,
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: { id: userId },
          session: { access_token: 'at', refresh_token: 'rt' },
        },
        error: null,
      });

      const result = await service.register(userData);

      expect(result.user.username).toBeNull();
    });

    it('should throw when user exists', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({ data: mockUser, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));

      await expect(service.register(validUserData)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw when auth creation fails', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({ data: null, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Auth creation failed' },
      });

      await expect(service.register(validUserData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when profile creation fails', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValueOnce({ data: null, error: null });
      mockQuery.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Profile creation failed' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: { id: userId },
          session: { access_token: 'at', refresh_token: 'rt' },
        },
        error: null,
      });

      await expect(service.register(validUserData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({ data: mockUser, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: mockAuthUser,
        error: null,
      });

      const result = await service.login(validCredentials);

      expect(result).toEqual({
        user: mockUser,
        access_token: undefined,
        refresh_token: undefined,
      });
    });

    it('should throw when credentials invalid', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid email or password' },
      });

      await expect(service.login(validCredentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when profile not found', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: mockAuthUser,
        error: null,
      });

      await expect(service.login(validCredentials)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return user', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({ data: mockUser, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));

      const result = await service.getUserById(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw when user not found', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));

      await expect(service.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    const updateData = {
      username: 'newusername',
      subscription_tier: 'premium' as const,
    };
    const updatedUser = { ...mockUser, ...updateData };

    it('should update successfully', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({ data: updatedUser, error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));

      const result = await service.updateUser(userId, updateData);

      expect(result).toEqual(updatedUser);
    });

    it('should throw when user not found', async () => {
      const mockQuery = createMockQuery();
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));

      await expect(service.updateUser(userId, updateData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete successfully', async () => {
      const mockQuery = createMockQuery();
      mockQuery.eq.mockResolvedValue({ error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
        error: null,
      });

      await service.deleteUser(userId);

      expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should throw when profile deletion fails', async () => {
      const mockQuery = createMockQuery();
      mockQuery.eq.mockResolvedValue({
        error: { message: 'Profile deletion failed' },
      });
      setupMock(jest.fn().mockReturnValue(mockQuery));

      await expect(service.deleteUser(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when auth deletion fails', async () => {
      const mockQuery = createMockQuery();
      mockQuery.eq.mockResolvedValue({ error: null });
      setupMock(jest.fn().mockReturnValue(mockQuery));
      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
        error: { message: 'Auth deletion failed' },
      });

      await expect(service.deleteUser(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
