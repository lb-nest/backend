import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleType } from './enums/role-type.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    console.log(ctx);

    const { req, connection } = ctx.getContext();
    return connection ? connection.context : req;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);

    const roles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    return ctx
      .getContext()
      .req.user.project.roles.some(({ role }) => roles.includes(role));
  }
}
