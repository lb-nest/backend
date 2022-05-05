import { registerEnumType } from '@nestjs/graphql';

export enum HistoryEventType {
  Created = 'Created',
  Accepted = 'Accepted',
  Returned = 'Returned',
  Closed = 'Closed',
  Reopened = 'Reopened',
  Transferred = 'Transferred',
  UsernameChanged = 'UsernameChanged',
  NameChanged = 'NameChanged',
  NotesChanged = 'NotesChanged',
  TagsChanged = 'TagsChanged',
}

registerEnumType(HistoryEventType, {
  name: 'HistoryEventType',
});
