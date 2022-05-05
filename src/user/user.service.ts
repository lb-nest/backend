import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly authUrl: string;

  constructor(configService: ConfigService) {
    this.authUrl = configService.get<string>('AUTH_URL');
  }

  async getMe(authorization: string): Promise<User> {
    try {
      const res = await axios.get<any>(this.authUrl.concat('/users/@me'), {
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
      const res = await axios.get<any[]>(
        this.authUrl.concat('/users/@me/projects'),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateUserInput,
  ): Promise<Project> {
    try {
      const res = await axios.patch<any>(
        this.authUrl.concat('/users/@me'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string): Promise<Project> {
    throw new NotImplementedException();
  }
}
