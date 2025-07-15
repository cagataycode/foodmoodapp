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
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const MOOD_LIST = [
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
  'guilty',
  'craving_more',
] as const;

export const MEAL_TYPE_LIST = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
] as const;

export type MoodType = (typeof MOOD_LIST)[number];
export type MealType = (typeof MEAL_TYPE_LIST)[number];

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

  @ApiProperty({
    description: 'Meal type (breakfast, lunch, dinner, snack)',
    enum: MEAL_TYPE_LIST,
    example: 'breakfast',
  })
  @IsString()
  @IsIn(MEAL_TYPE_LIST)
  meal_type: MealType;

  @ApiPropertyOptional({
    description: 'Base64-encoded image of the meal',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsOptional()
  @IsString()
  image_base64?: string;

  @ApiProperty({
    description: 'Mood after eating',
    enum: MOOD_LIST,
    example: 'energised',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(MOOD_LIST, { each: true })
  moods: MoodType[];

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
    description: 'Meal type (breakfast, lunch, dinner, snack)',
    enum: MEAL_TYPE_LIST,
    example: 'breakfast',
  })
  @IsOptional()
  @IsString()
  @IsIn(MEAL_TYPE_LIST)
  meal_type?: MealType;

  @ApiPropertyOptional({
    description: 'Base64-encoded image of the meal',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsOptional()
  @IsString()
  image_base64?: string;

  @ApiPropertyOptional({
    description: 'Mood after eating',
    enum: MOOD_LIST,
    example: 'energised',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(MOOD_LIST, { each: true })
  moods?: MoodType[];

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
    enum: MOOD_LIST,
    example: 'energised',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(MOOD_LIST, { each: true })
  moods?: MoodType[];

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
