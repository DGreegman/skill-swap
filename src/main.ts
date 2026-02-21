import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './http-exception.filter';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Fix for Swagger UI static assets path duplication issue
  // Serve swagger-ui assets at /api-docs/api-docs/ to handle relative path resolution
  const swaggerUiPath = join(__dirname, '..', 'node_modules', 'swagger-ui-dist');
  app.use('/api-docs/api-docs', express.static(swaggerUiPath));

  // swagger docs config and setup (before global prefix)
  const config = new DocumentBuilder()
    .setTitle('Skill Swap API Docs')
    .setDescription('Skill Swap - Trade Your Skill With Each Other')
    .setVersion('1.0')
    .addTag('SkillSwap')
    .addBearerAuth()
    .build();

    // Set global prefix AFTER Swagger setup, excluding api-docs
    app.setGlobalPrefix('api/v1', {
      exclude: ['api-docs'],
    });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Skill Swap API Documentation',
  });


  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
