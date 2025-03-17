const mongoose = require('mongoose');

const EleveSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    IdNiveau: {
        type: String,
        required: true,
    },
    Niveau: {
        type: String,
        required: true,
    },

}, );

const EleveModel = mongoose.model('Eleve', EleveSchema);
module.exports = EleveModel;