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
import { sendMessage } from "./notification.js";

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
   const filiere = await getFiliere(req.params.id);
   // const ne = await getFiliereNombreEtudiants(req.params.id);
   // console.log(be);
   res.send(filiere);
});

app.post("/filieres", async (req, res) => {
   const result = await insertFiliere(req.body);
   res.status(201).send(result);
});

app.delete("/filieres/:id", async (req, res) => {
   const fid = req.params.id;
   const result = await deleteFiliere(fid);
   res.status(201).send(result);
});

app.put("/filieres/:id?", async (req, res) => {
   /**
    * the id here is optional because we've ovverriden it in the object
    * passed to the function bellow.
    * Using the nullish operator, if the id is not provided in the path
    * the one set in the object will be used.
    */
   const fid = req.params.id ?? req.body.id;
   let filiere = await getFiliere(fid);
   const nombre_etudiants = filiere.nombre_etudiants;
   const result = await updateFiliere({
      ...req.body,
      id: fid,
   });

   filiere = await getFiliere(fid);
   if (filiere.nombre_etudiants == 100) {
      const message = {
         content: "max filiere atteint",
         filiere: filiere,
      };
      sendMessage(message);
   } else if (
      nombre_etudiants == 100 &&
      filiere.nombre_etudiants == nombre_etudiants - 1
   ) {
      const message = {
         content: "filiere ouverte",
         filiere: filiere,
      };
      sendMessage(message);
   }

   res.status(201).send(result);
});

// FIXME : not working for now
app.post("/filieres/register", async (req, res) => {
   const URL = `http://${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}/register`;
   // const response = await axios.post(URL, req.body);
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
