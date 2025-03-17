// Models/Planning.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanningSchema = new Schema({
  name: { type: String, required: true },
  matiere: { type: Schema.Types.ObjectId, ref: 'Matiere', required: true },
  enseignant: { type: Schema.Types.ObjectId, ref: 'Prof', required: true },
  datedebut: { type: Date, required: true },
  datefin: { type: Date, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  color: { type: String, default: "#b64fc8" },
  recurrenceRule: { type: String }, // optional recurrence rule string
}, { timestamps: true });

module.exports = mongoose.models.Planning || mongoose.model('Planning', PlanningSchema);
