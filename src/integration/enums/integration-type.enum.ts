import { registerEnumType } from '@nestjs/graphql';

export enum IntegrationType {
  Amocrm = 'Amocrm',
  Bitrix = 'Bitrix',
  Roistat = 'Roistat',
}

registerEnumType(IntegrationType, {
  name: 'IntegrationType',
});
