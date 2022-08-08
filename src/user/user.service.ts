import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Project } from 'src/project/entities/project.entity';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  findMe(authorization: string): Observable<User> {
    return this.client.send<User>('users.@me', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  findAllProjects(authorization: string): Observable<Project[]> {
    return this.client.send<Project[]>('users.@me.findAllProjects', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  update(
    authorization: string,
    updateUserArgs: UpdateUserArgs,
  ): Observable<User> {
    return this.client.send<User>('users.@me.update', {
      headers: {
        authorization,
      },
      payload: updateUserArgs,
    });
  }

  remove(authorization: string): Observable<User> {
    return this.client.send<User>('users.@me.remove', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }
}
