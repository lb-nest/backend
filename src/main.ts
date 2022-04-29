import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaServive = app.get(PrismaService);
  await prismaServive.enableShutdownHooks(app);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
  });

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
