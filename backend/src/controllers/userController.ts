import express from 'express';

import userSchema from './../models/user';

const userRouter = express.Router();

userRouter.post('/login', async (req, res) => {
  try {
    const findExistingUser = await userSchema.findOne({ name: req.body.name });

    if (findExistingUser) {
      res.json({
        data: findExistingUser,
      });
    } else {
      const newUser = new userSchema({
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

export default userRouter;
