import { ArgsType, OmitType } from '@nestjs/graphql';
import { CreateContactInput } from './create-contact.input';

@ArgsType()
export class CreateContactWithoutChannelId extends OmitType(
  CreateContactInput,
  ['channelId'],
) {}
