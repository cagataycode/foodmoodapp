import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
} from '../common/dto/auth.dto';
import {
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    subscription_tier: 'free',
  };
  const mockToken = 'jwt-token-123';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    it('should register successfully', async () => {
      const expectedResponse = { user: mockUser, token: mockToken };
      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(validRegisterDto);

      expect(result).toEqual({
        success: true,
        data: expectedResponse,
        message: 'User registered successfully',
      });
    });

    it('should register without username', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse = {
        user: { ...mockUser, username: null },
        token: mockToken,
      };
      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: true,
        data: expectedResponse,
        message: 'User registered successfully',
      });
    });

    it('should throw when user exists', async () => {
      mockAuthService.register.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      await expect(controller.register(validRegisterDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw when auth service fails', async () => {
      mockAuthService.register.mockRejectedValue(
        new UnauthorizedException('Failed to create user'),
      );

      await expect(controller.register(validRegisterDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    const validLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      const expectedResponse = { user: mockUser, token: mockToken };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(validLoginDto);

      expect(result).toEqual({
        success: true,
        data: expectedResponse,
        message: 'Login successful',
      });
    });

    it('should throw when credentials invalid', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid email or password'),
      );

      await expect(controller.login(validLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when profile not found', async () => {
      mockAuthService.login.mockRejectedValue(
        new NotFoundException('User profile not found'),
      );

      await expect(controller.login(validLoginDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockRequest = { user: mockUser };

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual({ success: true, data: mockUser });
    });
  });

  describe('updateProfile', () => {
    const updateProfileDto: UpdateProfileDto = {
      username: 'newusername',
      subscription_tier: 'premium',
    };
    const mockRequest = { user: mockUser };

    it('should update profile successfully', async () => {
      const updatedUser = { ...mockUser, ...updateProfileDto };
      mockAuthService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(
        mockRequest,
        updateProfileDto,
      );

      expect(result).toEqual({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully',
      });
    });

    it('should throw when user not found', async () => {
      mockAuthService.updateUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.updateProfile(mockRequest, updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    const mockRequest = { user: mockUser };

    it('should delete account successfully', async () => {
      mockAuthService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteAccount(mockRequest);

      expect(result).toEqual({
        success: true,
        message: 'Account deleted successfully',
      });
    });

    it('should throw when deletion fails', async () => {
      mockAuthService.deleteUser.mockRejectedValue(
        new UnauthorizedException('Failed to delete user account'),
      );

      await expect(controller.deleteAccount(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
