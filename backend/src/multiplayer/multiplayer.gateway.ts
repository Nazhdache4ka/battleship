import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MultiplayerService } from './multiplayer.service';
import { AppSocket } from 'src/types/app-socket';
import { Board } from 'src/types/interfaces';
import { validateBoard } from 'src/utils/game-logic/validate-board';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'multiplayer',
})
export class MultiplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly multiplayerService: MultiplayerService,
    private readonly jwtService: JwtService
  ) {}

  handleConnection(client: AppSocket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token: string | undefined = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify<{ id: number; email: string }>(token);

      if (decoded?.id == null || decoded.email == null) {
        client.disconnect();
        return;
      }

      client.data.user = {
        id: decoded.id,
        email: decoded.email,
      };
    } catch {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: AppSocket) {
    const userId = client.data.user?.id;

    if (userId == null) {
      return;
    }

    this.multiplayerService.leaveQueue(userId);
  }

  @SubscribeMessage('queue:join')
  async handleMessage(@ConnectedSocket() client: AppSocket, @MessageBody() payload: { board: Board }) {
    const userId = client.data.user?.id;

    if (userId == null) {
      throw new WsException('Unauthorized');
    }

    const validBoard = validateBoard(payload.board);

    if (!validBoard) {
      throw new WsException('Invalid board');
    }

    await this.multiplayerService.joinQueue(client, { board: validBoard }, this.server);
  }

  @SubscribeMessage('queue:leave')
  handleLeave(@ConnectedSocket() client: AppSocket) {
    const userId = client.data.user?.id;

    if (userId == null) {
      throw new WsException('Unauthorized');
    }

    this.multiplayerService.leaveQueue(userId);
  }

  @SubscribeMessage('game:move')
  async handleMove(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: { gameId: number; x: number; y: number }
  ) {
    const userId = client.data.user?.id;

    if (userId == null) {
      throw new WsException('Unauthorized');
    }

    await this.multiplayerService.handleMove({ userId, ...payload, server: this.server });
  }
}
