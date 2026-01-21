import moogose from 'mongoose';


export const connectDB = async () => {
  try {
    await moogose.connect(process.env.MONGOOSE_DB);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  } 
};