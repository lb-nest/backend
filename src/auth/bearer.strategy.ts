import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { lastValueFrom } from 'rxjs';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async validate(token: string): Promise<any> {
    try {
      return await lastValueFrom(
        this.client.send('projects.@me.token.verify', {
          token,
        }),
      );
    } catch {
      throw new UnauthorizedException();
    }
  }
}
