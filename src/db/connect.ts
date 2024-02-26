import mongoose from "mongoose";

function connectDB(url: string) {
  return mongoose.connect(url);
}

export default connectDB;
