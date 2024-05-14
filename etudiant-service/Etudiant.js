import mongoose from "mongoose";

const EtudiantSchema = mongoose.Schema({
   id: Number,
   nom: String,
   filiere_id: Number,
});
export const Etudiant = mongoose.model("etudiants", EtudiantSchema);
