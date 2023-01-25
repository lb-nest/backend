import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { BACKEND } from './shared/constants/broker';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('BROKER_URL')],
        queue: `${BACKEND}_QUEUE`,
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT'), '0.0.0.0');
}
bootstrap();
