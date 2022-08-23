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

  async save(projectId: number, token: Token): Promise<Token> {
    return this.cacheManager.set(
      `token:${projectId}`,
      await this.prismaService.projectToken.create({
        data: {
          projectId,
          token: token.token,
        },
      }),
    );
  }

  async get(projectId: number): Promise<Token> {
    const token = await this.cacheManager.get<Token>(`token:${projectId}`);
    if (token) {
      return token;
    }

    return this.cacheManager.set(
      `token:${projectId}`,
      await this.prismaService.projectToken.findUniqueOrThrow({
        where: {
          projectId,
        },
      }),
    );
  }
}
