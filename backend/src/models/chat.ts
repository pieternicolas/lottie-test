import mongoose from 'mongoose';

const Chat = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [
      {
        type: {
          message: String,
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          time: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Chat', Chat);
