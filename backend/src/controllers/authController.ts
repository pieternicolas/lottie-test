import express from 'express';

import User from '../models/user';

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const findExistingUser = await User.findOne({ name: req.body.name });

    if (findExistingUser) {
      res.json({
        data: findExistingUser,
      });
    } else {
      const newUser = new User({
        name: req.body.name,
      });
      await newUser.save();

      res.json({
        data: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default authRouter;
