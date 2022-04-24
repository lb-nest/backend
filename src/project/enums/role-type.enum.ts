import { registerEnumType } from '@nestjs/graphql';

export enum RoleType {
  User = 'User',
  Admin = 'Admin',
  Owner = 'Owner',
}

registerEnumType(RoleType, {
  name: 'Roletype',
});
