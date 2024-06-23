import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { connectDatabase } from './db';
import userRouter from './controllers/userController';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // TEMP AUTH
  if (!req.headers?.authorization) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Health Check!');
});

app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
