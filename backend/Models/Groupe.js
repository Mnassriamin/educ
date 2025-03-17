const mongoose = require('mongoose');

const GroupeSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
   

}, );

const GroupeModel = mongoose.model('Groupe', GroupeSchema);
module.exports = GroupeModel;