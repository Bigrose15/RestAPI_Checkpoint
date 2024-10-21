import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionData = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDb: ${connectionData.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

export { connectDB };
