import { registerEnumType } from '@nestjs/graphql';

export enum ChannelStatus {
  Connected = 'Connected',
  Failed = 'Failed',
}

registerEnumType(ChannelStatus, {
  name: 'ChannelStatus',
});
