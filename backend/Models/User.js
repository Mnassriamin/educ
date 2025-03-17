const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({

    
    name: {
        type: String,
        required: true,
        trim: true,
    },
    raisonSociale: {
        type: String,
        required: true
    },

    telephone: {
        type: Number,
        required: true
    },
  
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    photo: {
        type: Buffer,
        contentType: String
    },
    
});

// Middleware pour hasher le mot de passe avant de sauvegarder
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


                