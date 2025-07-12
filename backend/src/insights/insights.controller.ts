import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PremiumGuard } from '../auth/guards/premium.guard';

@ApiTags('Insights')
@Controller('insights')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @ApiOperation({ summary: 'Get insights with optional filters' })
  @ApiQuery({
    name: 'insight_type',
    required: false,
    description: 'Filter by insight type',
  })
  @ApiQuery({
    name: 'is_read',
    required: false,
    description: 'Filter by read status',
  })
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
    name: 'limit',
    required: false,
    description: 'Number of insights to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of insights to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'Insights retrieved successfully',
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
              insight_type: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              data: { type: 'object' },
              period_start: { type: 'string' },
              period_end: { type: 'string' },
              is_read: { type: 'boolean' },
              created_at: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInsights(@Request() req, @Query() filters: any) {
    const insights = await this.insightsService.getInsights(
      req.user.id,
      filters,
    );
    return {
      success: true,
      data: insights,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific insight by ID' })
  @ApiParam({ name: 'id', description: 'Insight ID' })
  @ApiResponse({
    status: 200,
    description: 'Insight retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user_id: { type: 'string' },
            insight_type: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            data: { type: 'object' },
            period_start: { type: 'string' },
            period_end: { type: 'string' },
            is_read: { type: 'boolean' },
            created_at: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Insight not found' })
  async getInsightById(@Request() req, @Param('id') id: string) {
    const insight = await this.insightsService.getInsightById(req.user.id, id);
    return {
      success: true,
      data: insight,
    };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark an insight as read' })
  @ApiParam({ name: 'id', description: 'Insight ID' })
  @ApiResponse({
    status: 200,
    description: 'Insight marked as read successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            is_read: { type: 'boolean', example: true },
          },
        },
        message: { type: 'string', example: 'Insight marked as read' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Insight not found' })
  async markInsightAsRead(@Request() req, @Param('id') id: string) {
    const insight = await this.insightsService.markInsightAsRead(
      req.user.id,
      id,
    );
    return {
      success: true,
      data: insight,
      message: 'Insight marked as read',
    };
  }

  @Post('generate/weekly')
  @ApiOperation({ summary: 'Generate weekly insights' })
  @ApiResponse({
    status: 201,
    description: 'Weekly insights generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            insight_type: { type: 'string', example: 'weekly' },
            title: { type: 'string' },
            description: { type: 'string' },
            data: { type: 'object' },
            is_read: { type: 'boolean', example: false },
            created_at: { type: 'string' },
          },
        },
        message: {
          type: 'string',
          example: 'Weekly insights generated successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateWeeklyInsights(@Request() req) {
    const insight = await this.insightsService.generateWeeklyInsights(
      req.user.id,
    );
    return {
      success: true,
      data: insight,
      message: 'Weekly insights generated successfully',
    };
  }

  @Post('generate/monthly')
  @UseGuards(PremiumGuard)
  @ApiOperation({ summary: 'Generate monthly insights (Premium)' })
  @ApiResponse({
    status: 201,
    description: 'Monthly insights generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            insight_type: { type: 'string', example: 'monthly' },
            title: { type: 'string' },
            description: { type: 'string' },
            data: { type: 'object' },
            is_read: { type: 'boolean', example: false },
            created_at: { type: 'string' },
          },
        },
        message: {
          type: 'string',
          example: 'Monthly insights generated successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Premium subscription required' })
  async generateMonthlyInsights(@Request() req) {
    const insight = await this.insightsService.generateMonthlyInsights(
      req.user.id,
    );
    return {
      success: true,
      data: insight,
      message: 'Monthly insights generated successfully',
    };
  }

  @Post('generate/patterns')
  @UseGuards(PremiumGuard)
  @ApiOperation({ summary: 'Generate pattern insights (Premium)' })
  @ApiResponse({
    status: 201,
    description: 'Pattern insights generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            insight_type: { type: 'string', example: 'pattern' },
            title: { type: 'string' },
            description: { type: 'string' },
            data: { type: 'object' },
            is_read: { type: 'boolean', example: false },
            created_at: { type: 'string' },
          },
        },
        message: {
          type: 'string',
          example: 'Pattern insights generated successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Premium subscription required' })
  async generatePatternInsights(@Request() req) {
    const insight = await this.insightsService.generatePatternInsights(
      req.user.id,
    );
    return {
      success: true,
      data: insight,
      message: 'Pattern insights generated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an insight' })
  @ApiParam({ name: 'id', description: 'Insight ID' })
  @ApiResponse({ status: 204, description: 'Insight deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Insight not found' })
  async deleteInsight(@Request() req, @Param('id') id: string) {
    await this.insightsService.deleteInsight(req.user.id, id);
  }
}
