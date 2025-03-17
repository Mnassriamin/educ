const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    matiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matiere',
        required: true,
    },
    enseignant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prof', // Changed from User to Prof
        required: true,
    },
    datedebut: {
        type: Date,
        required: true,
    },
    color: { 
        type: String, default: "#b64fc8" 
    },

    datefin: {
        type: Date,
        required: true,
    },
    etudiants: [
        {
            enfantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent.enfants' }, // Reference enfants directly
            enfantName: { type: String }, // Store child's name directly for convenience
        },
    ],
}, { timestamps: true });

const Cours = mongoose.model('Cours', CoursSchema);
module.exports = Cours;
