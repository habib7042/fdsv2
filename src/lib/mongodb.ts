import mongoose from 'mongoose';

let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) {
    console.log('MongoDB ইতিমধ্যে কানেক্টেড');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('MongoDB সফলভাবে কানেক্টেড হয়েছে');
  } catch (error) {
    console.error('MongoDB কানেকশন ব্যর্থ:', error);
    throw error;
  }
}

export async function disconnectFromMongoDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB ডিসকানেক্টেড');
  }
}

export { mongoose };