import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDatabase } from './db';
import authRouter from './controllers/authController';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();
connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/check', (req: Request, res: Response) => {
  res.send('Health Check!');
});
app.use('/auth', authRouter);

app.use((req, res, next) => {
  // TEMP AUTH
  if (!req.headers?.authorization) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
