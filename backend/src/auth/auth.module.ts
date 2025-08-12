import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { PremiumGuard } from './guards/premium.guard';
import { SupabaseClientProvider } from '../common/services/supabase-client.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseAuthGuard,
    PremiumGuard,
    SupabaseClientProvider,
  ],
  exports: [AuthService, SupabaseAuthGuard, PremiumGuard],
})
export class AuthModule {}
