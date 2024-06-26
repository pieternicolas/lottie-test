import { Server } from 'socket.io';

import Project from '../models/project';
import User from '../models/user';

const socketRouter = (io: Server) => {
  io.use((socket, next) => {
    if (!socket.handshake.auth?.token) {
      next(new Error('Unauthorized'));
      return;
    }

    const findUser = User.findOne({ _id: socket.handshake.auth.token });
    if (!findUser) {
      next(new Error('Unauthorized'));
      return;
    }

    next();
  });

  io.on('connection', (socket) => {
    console.log(`User id connected: ${socket.handshake.auth?.token}`);

    socket.on('joinProject', (projectId: string) => {
      console.log(
        `User ${socket.handshake.auth?.token} joined project: ${projectId}`
      );
      socket.join(projectId);
    });

    socket.on('updateAnimation', async (animation) => {
      const res = await Project.findOneAndUpdate(
        { _id: animation._id },
        animation,
        { new: true }
      );

      if (res) {
        socket.to(String(res?._id)).emit('getNewAnimation', res);
      }
    });
  });
};

export default socketRouter;
