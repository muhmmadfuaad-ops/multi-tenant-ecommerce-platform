// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enable CORS for testing
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  private users: Record<string, string> = {}; // socket.id -> userId mapping

  // When a user connects and sends their userId
  @SubscribeMessage('register')
  registerUser(
    @MessageBody() userId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.users[socket.id] = userId;
    console.log(`${userId} connected with socket id: ${socket.id}`);
  }

  // When a message is sent
  @SubscribeMessage('private_message')
  handleMessage(
    @MessageBody() payload: { to: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const from = this.users[socket.id];
    console.log(`Message from ${from} to ${payload.to}: ${payload.message}`);

    // Find the socket of the recipient
    const recipientSocketId = Object.keys(this.users).find(
      (key) => this.users[key] === payload.to,
    );

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('private_message', {
        from,
        message: payload.message,
      });
    }
  }

  // Optional: handle disconnections
  handleDisconnect(socket: Socket) {
    console.log(`${this.users[socket.id]} disconnected`);
    delete this.users[socket.id];
  }
}
