import { Module } from '@nestjs/common';
import { FoodLogsController } from './food-logs.controller';
import { FoodLogsService } from './food-logs.service';
import { SupabaseClientProvider } from '../common/services/supabase-client.provider';

@Module({
  controllers: [FoodLogsController],
  providers: [FoodLogsService, SupabaseClientProvider],
  exports: [FoodLogsService],
})
export class FoodLogsModule {}
