import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('AUTH_URL'),
    });
  }

  async getMe(authorization: string): Promise<User> {
    try {
      const res = await this.axios.get<User>('/users/@me', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getProjects(authorization: string): Promise<Project[]> {
    try {
      const res = await this.axios.get<Project[]>('/users/@me/projects', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(authorization: string, input: UpdateUserInput): Promise<User> {
    try {
      const res = await this.axios.patch<User>('/users/@me', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string): Promise<User> {
    throw new NotImplementedException();
  }
}
