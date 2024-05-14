import express from "express";
import mongoose from "mongoose";
import { Etudiant } from "./Etudiant.js"; // FIXME
import dotenv from "dotenv";
import axios from "axios";
import { Filiere } from "../filiere-service/Filiere.js";

dotenv.config();

const DB_URI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const FILIERE_HOST = process.env.APP_HOST_FILIERE_SERVICE;
const FILIERE_PORT = process.env.APP_HOST_FILIERE_PORT;
const app = express();
app.use(express.json());

mongoose
   .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log(`Bien connécté a BD etudiants`);
   })
   .catch((error) => {
      console.error("Erreur de connexion à BD etudiants:", error);
   });

export async function insertEtudiant(etudiant) {
   const fid = etudiant.filiere_id;
   const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${fid}`;
   const response = await axios.get(URL);
   const filiere = response.data;
   /**
    * une filiere ne peut avoir que 100 etudiants inscrits
    */
   if (parseInt(filiere.nombre_etudiants) >= 100) {
      // throw new Error("Nombre max d'étudiants est atteint !");
      return { message: "Nombre max d'étudiants est atteint !" };
   }

   const newEtudiant = new Etudiant({
      id: etudiant.id,
      nom: etudiant.nom,
      filiere_id: etudiant.filiere_id,
   });

   try {
      newEtudiant.save();
      const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${fid}`;
      filiere.nombre_etudiants = parseInt(filiere.nombre_etudiants) + 1;
      const response = await axios.put(URL, filiere);
      return newEtudiant;
   } catch (error) {
      throw error;
   }
}

export async function deleteEtudiant(eid) {
   const etudiant = await getEtudiant(eid);
   const fid = etudiant.filiere_id;
   const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${fid}`;
   const response = await axios.get(URL);
   const filiere = response.data;

   try {
      const result = await Etudiant.deleteOne({ id: eid });

      const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${fid}`;
      filiere.nombre_etudiants = parseInt(filiere.nombre_etudiants) - 1;
      const response = await axios.put(URL, filiere);

      if (result.deletedCount == 1) {
         return { message: "etudiant bien supprimee" };
      }
   } catch (error) {
      throw error;
   }
}

export async function getEtudiants() {
   try {
      return await Etudiant.find({});
   } catch (error) {
      throw error;
   }
}

export async function getEtudiant(id) {
   try {
      return await Etudiant.find({ id: id });
   } catch (error) {
      throw error;
   }
}

export async function updateEtudiant(etudiant) {
   delete etudiant.id;
   const fid = etudiant.filiere_id;
   const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${fid}`;
   const response = await axios.get(URL);
   const filiere = response.data;
   /**
    * une filiere ne peut avoir que 100 etudiants inscrits
    */
   if (parseInt(filiere.nombre_etudiants) >= 100) {
      // throw new Error("Nombre max d'étudiants est atteint !");
      return { message: "Nombre max d'étudiants est atteint !" };
   }
   try {
      const result = await Etudiant.updateOne({ id: etudiant.id }, etudiant);
      const URL = `http://${FILIERE_HOST}:${FILIERE_PORT}/filieres/${fid}`;
      filiere.nombre_etudiants = parseInt(filiere.nombre_etudiants) + 1;
      const response = await axios.put(URL, filiere);
      if (result.modifiedCount == 1) {
         return {
            message: "etudiant bien modifié",
         };
      }
   } catch (error) {
      throw error;
   }
}
