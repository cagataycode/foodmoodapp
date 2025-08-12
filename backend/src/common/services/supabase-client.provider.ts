import { Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Request } from 'express';
import { Database } from '../../types';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const SupabaseClientProvider = {
  provide: SUPABASE_CLIENT,
  scope: Scope.REQUEST,
  useFactory: (
    configService: ConfigService,
    req: Request,
  ): SupabaseClient<Database> => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    const rawAuthHeader = req.headers['authorization'];

    const sanitizeAuthorizationHeader = (
      header: unknown,
    ): string | undefined => {
      if (!header || typeof header !== 'string') return undefined;
      const trimmed = header.trim();
      if (!trimmed.toLowerCase().startsWith('bearer ')) return undefined;
      const token = trimmed.slice(7).trim();
      // Basic token shape check (JWT-like); still delegated to Supabase for actual validation
      if (!token || token.length < 16) return undefined;
      return `Bearer ${token}`;
    };

    const authHeader = sanitizeAuthorizationHeader(rawAuthHeader);

    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });
  },
  inject: [ConfigService, REQUEST],
};
