import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Token } from 'src/auth/entities/token.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectTokenService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  async save(id: number, token: Token): Promise<Token> {
    return this.cacheManager.set(
      `token:${id}`,
      await this.prismaService.project.create({
        data: {
          id,
          token: token.token,
        },
        select: {
          token: true,
        },
      }),
    );
  }

  async get(id: number): Promise<Token> {
    const token = await this.cacheManager.get<Token>(`token:${id}`);
    if (token) {
      return token;
    }

    return this.cacheManager.set(
      `token:${id}`,
      await this.prismaService.project.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          token: true,
        },
      }),
    );
  }
}
