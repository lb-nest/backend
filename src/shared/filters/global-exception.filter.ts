import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    throw new ApolloError(exception?.message, undefined, exception);
  }
}
