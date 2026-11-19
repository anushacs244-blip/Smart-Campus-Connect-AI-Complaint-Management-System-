/**
 * CampusConnect AI - Notice Model
 * Author: SPA
 */

import mongoose from "mongoose";

export default mongoose.model("Notice", new mongoose.Schema({
  title: String,
  details: String,
  issuedBy: String,
  date: String
}));

