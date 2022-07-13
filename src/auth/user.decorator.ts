import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator((_, context: ExecutionContext) => {
  return GqlExecutionContext.create(context).getContext().req.user;
});
