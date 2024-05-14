import express from "express";
import dotenv from "dotenv";
import {
   deleteEtudiant,
   getEtudiants,
   insertEtudiant,
   updateEtudiant,
} from "./database.js";

dotenv.config();
const app = express();
app.use(express.json());

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
   console.log(
      `Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`
   );
});

app.get("/etudiants", async (req, res) => {
   const etudiants = await getEtudiants();
   res.send(etudiants);
});

app.get("/etudiants/:id", async (req, res) => {
   const etudiants = await getEtudiants(req.params.id);
   res.send(etudiants[0]);
});

app.post("/etudiants", async (req, res) => {
   const result = await insertEtudiant(req.body);
   res.status(201).send(result);
});

app.delete("/etudiants/:id", async (req, res) => {
   const result = await deleteEtudiant(req.params.id);
   res.status(201).send(result);
});

app.put("/etudiants/:id?", async (req, res) => {
   const result = await updateEtudiant({
      ...req.body,
      id: req.params.id ?? req.body.id,
   });
   res.status(201).send(result);
});
