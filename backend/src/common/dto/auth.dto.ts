import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Optional username',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  username?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Username',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Subscription tier',
    enum: ['free', 'premium'],
    example: 'premium',
  })
  @IsOptional()
  @IsIn(['free', 'premium'])
  subscription_tier?: 'free' | 'premium';
}

// Response DTOs (for concise Swagger types)
export class UserProfileDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) username?: string | null;
  @ApiProperty({ enum: ['free', 'premium'] }) subscription_tier:
    | 'free'
    | 'premium';
}

export class AuthPayloadDto {
  @ApiProperty({ type: UserProfileDto }) user: UserProfileDto;
  @ApiPropertyOptional() access_token?: string;
  @ApiPropertyOptional() refresh_token?: string;
}

export class AuthResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty({ type: AuthPayloadDto }) data: AuthPayloadDto;
  @ApiPropertyOptional() message?: string;
}

export class UserResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty({ type: UserProfileDto }) data: UserProfileDto;
  @ApiPropertyOptional() message?: string;
}

export class MessageResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
}
