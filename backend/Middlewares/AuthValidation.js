const Joi = require('joi');

// Validation pour l'enregistrement
const registerValidation = (data) => {
    // Check the user type by detecting if matiereId exists
    if (data.matiereId) {
        // Prof registration validation
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            telephone: Joi.string().pattern(/^\d{8}$/).required(),
            matiereId: Joi.number().required(),  // Prof specific
            etudiants: Joi.array().items(
                Joi.object({
                    enfantId: Joi.string().required(),
                    enfantName: Joi.string().required(),
                })
            ).optional(), // Prof may or may not have children
        });
        return schema.validate(data);
    } else {
        // Parent registration validation
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            telephone: Joi.string().pattern(/^\d{8}$/).required(),
            matiereId: Joi.forbidden(),  // Prevents matiereId for Parent
            enfants: Joi.array().items(
                Joi.object({
                    enfantId: Joi.string().required(),
                    enfantName: Joi.string().required(),
                })
            ).optional(), // Parent must have children
        });
        return schema.validate(data);
    }
};

// Validation pour la connexion
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
