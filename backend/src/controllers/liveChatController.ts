import { Server, Socket } from 'socket.io';

import Chat from '../models/chat';

const liveChatController = (io: Server, socket: Socket) => {
  const userId = socket.handshake.auth?.token;
  socket.on('joinChatChannel', () => {
    console.log(`User ${userId} joined chat channel`);
    socket.join(`chatChannel:${userId}`);
  });

  socket.on(
    'sendMessage',
    async ({
      receiverId,
      message,
    }: {
      receiverId: string;
      message: string;
    }) => {
      try {
        const saveMessage = await Chat.findOneAndUpdate(
          {
            members: { $in: [userId, receiverId] },
          },
          {
            $push: {
              messages: {
                user: userId,
                time: new Date(),
                message,
              },
            },
            $addToSet: {
              members: [userId, receiverId],
            },
          },
          { new: true, upsert: true }
        );

        const newMessage =
          saveMessage.messages[saveMessage.messages.length - 1];

        io.to(`chatChannel:${receiverId}`).emit('newMessage', newMessage);
      } catch (error) {}
    }
  );
};

export default liveChatController;
