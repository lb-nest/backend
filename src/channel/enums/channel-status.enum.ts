import { registerEnumType } from '@nestjs/graphql';

export enum ChannelStatus {
  Connected = 'Connected',
  Connecting = 'Connectiong',
  Error = 'Error',
}

registerEnumType(ChannelStatus, {
  name: 'ChannelStatus',
});
