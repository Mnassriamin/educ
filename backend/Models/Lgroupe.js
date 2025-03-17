const mongoose = require('mongoose');

const LgroupeSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    idgroupe: {
        type: String,
        required: true,
    },
    groupe: {
        type: String,
        required: true,
    },
    ideleve: {
        type: String,
        required: true,
    },
    eleve: {
        type: String,
        required: true,
    },
    Prix: {
        type: Number,
        
    },
   

}, );

const LgroupeModel = mongoose.model('Lgroupe', LgroupeSchema);
module.exports = LgroupeModel;