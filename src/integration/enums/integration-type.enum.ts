import { registerEnumType } from '@nestjs/graphql';

export enum IntegrationType {
  Amocrm = 'Amocrm',
  Bitrix = 'Bitrix',
}

registerEnumType(IntegrationType, {
  name: 'IntegrationType',
});
