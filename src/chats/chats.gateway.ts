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

  constructor() {
    // console.log('ChatGateway instance created');
  }

  private users: Record<string, string> = {}; // socket.id -> userId mapping

  // When a user connects and sends their userId
  @SubscribeMessage('register')
  registerUser(
    @MessageBody() userId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // console.log('registerUser triggered');
    // console.log('this.users in registerUser before:', this.users);
    this.users[socket.id] = userId;
    // console.log('this.users in registerUser after:', this.users);

    // console.log('userId:', userId);
    console.log(`${userId} connected with socket id: ${socket.id}`);
    // Notify all users about the new user
    this.server.emit('user_connected', {
      userId,
      users: Object.values(this.users), // Optional: send all connected users
    });
  }

  // When a message is sent
  @SubscribeMessage('private_message')
  handleMessage(
    @MessageBody() payload: { to: string; from: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      console.log('handleMessage triggered');
      console.log('this.users:', this.users);
      const { to, from, message } = payload;

      // const from = this.users[socket.id];

      // console.log('from:', from);
      // console.log('payload:', payload);

      // console.log('socket:', socket);

      console.log(`Message from ${from} to ${to}: ${message}`);
      // console.log('main point')
      // console.log('Object.keys(this.users):', Object.keys(this.users));
      // Find the socket of the recipient
      const recipientSocketId = Object.keys(this.users).find(
        (key) => this.users[key] === to,
      );

      const senderSocketId = Object.keys(this.users).find(
        (key) => this.users[key] === from,
      );

      console.log('recipientSocketId:', recipientSocketId);
      if (recipientSocketId && senderSocketId) {
        this.server.to(recipientSocketId).emit('private_message', {
          to,
          from,
          message,
        });

        this.server.to(senderSocketId).emit('private_message', {
          to,
          from,
          message,
        });
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  }

  // Optional: handle disconnections
  handleDisconnect(socket: Socket) {
    console.log(`${this.users[socket.id]} disconnected`);
    delete this.users[socket.id];
  }
}
