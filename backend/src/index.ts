import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import { connectDatabase } from './db';
import authRouter from './controllers/authController';
import projectRouter from './controllers/projectController';
import userRouter from './controllers/userController';
import liveProjectController from './controllers/liveProjectController';
import liveChatController from './controllers/liveChatController';

import User from './models/user';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (req.originalUrl.includes('/auth') || req.originalUrl.includes('/check')) {
    next();
    return;
  }

  if (!req.headers?.authorization) {
    res.status(401).send('Unauthorized');
    return;
  }

  const findUser = await User.findOne({ _id: req.headers.authorization });
  if (!findUser) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
});

app.get('/check', (req: Request, res: Response) => {
  res.send('Health Check!');
});
app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/users', userRouter);
io.on('connection', (socket) => {
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

  console.log(`User id connected: ${socket.handshake.auth?.token}`);
  liveProjectController(io, socket);
  liveChatController(io, socket);
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
