import { WebSocketGateway } from '@nestjs/websockets';
import { AppService } from './app.service';

// https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
@WebSocketGateway(1337)
export class AppGateway {
  constructor(private readonly appService: AppService) {}
}
