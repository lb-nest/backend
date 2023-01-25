import { registerEnumType } from '@nestjs/graphql';

export enum ChannelType {
  Instagram = 'Instagram',
  Telegram = 'Telegram',
  Vkontakte = 'Vkontakte',
  Webchat = 'Webchat',
  Whatsapp = 'Whatsapp',
}

registerEnumType(ChannelType, {
  name: 'ChannelType',
});
