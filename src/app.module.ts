import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Context } from 'apollo-server-core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ChatModule } from './chat/chat.module';
import { HsmModule } from './hsm/hsm.module';
import { MessageModule } from './message/message.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: true,
        playground: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
