import { Injectable } from '@nestjs/common';
import { Token } from 'src/auth/entities/token.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async save(projectId: number, token: Token) {
    await this.prismaService.projectToken.create({
      data: {
        projectId,
        token: token.token,
      },
    });
  }

  async get(projectId: number) {
    const res = await this.prismaService.projectToken.findUnique({
      where: {
        projectId,
      },
    });

    return res.token;
  }
}
