import { Server, Socket } from 'socket.io';

import Chat from '../models/chat';
import mongoose from 'mongoose';

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
            members: {
              $all: [
                {
                  $elemMatch: {
                    $eq: mongoose.Types.ObjectId.createFromHexString(userId),
                  },
                },
                {
                  $elemMatch: {
                    $eq: mongoose.Types.ObjectId.createFromHexString(
                      receiverId
                    ),
                  },
                },
              ],
            },
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
        ).lean();

        const newMessage = {
          ...saveMessage.messages[saveMessage.messages.length - 1],
          to: receiverId,
        };

        io.to(`chatChannel:${receiverId}`)
          .to(`chatChannel:${userId}`)
          .emit('newMessage', newMessage);
      } catch (error) {
        console.log(error);
      }
    }
  );
};

export default liveChatController;
