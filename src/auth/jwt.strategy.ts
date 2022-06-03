import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import axios, { AxiosInstance } from 'axios';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
    });

    this.axios = axios.create({
      baseURL: this.configService.get<string>('AUTH_URL'),
    });
  }

  async validate(req: any, payload: any) {
    try {
      await this.axios.post('/auth/projects/@me/token/verify', undefined, {
        headers: {
          authorization: req.headers.authorization,
        },
      });

      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
