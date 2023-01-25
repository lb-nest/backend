import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { RpcException } from '@nestjs/microservices';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ApolloError } from 'apollo-server-express';
import { throwError } from 'rxjs';

@Catch()
export class GlobalExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    switch (host.getType<GqlContextType>()) {
      case 'graphql':
        throw new ApolloError(exception?.message, undefined, exception);

      case 'rpc':
        return throwError(() => new RpcException(exception));

      case 'http':
        return host
          .switchToHttp()
          .getResponse()
          .status(exception?.status)
          .json(exception);

      case 'ws':
        return super.catch(exception, host);
    }
  }
}
