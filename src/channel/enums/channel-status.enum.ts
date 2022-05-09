import { registerEnumType } from '@nestjs/graphql';

export enum ChannelStatus {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Error = 'Error',
}

registerEnumType(ChannelStatus, {
  name: 'ChannelStatus',
});
