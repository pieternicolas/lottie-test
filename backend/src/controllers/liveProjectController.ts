import { Server, Socket } from 'socket.io';

import Project from '../models/project';

const liveProjectController = (io: Server, socket: Socket) => {
  socket.on('joinProject', (projectId: string) => {
    console.log(
      `User ${socket.handshake.auth?.token} joined project: ${projectId}`
    );
    socket.join(`project:${projectId}`);
  });

  socket.on('updateAnimation', async (animation) => {
    const res = await Project.findOneAndUpdate(
      { _id: animation._id },
      animation,
      { new: true }
    );

    if (res) {
      socket.to(`project:${res._id}`).emit('getNewAnimation', res);
    }
  });
};

export default liveProjectController;
