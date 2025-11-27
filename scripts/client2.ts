// scripts/client2.ts
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000', {
  transports: ['websocket'], // force WebSocket
});

socket.on('connect', () => {
  console.log('Connected as User2, socket id:', socket.id);
  socket.emit('register', 'user2');
});

socket.on('private_message', (data) => {
  console.log('data:', data);
});

socket.on('connect_error', (err) => {
  console.error('err.message:', err.message);
});

setTimeout(() => {
  console.log('timeout triggerd in client1.ts');
  socket.emit('private_message', {
    to: 'user1',
    message: '2nd message from user2 to user1',
  });
}, 10000);
