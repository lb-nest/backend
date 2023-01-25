import { registerEnumType } from '@nestjs/graphql';

export enum AccessLevel {
  User = 'User',
  Admin = 'Admin',
  Owner = 'Owner',
}

registerEnumType(AccessLevel, {
  name: 'AccessLevel',
});
