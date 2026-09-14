import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ganesh_chaturthi';
    const conn = await mongoose.connect(uri);
    console.log(`🛕 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.warn('⚠️  Continuing without DB — REST data will fallback to demo.');
  }
};

export default connectDB;
