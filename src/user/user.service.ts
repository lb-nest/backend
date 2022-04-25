import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  private readonly authUrl: string;

  constructor(configService: ConfigService) {
    this.authUrl = configService.get<string>('AUTH_URL');
  }

  async getById(authorization: string, id: number) {
    const res = await axios.get(this.authUrl.concat(`/users/${id}`), {
      headers: {
        authorization,
      },
    });

    return res.data;
  }

  async getMe(authorization: string) {
    try {
      const res = await axios.get(this.authUrl.concat('/users/@me'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getProjects(authorization: string) {
    try {
      const res = await axios.get(this.authUrl.concat('/users/@me/projects'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(authorization: string, input: UpdateUserInput) {
    try {
      const res = await axios.patch(this.authUrl.concat('/users/@me'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string) {
    throw new NotImplementedException();
  }
}
