import express from "express";
import dotenv from "dotenv";
import {
   deleteEtudiant,
   getEtudiants,
   insertEtudiant,
   updateEtudiant,
} from "./database.js";
import { authenticateUser } from "./auth.js";
import { sendMessage } from "./notification.js";

dotenv.config();
const app = express();
app.use(express.json());
// app.use(authenticateUser); // using the auth middleware for app requests // TODO : bring it back

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
   if (result.message) {
      /**
       * the case of returning a message indication that the major
       * hass reached 100 studants
       */
      const message = { content: "filiere fermee", etudiant: req.body };
      await sendMessage(message);
   } else if (result) {
      const message = { content: "inscription_effectuee", etudiant: result };
      // TODO : incule the conditional message here for dending mail
      await sendMessage(message);
   }
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
