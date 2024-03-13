import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CORS } from './constants/cors';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Potential Matches API')
    .setDescription('CRM - Potential Matches')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  app.setGlobalPrefix("api/v1")

  const appPort = configService.get(process.env.NODE_ENV === "development" ? "APP_PORT" : "TEST_APP_PORT")

  await app.listen(
    parseInt(process.env.PORT) || // for Render
    appPort ||
    4000
  )

  const appUrl = await app.getUrl()

  console.log(`App running on: ${appUrl}`)
}
bootstrap();
