import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';

@Injectable()
export class ContactTagService {
  constructor(@Inject('CONTACTS') private readonly client: ClientProxy) {}

  async create(
    user: any,
    contactId: number,
    tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    try {
      return await lastValueFrom(
        this.client.send('contacts.tags.create', {
          user,
          data: {
            contactId,
            tagId,
          },
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(
    user: any,
    contactId: number,
    tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    try {
      return await lastValueFrom(
        this.client.send('contacts.tags.remove', {
          user,
          data: {
            contactId,
            tagId,
          },
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
