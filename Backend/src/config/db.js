import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if(!uri) throw new Error('MONGO_URI not set in env');
  await mongoose.connect(uri);
  console.log('MongoDB connected, From db.js File - This is not Vibe, I Was Here ');
};

export default connectDB;
