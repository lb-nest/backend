import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { Context } from 'apollo-server-core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ContactModule } from './contact/contact.module';
import { FileModule } from './file/file.module';
import { HsmModule } from './hsm/hsm.module';
import { MessageModule } from './message/message.module';
import { ProjectModule } from './project/project.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      maxListeners: Infinity,
    }),
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: true,
        cors: false,
        uploads: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: Context<any>) => {
              const connectionParams = Object.fromEntries(
                Object.entries(context.connectionParams).map(([key, val]) => [
                  key.toLowerCase(),
                  val,
                ]),
              );

              Object.assign(context.extra.request.headers, connectionParams);
              context.req = context.extra.request;
            },
          },
          context: ({ req, extra }) => ({
            req,
            extra,
          }),
        },
        playground: true,
      }),
    }),
    AuthModule,
    ProjectModule,
    UserModule,
    ChannelModule,
    ChatModule,
    HsmModule,
    WebhookModule,
    MessageModule,
    ContactModule,
    TagModule,
    FileModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
