import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './events/events.adapter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ResultInterceptor } from './interceptor/result.interceptor';
// import startLiveServer from './live';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: (errors = []) => {
        const err = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
        throw new HttpException(err, HttpStatus.FORBIDDEN);
      },
    }),
  );

  app.useStaticAssets(join(process.cwd(), '/public/emoji'), { prefix: '/emojis/' });

  app.useGlobalInterceptors(new ResultInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Fen example')
    .setDescription('The Fen API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  // startLiveServer();
  await app.listen(7001);
}
bootstrap();
