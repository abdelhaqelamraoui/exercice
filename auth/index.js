import express from "express";
import bcrypt from "bcrypt";
import { User } from "./User.js";
import dotenv from "dotenv";
import { getUser, getUsers, insertUser } from "./database.js";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
   console.log(
      `Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`
   );
});

app.post("/register", async (req, res) => {
   let { name, email, password } = req.body;
   const user = await getUser(req.body.email);

   if (user) {
      return res.status(500).json({ message: "User already exists" });
   }

   bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
         return res.status(500).json({ error: err });
      }

      password = hash;
      const newUser = new User({ name, email, password });
      try {
         const result = insertUser(newUser);
         res.status(201).json({ message: "user registered successfully" });
         console.log("User has been registered: ", new Date().toISOString());
      } catch (error) {
         return res.status(500).json({ error: error });
      }
   });
});

app.post("/login", async (req, res) => {
   const { email, password } = req.body;
   const user = await getUser(email);

   if (!user) {
      return res.status(500).json({ error: "user doesn't exist" });
   }

   bcrypt.compare(password, user.password).then((result) => {
      if (!result) {
         return res.status(500).json({ error: "password incorrect" });
      }

      const payload = { name: user.name, email: user.email };

      jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
         if (err) {
            return res.status(500).json({ error: err });
         }
         console.log("User has been logged in: ", new Date().toISOString());
         return res.status(201).json({ token: token });
      });
   });
});

app.get("/users", async (req, res) => {
   const users = await getUsers();
   res.send(users);
});
