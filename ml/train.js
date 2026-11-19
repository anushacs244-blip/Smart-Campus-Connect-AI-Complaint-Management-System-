/**
 * CampusConnect AI - Smart Campus Assistant
 * Author: SPA
 */

import natural from "natural";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const classifier = new natural.BayesClassifier();

const intentsPath = path.join(__dirname, "intents.json");
const modelPath = path.join(__dirname, "model.json");

const data = JSON.parse(fs.readFileSync(intentsPath, "utf-8"));

data.forEach(item => {
  classifier.addDocument(item.text, item.intent);
});

classifier.train();

classifier.save(modelPath, (err) => {
  if (err) {
    console.error("❌ Failed to save intent model:", err);
  } else {
    console.log("✅ Intent model trained successfully by SPA");
  }
});

