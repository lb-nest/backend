import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Project } from 'src/project/entities/project.entity';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  findMe(user: any): Observable<User> {
    return this.client.send<User>('users.@me', {
      user,
      data: {},
    });
  }

  findAllProjects(user: any): Observable<Project[]> {
    return this.client.send('users.@me.projects', {
      user,
      data: {},
    });
  }

  update(user: any, input: UpdateUserInput): Observable<User> {
    return this.client.send('users.@me.update', {
      user,
      data: input,
    });
  }

  remove(user: any): Observable<User> {
    throw new NotImplementedException();
  }
}
