import { registerEnumType } from '@nestjs/graphql';

export enum HistoryEventType {
  Create = 'Create',
  Assign = 'Assign',
  Return = 'Return',
  Close = 'Close',
  Update = 'Update',
  Remove = 'Remove',
}

registerEnumType(HistoryEventType, {
  name: 'HistoryEventType',
});
