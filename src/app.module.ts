import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Context } from 'apollo-server-core';
import Joi from 'joi';
import mapObject from 'map-obj';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ContactModule } from './contact/contact.module';
import { FileModule } from './file/file.module';
import { HsmModule } from './hsm/hsm.module';
import { IntegrationModule } from './integration/integration.module';
import { MailingModule } from './mailing/mailing.module';
import { MessageModule } from './message/message.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaService } from './prisma.service';
import { ProjectModule } from './project/project.module';
import {
  ADMIN_SERVICE,
  AUTH_SERVICE,
  BILLING_SERVICE,
  CHATBOTS_SERVICE,
  CONTACTS_SERVICE,
  INTEGRATIONS_SERVICE,
  MAILINGS_SERVICE,
  MESSAGING_SERVICE,
} from './shared/constants/broker';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { WebhookModule } from './webhook/webhook.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        BROKER_URL: Joi.string().uri().required(),
        PORT: Joi.number().port().default(8080),
        SECRET: Joi.string().required(),
        S3_ENDPOINT: Joi.string().uri().required(),
        S3_ACCESS_KEY: Joi.string().required(),
        S3_SECRET_KEY: Joi.string().required(),
        S3_BUCKET: Joi.string().required(),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: true,
        uploads: false,
        persistedQueries: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: Context<any>) => {
              Object.assign(
                context.extra.request.headers,
                mapObject(
                  context.connectionParams,
                  (key: string, value) => [key.toLowerCase(), value],
                  {
                    deep: true,
                  },
                ),
              );
              context.req = context.extra.request;
            },
          },
          context: ({ req, res, extra }) => ({
            req,
            res,
            extra,
          }),
        },
        playground: true,
      }),
    }),
    EventEmitterModule.forRoot({
      maxListeners: Infinity,
    }),
    ClientsModule.registerAsync([
      {
        name: ADMIN_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${ADMIN_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${AUTH_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BILLING_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${BILLING_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: CHATBOTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${CHATBOTS_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: CONTACTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${CONTACTS_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: INTEGRATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${INTEGRATIONS_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MAILINGS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${MAILINGS_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MESSAGING_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('BROKER_URL')],
            queue: `${MESSAGING_SERVICE}_QUEUE`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AdminModule,
    AuthModule,
    ChannelModule,
    ChatModule,
    ChatbotModule,
    ContactModule,
    FileModule,
    HsmModule,
    IntegrationModule,
    MailingModule,
    MessageModule,
    PaymentModule,
    ProjectModule,
    TagModule,
    UserModule,
    WalletModule,
    WebhookModule,
    SubscriptionModule,
    TransactionModule,
  ],
  providers: [PrismaService],
  exports: [
    ClientsModule,
    ChannelModule,
    ChatModule,
    ContactModule,
    IntegrationModule,
    MailingModule,
    MessageModule,
    ProjectModule,
    WalletModule,
  ],
})
export class AppModule {}
