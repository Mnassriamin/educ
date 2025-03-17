const mongoose = require('mongoose');

const LuserSchema = new mongoose.Schema({
    
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
   
    Prix: {
        type: Number,
        
    },
   

}, );

const LuserModel = mongoose.model('Luser', LuserSchema);
module.exports = LuserModel;