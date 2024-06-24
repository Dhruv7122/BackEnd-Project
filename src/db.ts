import mongoose from "mongoose";

const connectUserDB = async () => {
  try {
    // Connect Database
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectUserDB;
