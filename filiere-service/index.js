import express from "express";
import dotenv from "dotenv";

import {
   deleteFiliere,
   getFiliere,
   getFilieres,
   insertFiliere,
   updateFiliere,
} from "./database.js";

dotenv.config();
const app = express();
app.use(express.json());

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
