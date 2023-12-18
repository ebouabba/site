/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8001, { cors: '*' })
// @WebSocketGateway(8001, { cors: '*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private players: Map<string, string> = new Map();
  handleConnection(client: Socket) {
    console.log(`Chat: Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Chat: Client disconnected: ${client}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string): void {
    console.log('Chat: -------- ', message);
    const rm = this.players.get(client.id);
    if (rm) client.to(rm).emit('message', message);
    // Socket
  }
  @SubscribeMessage('room')
  handleCreatRoom(client: Socket, room: string): void {
    client.join(room);
    // console.log(this.players);
    this.players.set(client.id, room);
  }

  // @SubscribeMessage('y')
  // handleCreatpostion(client: Socket, y: number): void {
  //   // client.join(room);
  //   this.server.emit('y', y);
  //   console.log('Chat: -------- ', y);
  //   // this.players.set(client.id, room);
  // }
}

