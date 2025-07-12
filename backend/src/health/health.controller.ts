import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Server is running',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'FoodMood Backend is running' },
        timestamp: { type: 'string', example: '2024-01-15T08:30:00Z' },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  getHealth() {
    return {
      success: true,
      message: 'FoodMood Backend is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
} 