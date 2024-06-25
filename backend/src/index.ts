import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import { connectDatabase } from './db';
import authRouter from './controllers/authController';
import projectRouter from './controllers/projectController';
import socketRouter from './controllers/socketController';

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

app.use((req, res, next) => {
  // TEMP AUTH
  if (
    !req.headers?.authorization &&
    !req.originalUrl.includes('/auth') &&
    !req.originalUrl.includes('/check')
  ) {
    res.status(401).send('Unauthzorized');
    return;
  }

  next();
});

app.get('/check', (req: Request, res: Response) => {
  res.send('Health Check!');
});
app.use('/auth', authRouter);
app.use('/projects', projectRouter);
socketRouter(io);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
