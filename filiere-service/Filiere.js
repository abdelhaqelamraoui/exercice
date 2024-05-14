import mongoose from "mongoose";

const FiliereSchema = mongoose.Schema({
   id: Number,
   nom: String,
   nombre_etudiants: {
      type: Number,
      default: 0,
   },
});

export const Filiere = mongoose.model("filieres", FiliereSchema);
