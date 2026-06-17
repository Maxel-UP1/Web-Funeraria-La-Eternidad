import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global prefix
  app.setGlobalPrefix('api');
  
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Security headers
  app.use(helmet());

  // CORS
  const corsOrigins = configService.get<string>('app.corsOrigins') ?? '';
  app.enableCors({
    origin: typeof corsOrigins === 'string'
      ? corsOrigins.split(',').map((o) => o.trim())
      : corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip non-DTO properties
      forbidNonWhitelisted: true, // Throw on extra properties
      transform: true,           // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Casa Funeraria La Eternidad — API')
    .setDescription(
      'API REST empresarial para gestión de catálogo, CRM y sedes de la Casa Funeraria La Eternidad',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication & authorization')
    .addTag('Categories', 'Product categories management')
    .addTag('Products', 'Product catalog management')
    .addTag('Leads', 'Contact leads / PQRS')
    .addTag('Pre-Orders', 'Pre-order management with WhatsApp redirect')
    .addTag('Branches', 'Branch locations management')
    .addTag('Health', 'System health checks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start
  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
