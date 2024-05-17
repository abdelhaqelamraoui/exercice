import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./User.js";

dotenv.config();

const DB_URI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const app = express();
app.use(express.json());

mongoose
   .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log(`Bien connécté a BD auth`);
   })
   .catch((error) => {
      console.error("Erreur de connexion à BD auth:", error);
   });

export async function insertUser(user) {
   const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
   });

   try {
      newUser.save();
      return newUser;
   } catch (error) {
      return { error: error };
   }
}

export async function getUser(email) {
   try {
      return await User.findOne({ email: email });
   } catch (error) {
      throw error;
   }
}

export async function getUsers() {
   try {
      return await User.find({});
   } catch (error) {
      throw error;
   }
}
