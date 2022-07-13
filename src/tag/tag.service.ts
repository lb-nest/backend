import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CONTACTS_SERVICE } from 'src/shared/rabbitmq/constants';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@Inject(CONTACTS_SERVICE) private readonly client: ClientProxy) {}

  async create(user: any, input: CreateTagInput): Promise<Tag> {
    try {
      return await lastValueFrom(
        this.client.send<Tag>('tags.create', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(user: any): Promise<Tag[]> {
    try {
      return await lastValueFrom(
        this.client.send<Tag[]>('tags.findAll', {
          user,
          data: {},
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(user: any, id: number): Promise<Tag> {
    try {
      return await lastValueFrom(
        this.client.send<Tag>('tags.findOne', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(user: any, input: UpdateTagInput): Promise<Tag> {
    try {
      return await lastValueFrom(
        this.client.send<Tag>('tags.update', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(user: any, id: number): Promise<Tag> {
    try {
      return await lastValueFrom(
        this.client.send<Tag>('tags.remove', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
