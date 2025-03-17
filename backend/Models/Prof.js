const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ProfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    matiereId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matiere', 
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    telephone: {
        type: String,
        required: true,
        match: [/^\d{8}$/, "Telephone number must be exactly 8 digits"],
    },
}, { timestamps: true });

// Middleware to hash the password before saving
ProfSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
ProfSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Prof', ProfSchema);
