import express from "express";
import dotenv from "dotenv";
import {
   deleteEtudiant,
   getEtudiant,
   getEtudiants,
   insertEtudiant,
   updateEtudiant,
} from "./database.js";
import { authenticateUser } from "./auth.js";
import { sendMessage } from "./notification.js";
import axios from "axios";

dotenv.config();

const FILIERE_HOST = process.env.APP_HOST_FILIERE_SERVICE;
const FILIERE_PORT = process.env.APP_HOST_FILIERE_PORT;

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
   const etudiants = await getEtudiant(req.params.id);
   res.send(etudiants);
});

app.post("/etudiants", async (req, res) => {
   const etudiant = req.body;
   const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${etudiant.filiere_id}`;

   try {
      const result1 = await axios.get(URL);
      const filiere = result1.data;
      /**
       * une filiere ne peut avoir que 100 etudiants inscrits
       */
      console.log(filiere);
      if (filiere.nombre_etudiants == 100) {
         const message = { content: "filiere fermee", etudiant: etudiant };
         await sendMessage(message);
         return res.send({ message: "Nombre max d'étudiants est atteint !" });
      }

      const result = await insertEtudiant(etudiant);
      filiere.nombre_etudiants = parseInt(filiere.nombre_etudiants) + 1;
      await axios.put(URL, filiere);
      const message = { content: "inscription_effectuee", etudiant: result };
      await sendMessage(message);
      return res.status(201).send(result);
   } catch (error) {
      console.error(error);
      return res.send({ error: "Erreur d'ajout d'etudiant" });
   }
});

app.delete("/etudiants/:id", async (req, res) => {
   const eid = req.params.id;
   try {
      const etudiant = await getEtudiant(eid);

      const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${etudiant.filiere_id}`;
      const result1 = await axios.get(URL);
      const filiere = result1.data;

      filiere.nombre_etudiants = parseInt(filiere.nombre_etudiants) - 1;
      const response = await axios.put(URL, filiere);

      const result = await deleteEtudiant(eid);
      res.status(201).send(result);
   } catch (error) {
      console.error("Erreur de suppression de l'étudiant [id = ]", eid);
   }
});

app.put("/etudiants/:id?", async (req, res) => {
   const etudiant = req.body;
   const eid = req.params.id ?? req.body.id;
   const BASE_URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/`;
   let URL = BASE_URL + etudiant.filiere_id;

   try {
      const filiere = await axios.get(URL).data;
      const fidPrecedant = await getEtudiant(eid).filiere_id;

      if (filiere.nombre_etudiants == 100) {
         const message = { content: "filiere fermee", etudiant: etudiant };
         await sendMessage(message);
         return res.send({
            message: "Nombre max d'étudiants est atteint !",
         });
      }

      const result = await updateEtudiant({ ...etudiant, id: eid });

      if (etudiant.filiere_id != fidPrecedant) {
         /**
          * changement de filiere
          * -1 pour la 1ere et +1 pour la 2eme
          */

         // decremonter la precedante filiere
         URL = BASE_URL + fidPrecedant;
         const filierePrecedante = await axios.get(URL).data;
         filierePrecedante.nombre_etudiants =
            parseInt(filierePrecedante.nombre_etudiants) - 1;
         await axios.put(URL, filierePrecedante);

         // incrementer la nouvelle
         URL = BASE_URL + etudiant.filiere_id;
         filiere.nombre_etudiants = parseInt(filiere.nombre_etudiants) + 1;
         await axios.put(URL, filiere);
      }

      const message = { content: "inscription_effectuee", etudiant: result };
      await sendMessage(message);
      return res.status(201).send(result);
   } catch (error) {
      return res.send({ error: "Nombre max d'étudiants est atteint !" });
   }
});
