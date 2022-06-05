import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { Token } from 'src/auth/entities/token.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async save(projectId: number, token: Token): Promise<void> {
    await this.prismaService.projectToken.create({
      data: {
        projectId,
        token: token.token,
      },
    });
  }

  async get(projectId: number): Promise<string> {
    const res = await this.prismaService.projectToken.findUnique({
      where: {
        projectId,
      },
    });

    return res.token;
  }
}
