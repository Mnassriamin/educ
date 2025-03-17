const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
}, );

const MatiereModel = mongoose.model('Matiere', MatiereSchema);
module.exports = MatiereModel;