import { Injectable } from '@nestjs/common';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
export class TagService {
  create(authorization: string, input: CreateTagInput) {
    return;
  }

  findAll(authorization: string) {
    return;
  }

  findOne(authorization: string, id: number) {
    return;
  }

  update(authorization: string, input: UpdateTagInput) {
    return;
  }

  remove(authorization: string, id: number) {
    return;
  }
}
