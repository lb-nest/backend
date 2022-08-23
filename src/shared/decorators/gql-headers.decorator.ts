import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlHeaders = createParamDecorator<string | undefined>(
  (property, context: ExecutionContext) => {
    const { headers } = GqlExecutionContext.create(context).getContext().req;
    return property ? headers[property] : headers;
  },
);
