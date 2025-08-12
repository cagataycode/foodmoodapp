import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  AuthResponseDto,
  UserResponseDto,
  MessageResponseDto,
} from '../common/dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      data: result,
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful', type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: result,
      message: 'Login successful',
    };
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  async getCurrentUser(@Request() req) {
    const profile = await this.authService.getUserById(req.user.id);
    return {
      success: true,
      data: profile,
    };
  }

  @Put('profile')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.authService.updateUser(
      req.user.id,
      updateProfileDto,
    );
    return {
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    };
  }

  @Delete('account')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiOkResponse({
    description: 'Account deleted successfully',
    type: MessageResponseDto,
  })
  async deleteAccount(@Request() req) {
    await this.authService.deleteUser(req.user.id);
    return {
      success: true,
      message: 'Account deleted successfully',
    };
  }
}
