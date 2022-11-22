import { registerEnumType } from '@nestjs/graphql';

export enum ButtonType {
  QuickReply = 'QuickReply',
  Url = 'Url',
  Phone = 'Phone',
}

registerEnumType(ButtonType, {
  name: 'ButtonType',
});
