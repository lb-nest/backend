import { registerEnumType } from '@nestjs/graphql';

export enum AssigneeType {
  User = 'User',
  Chatbot = 'Chatbot',
}

registerEnumType(AssigneeType, {
  name: 'AssigneeType',
});
