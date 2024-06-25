import mongoose from 'mongoose';

const Project = new mongoose.Schema({
  name: { type: String, required: true },
  // owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  animation: { type: Object, required: true },
});

export default mongoose.model('Project', Project);
