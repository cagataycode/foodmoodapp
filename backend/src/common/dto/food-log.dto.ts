import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsISO8601,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  | 'sluggish';

export class CreateFoodLogDto {
  @ApiProperty({
    description: 'Name of the food consumed',
    example: 'Oatmeal with berries',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  food_name: string;

  @ApiPropertyOptional({
    description: 'Open Food Facts ID for future integration',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  food_id?: string;

  @ApiProperty({
    description: 'Mood after eating',
    enum: [
      'energised',
      'sleepy',
      'calm',
      'focused',
      'anxious',
      'happy',
      'sad',
      'irritable',
      'satisfied',
      'sluggish',
    ],
    example: 'energised',
  })
  @IsIn([
    'energised',
    'sleepy',
    'calm',
    'focused',
    'anxious',
    'happy',
    'sad',
    'irritable',
    'satisfied',
    'sluggish',
  ])
  mood: MoodType;

  @ApiProperty({
    description: 'When the meal was eaten (ISO 8601 format)',
    example: '2024-01-15T08:30:00Z',
  })
  @IsISO8601()
  meal_time: string;

  @ApiPropertyOptional({
    description: 'Portion size description',
    example: '1 cup',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  portion_size?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the meal',
    example: 'Added honey and cinnamon',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateFoodLogDto {
  @ApiPropertyOptional({
    description: 'Name of the food consumed',
    example: 'Oatmeal with berries',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  food_name?: string;

  @ApiPropertyOptional({
    description: 'Open Food Facts ID for future integration',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  food_id?: string;

  @ApiPropertyOptional({
    description: 'Mood after eating',
    enum: [
      'energised',
      'sleepy',
      'calm',
      'focused',
      'anxious',
      'happy',
      'sad',
      'irritable',
      'satisfied',
      'sluggish',
    ],
    example: 'energised',
  })
  @IsOptional()
  @IsIn([
    'energised',
    'sleepy',
    'calm',
    'focused',
    'anxious',
    'happy',
    'sad',
    'irritable',
    'satisfied',
    'sluggish',
  ])
  mood?: MoodType;

  @ApiPropertyOptional({
    description: 'When the meal was eaten (ISO 8601 format)',
    example: '2024-01-15T08:30:00Z',
  })
  @IsOptional()
  @IsISO8601()
  meal_time?: string;

  @ApiPropertyOptional({
    description: 'Portion size description',
    example: '1 cup',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  portion_size?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the meal',
    example: 'Added honey and cinnamon',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class FoodLogFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter logs from this date (ISO 8601 format)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Filter logs until this date (ISO 8601 format)',
    example: '2024-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Filter by mood type',
    enum: [
      'energised',
      'sleepy',
      'calm',
      'focused',
      'anxious',
      'happy',
      'sad',
      'irritable',
      'satisfied',
      'sluggish',
    ],
    example: 'energised',
  })
  @IsOptional()
  @IsIn([
    'energised',
    'sleepy',
    'calm',
    'focused',
    'anxious',
    'happy',
    'sad',
    'irritable',
    'satisfied',
    'sluggish',
  ])
  mood?: MoodType;

  @ApiPropertyOptional({
    description: 'Search by food name',
    example: 'oatmeal',
  })
  @IsOptional()
  @IsString()
  food_name?: string;

  @ApiPropertyOptional({
    description: 'Number of logs to return',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of logs to skip',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
