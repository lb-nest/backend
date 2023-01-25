import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Project } from 'src/project/entities/project.entity';
import { AUTH_SERVICE } from 'src/shared/constants/broker';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  findAll(): Observable<User[]> {
    return this.client.send<User[]>('findAllUsers', undefined);
  }

  findOne(id: number): Observable<User> {
    return this.client.send<User>('findOneUser', id);
  }

  update(id: number, updateUserArgs: UpdateUserArgs): Observable<User> {
    return this.client.send<User>('updateUser', {
      id,
      ...updateUserArgs,
    });
  }

  remove(id: number): Observable<User> {
    return this.client.send<User>('removeUser', id);
  }

  confirm(code: string): Observable<boolean> {
    return this.client.send<boolean>('confirmUser', code);
  }

  findAllProjects(id: number): Observable<Project[]> {
    return this.client.send<Project[]>('findAllUserProjects', id);
  }
}
