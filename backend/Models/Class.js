const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  eleves: [{
    type: Schema.Types.ObjectId,
    ref: 'Eleve'
  }]
}, { timestamps: true });

module.exports = mongoose.models.Class || mongoose.model('Class', ClassSchema);
