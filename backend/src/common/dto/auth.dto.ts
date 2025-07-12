import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
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