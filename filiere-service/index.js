import express from "express";
import axios from "axios";
import dotenv from "dotenv";

import {
   deleteFiliere,
   getFiliere,
   getFilieres,
   insertFiliere,
   updateFiliere,
} from "./database.js";
import { authenticateUser } from "./auth.js";

dotenv.config();
const app = express();
app.use(express.json());
// app.use(authenticateUser); // using the auth middleware for app requests

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
   console.log(
      `Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`
   );
});

app.get("/filieres", async (req, res) => {
   const filieres = await getFilieres();
   res.send(filieres);
});

app.get("/filieres/:id", async (req, res) => {
   const filieres = await getFiliere(req.params.id);
   // const ne = await getFiliereNombreEtudiants(req.params.id);
   // console.log(be);
   res.send(filieres[0]);
});

app.post("/filieres", async (req, res) => {
   const result = await insertFiliere(req.body);
   res.status(201).send(result);
});

app.delete("/filieres/:id", async (req, res) => {
   const result = await deleteFiliere(req.params.id);
   res.status(201).send(result);
});

app.put("/filieres/:id?", async (req, res) => {
   /**
    * the id here is optional because we've ovverriden it in the object
    * passed to the function bellow.
    * Using the nullish operator, if the id is not provided in the path
    * the one set in the object will be used.
    */
   const result = await updateFiliere({
      ...req.body,
      id: req.params.id ?? req.body.id,
   });
   res.status(201).send(result);
});

// FIXME : not working for now
app.post("/filieres/register", async (req, res) => {
   const URL = `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}/register`;
   // const response = await axios.post(URL, req.body);
   console.log(URL);
   await axios
      .post(URL, req.body)
      .then((response) => {
         res.send(response);
      })
      .catch((error) => {
         res.send(error);
      });
});

// FIXME : not working for now
app.post("/filieres/login", async (req, res) => {
   const URL = `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}/login`;
   const response = await axios.post(URL, req.body);
   res.send(response);
});
