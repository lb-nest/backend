import { registerEnumType } from '@nestjs/graphql';

export enum ChannelType {
  Telegram = 'Telegram',
  Webchat = 'Webchat',
  Whatsapp = 'Whatsapp',
}

registerEnumType(ChannelType, {
  name: 'ChannelType',
});
