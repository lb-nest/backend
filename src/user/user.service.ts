import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  async getByToken(authorization: string) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.get(url.concat('/users/@me'), {
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
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.get(url.concat('/users/@me/projects'), {
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
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.patch(url.concat('/users/@me'), input, {
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
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.delete(url.concat('/users/@me'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
