/**
 * CampusConnect AI - Cache Model
 * Author: SPA
 */

import mongoose from "mongoose";

export default mongoose.model("Cache", new mongoose.Schema({
  question: {
    type: String,
    unique: true
  },
  answer: String
}));

