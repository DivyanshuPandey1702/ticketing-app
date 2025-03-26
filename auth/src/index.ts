import { app } from "./app";
import mongoose from "mongoose";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not Defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodbd");
  } catch (err) {
    console.log("err:", err);
  }
};

app.listen(3000, () => {
  console.log("listening on port 3000!!!!!!");
});
start();
