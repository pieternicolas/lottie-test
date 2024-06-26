import { Server, Socket } from 'socket.io';

const liveChatController = (io: Server, socket: Socket) => {
  socket.on('joinChatroom', (chatroomId: string) => {
    console.log(
      `User ${socket.handshake.auth?.token} joined chatroom: ${chatroomId}`
    );
    socket.join(`chatroom:${chatroomId}`);
  });

  socket.on(
    'sendMessage',
    ({ chatroomId, message }: { chatroomId: string; message: string }) => {
      // TODO: Save message to database
      socket.to(`chatroom:${chatroomId}`).emit('newMessage', message);
    }
  );
};

export default liveChatController;
