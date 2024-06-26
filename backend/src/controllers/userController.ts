import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user';

const userRouter = express.Router();

userRouter.get('/all', async (req, res) => {
  try {
    const users = await User.find({
      _id: {
        $ne: new mongoose.Types.ObjectId(req.headers.authorization),
      },
    });

    res.json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default userRouter;
