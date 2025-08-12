import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FoodLogsModule } from './food-logs/food-logs.module';
import { HealthModule } from './health/health.module';
import { SupabaseClientProvider } from './common/services/supabase-client.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    FoodLogsModule,
    HealthModule,
  ],
  providers: [SupabaseClientProvider],
})
export class AppModule {}
