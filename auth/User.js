import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const UserScema = mongoose.Schema(
   {
      name: String,
      email: String,
      password: String,
      created_at: {
         type: Date,
         default: Date.now(),
      },
   },
   { collection: "users" }
);

export const User = mongoose.model(process.env.USER_COLLECTION_NAME, UserScema);
