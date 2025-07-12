import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    // Allow all origins in development for easier testing
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:19006',
        'exp://localhost:19000',
        'exp://192.168.1.100:19000',
        'exp://192.168.1.101:19000',
        'exp://192.168.1.102:19000',
        'exp://192.168.1.103:19000',
        'exp://192.168.1.104:19000',
        'exp://192.168.1.105:19000',
        'exp://10.0.0.1:19000',
        'exp://10.0.0.2:19000',
        'exp://10.0.0.3:19000',
        'exp://10.0.0.4:19000',
        'exp://10.0.0.5:19000',
        /^exp:\/\/.*:19000$/, // Any Expo Go URL
        /^http:\/\/192\.168\.\d+\.\d+:8081$/, // Local network Expo web
        /^http:\/\/10\.\d+\.\d+\.\d+:8081$/, // Local network Expo web
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  } else {
    // Production CORS configuration
    app.enableCors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FoodMood API')
    .setDescription('The FoodMood API for food and mood tracking')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 FoodMood Backend server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${port}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${port}/api/auth`);
  console.log(`🍽️  Food Logs API: http://localhost:${port}/api/food-logs`);
  console.log(`💡 Insights API: http://localhost:${port}/api/insights`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
