import express from 'express';
import mongoose from 'mongoose';

import Chat from '../models/chat';

const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
  try {
    const allChats = await Chat.find({
      members: {
        $in: new mongoose.Types.ObjectId(req.headers.authorization),
      },
    });

    res.json({
      data: allChats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default chatRouter;
