import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // enabling cors
  app.enableCors();

  //setting up swagger
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API for Ecommerce application.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'User authentication token, You can generate this token using login api',
    })
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  const port = process.env.PORT || 3000;
  console.log('Server is running on http://localhost:' + port);
  await app.listen(port);
}
bootstrap();
