import express from "express";
import mongoose from "mongoose";
// import axios from "axios";
// import url from "url";
import { Filiere } from "./Filiere.js"; // FIXME
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
      console.log(`Bien connécté a BD filieres`);
   })
   .catch((error) => {
      console.error("Erreur de connexion à BD filieres:", error);
   });

export async function insertFiliere(filiere) {
   const newFiliere = new Filiere({
      id: filiere.id,
      nom: filiere.nom,
   });
   try {
      newFiliere.save();
      return newFiliere;
   } catch (error) {
      throw error;
   }
}

export async function deleteFiliere(id) {
   try {
      const result = await Filiere.deleteOne({ id: id });
      if (result.deletedCount == 1) {
         return { message: "filiere bien supprimee" };
      }
   } catch (error) {
      throw error;
   }
}

export async function getFilieres() {
   try {
      return await Filiere.find({});
   } catch (error) {
      throw error;
   }
}

export async function getFiliere(id) {
   try {
      return await Filiere.find({ id: id });
   } catch (error) {
      throw error;
   }
}

export async function updateFiliere(filiere) {
   const fid = filiere.id;
   delete filiere.id; // removing the id key-value from this object
   try {
      const result = await Filiere.updateOne({ id: fid }, filiere);
      if (result.modifiedCount == 1) {
         return {
            message: "filiere bien modifiée",
         };
      }
   } catch (error) {
      throw error;
   }
}

// export async function getFiliereNombreEtudiants(id) {
//    try {
//       const filiere = await Filiere.find({ id: id });
//       return filiere.nombre_etudiants;
//    } catch (error) {
//       throw error;
//    }
// }
