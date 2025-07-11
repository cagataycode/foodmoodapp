import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FoodLogsService } from './food-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateFoodLogDto,
  UpdateFoodLogDto,
  FoodLogFiltersDto,
} from '../common/dto/food-log.dto';

@ApiTags('Food Logs')
@Controller('food-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FoodLogsController {
  constructor(private readonly foodLogsService: FoodLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new food log' })
  @ApiBody({ type: CreateFoodLogDto })
  @ApiResponse({
    status: 201,
    description: 'Food log created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user_id: { type: 'string' },
            food_name: { type: 'string' },
            mood: { type: 'string' },
            meal_time: { type: 'string' },
            portion_size: { type: 'string' },
            notes: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
        message: { type: 'string', example: 'Food log created successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createFoodLog(
    @Request() req,
    @Body() createFoodLogDto: CreateFoodLogDto,
  ) {
    const foodLog = await this.foodLogsService.createFoodLog(
      req.user.id,
      createFoodLogDto,
    );
    return {
      success: true,
      data: foodLog,
      message: 'Food log created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get food logs with optional filters' })
  @ApiQuery({
    name: 'start_date',
    required: false,
    description: 'Filter from date (ISO 8601)',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    description: 'Filter until date (ISO 8601)',
  })
  @ApiQuery({
    name: 'mood',
    required: false,
    description: 'Filter by mood type',
  })
  @ApiQuery({
    name: 'food_name',
    required: false,
    description: 'Search by food name',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of logs to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of logs to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'Food logs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              user_id: { type: 'string' },
              food_name: { type: 'string' },
              mood: { type: 'string' },
              meal_time: { type: 'string' },
              portion_size: { type: 'string' },
              notes: { type: 'string' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFoodLogs(@Request() req, @Query() filters: FoodLogFiltersDto) {
    const foodLogs = await this.foodLogsService.getFoodLogs(
      req.user.id,
      filters,
    );
    return {
      success: true,
      data: foodLogs,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get food log statistics' })
  @ApiQuery({
    name: 'start_date',
    required: false,
    description: 'Start date for statistics (ISO 8601)',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    description: 'End date for statistics (ISO 8601)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            totalLogs: { type: 'number' },
            moodCounts: { type: 'object' },
            mostCommonMood: { type: 'string' },
            averageMoodScore: { type: 'number' },
            period: {
              type: 'object',
              properties: {
                start: { type: 'string' },
                end: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFoodLogStats(
    @Request() req,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    const stats = await this.foodLogsService.getFoodLogStats(
      req.user.id,
      startDate,
      endDate,
    );
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific food log by ID' })
  @ApiParam({ name: 'id', description: 'Food log ID' })
  @ApiResponse({
    status: 200,
    description: 'Food log retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user_id: { type: 'string' },
            food_name: { type: 'string' },
            mood: { type: 'string' },
            meal_time: { type: 'string' },
            portion_size: { type: 'string' },
            notes: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Food log not found' })
  async getFoodLogById(@Request() req, @Param('id') id: string) {
    const foodLog = await this.foodLogsService.getFoodLogById(req.user.id, id);
    return {
      success: true,
      data: foodLog,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a food log' })
  @ApiParam({ name: 'id', description: 'Food log ID' })
  @ApiBody({ type: UpdateFoodLogDto })
  @ApiResponse({
    status: 200,
    description: 'Food log updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user_id: { type: 'string' },
            food_name: { type: 'string' },
            mood: { type: 'string' },
            meal_time: { type: 'string' },
            portion_size: { type: 'string' },
            notes: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
        message: { type: 'string', example: 'Food log updated successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Food log not found' })
  async updateFoodLog(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFoodLogDto: UpdateFoodLogDto,
  ) {
    const foodLog = await this.foodLogsService.updateFoodLog(
      req.user.id,
      id,
      updateFoodLogDto,
    );
    return {
      success: true,
      data: foodLog,
      message: 'Food log updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a food log' })
  @ApiParam({ name: 'id', description: 'Food log ID' })
  @ApiResponse({ status: 204, description: 'Food log deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Food log not found' })
  async deleteFoodLog(@Request() req, @Param('id') id: string) {
    await this.foodLogsService.deleteFoodLog(req.user.id, id);
  }
}
