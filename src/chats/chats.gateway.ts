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
  @SubscribeMessage('registerUser')
  registerUser(
    @MessageBody() userName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('registerUser triggered');
    console.log('userName:', userName);
    // console.log('this.users in registerUser before:', this.users);
    this.users[socket.id] = userName;
    // console.log('this.users in registerUser after:', this.users);

    // console.log('userId:', userId);
    console.log(`${userName} connected with socket id: ${socket.id}`);
    // Notify all users except this one, about the new user
    const otherUsersNames = Object.values(this.users).filter(
      (name) => name !== userName,
    );

    const otherUsersIds = Object.keys(this.users).filter(
      (name) => name !== socket.id,
    );

    console.log('this.users:', this.users);
    console.log('otherUsersNames:', otherUsersNames);

    otherUsersIds.forEach((id) => {
      console.log(`emitting userConnected event to ${id}`);
      this.server.to(id).emit('userConnected', { userData: userName });
    });

    const usersData = Object.values(this.users);
    console.log('usersData:', usersData);

    // provide all the users to new joiner
    this.server.to(socket.id).emit('registrationSuccessful', {
      usersData,
    });
  }

  // @SubscribeMessage('userDisconnected')
  //   userDisconnected(
  //     @MessageBody() userName: string,
  //   @ConnectedSocket() socket: Socket,
  // ) {
  //     console.log('registerUser triggered');
  //     console.log('userName:', userName);
  //     // console.log('this.users in registerUser before:', this.users);
  //     this.users[socket.id] = userName;
  //     // console.log('this.users in registerUser after:', this.users);
  //
  //     // console.log('userId:', userId);
  //     console.log(`${userName} connected with socket id: ${socket.id}`);
  //     // Notify all users except this one, about the new user
  //     const otherUsersNames = Object.keys(this.users).filter(
  //       (name) => name !== userName,
  //     );
  //     console.log('otherUsersNames:', otherUsersNames);
  //
  //     otherUsersNames.forEach((id) => {
  //       this.server.to(id).emit('userConnected', { userData: userName });
  //     });
  //
  //   // provide all users to this new joiner
  //   this.server.to(socket.id).emit('registrationSuccessful', {
  //     usersData: Object.values(this.users), // send all connected users
  //   });
  // }

  @SubscribeMessage('typing_event')
  handleTyping(
    @MessageBody() payload: { to: string; from: string; isTyping: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      console.log('handleTyping triggered');
      // console.log('this.users:', this.users);
      const { to, from, isTyping } = payload;

      // const from = this.users[socket.id];

      // console.log('from:', from);
      console.log('payload:', payload);

      // console.log('socket:', socket);

      // console.log(`Message from ${from} to ${to}: ${message}`);
      // console.log('main point')
      // console.log('Object.keys(this.users):', Object.keys(this.users));
      // Find the socket of the recipient
      const recipientSocketId = Object.keys(this.users).find(
        (key) => this.users[key] === to,
      );

      console.log(`received a isTyping event for ${recipientSocketId}`);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('is_typing', {
          to,
          from,
          isTyping,
        });
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
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
