import { registerEnumType } from '@nestjs/graphql';

export enum ChannelType {
  Telegram = 'Telegram',
  Whatsapp = 'Whatsapp',
}

registerEnumType(ChannelType, {
  name: 'ChannelType',
});
