const mongoose = require('mongoose');

const NiveauSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
}, );

const NiveauModel = mongoose.model('Niveau', NiveauSchema);
module.exports = NiveauModel;