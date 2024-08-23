import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  GLOBAL_API_PREFIX,
  GLOBAL_API_PREFIX_VERSION,
} from './configurations/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = `${GLOBAL_API_PREFIX}/${GLOBAL_API_PREFIX_VERSION}`;
  app.setGlobalPrefix(apiPrefix);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
