import { Server } from 'socket.io';

const socketRouter = (io: Server) => {
  io.use((socket, next) => {
    // TEMP AUTH
    if (socket.handshake.auth?.token) {
      next();
    } else {
      const err = new Error('not authorized');
      next(err);
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
  });
};

export default socketRouter;
