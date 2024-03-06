import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CORS } from './constants/cors';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan("dev"))

  // manejar Dto con class validator y validar la información en base a los controladores
  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  const reflector = app.get(Reflector)

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  const configService = app.get(ConfigService)

  app.enableCors(CORS)

  app.setGlobalPrefix("api/v1")

  const appPort = configService.get("APP_PORT")

  await app.listen(appPort || 4000)

  const appUrl = await app.getUrl()

  console.log(`App running on: ${appUrl}`)
}
bootstrap();
