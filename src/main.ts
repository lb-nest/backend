import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const prismaServive = app.get(PrismaService);
  await prismaServive.enableShutdownHooks(app);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
  });

  app.use(helmet());
  app.use(
    graphqlUploadExpress({
      maxFiles: 10,
      maxFileSize: 10485760,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
