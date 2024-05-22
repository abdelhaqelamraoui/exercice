import express from "express";
import mongoose from "mongoose";
import { Etudiant } from "./Etudiant.js";
import dotenv from "dotenv";

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
      console.log(`Bien connécté a BD etudiants`);
   })
   .catch((error) => {
      console.error("Erreur de connexion à BD etudiants:", error);
   });

export async function insertEtudiant(etudiant) {
   const newEtudiant = new Etudiant({
      id: etudiant.id,
      nom: etudiant.nom,
      email: etudiant.email,
      filiere_id: etudiant.filiere_id,
   });

   try {
      newEtudiant.save();
      return newEtudiant;
   } catch (error) {
      throw error;
   }
}

export async function deleteEtudiant(eid) {
   try {
      const result = await Etudiant.deleteOne({ id: eid });
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
      const result = await Etudiant.find({ id: id });
      return result[0];
   } catch (error) {
      throw error;
   }
}

export async function updateEtudiant(etudiant) {
   try {
      const result = await Etudiant.updateOne({ id: etudiant.id }, etudiant);
      if (result.modifiedCount == 1) {
         return result;
      } else {
         throw Error("Erreur lors de la mise è jour");
      }
   } catch (error) {
      throw error;
   }
}
