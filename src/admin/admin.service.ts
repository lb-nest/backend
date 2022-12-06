import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ADMIN_SERVICE } from 'src/shared/constants/broker';

@Injectable()
export class AdminService {
  constructor(@Inject(ADMIN_SERVICE) private readonly client: ClientProxy) {}

  test(): boolean {
    return true;
  }
}
