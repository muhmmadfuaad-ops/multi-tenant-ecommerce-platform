import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected as User1, socket id:', socket.id);
  socket.emit('register', 'user1');
});

setTimeout(() => {
  console.log('timeout triggerd in client1.ts');
  socket.emit('private_message', {
    to: 'user2',
    message: '1st message from user1 to user2',
  });
}, 5000);

setTimeout(() => {
  console.log('timeout triggerd in client1.ts');
  socket.emit('private_message', {
    to: 'user2',
    message: '3rd message from user1 to user2',
  });
}, 15000);

socket.on('private_message', (data) => {
  console.log('data:', data);
});

socket.on('connect_error', (err) => {
  console.error('err.message', err.message);
});
