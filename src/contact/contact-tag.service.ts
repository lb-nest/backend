import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';

@Injectable()
export class ContactTagService {
  constructor(@Inject(CONTACTS_SERVICE) private readonly client: ClientProxy) {}

  create(
    authorization: string,
    contactId: number,
    tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.client.send<TagWithoutParentAndChildren>(
      'contacts.tags.create',
      {
        headers: {
          authorization,
        },
        payload: {
          contactId,
          tagId,
        },
      },
    );
  }

  remove(
    authorization: string,
    contactId: number,
    tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.client.send<TagWithoutParentAndChildren>(
      'contacts.tags.remove',
      {
        headers: {
          authorization,
        },
        payload: {
          contactId,
          tagId,
        },
      },
    );
  }
}
