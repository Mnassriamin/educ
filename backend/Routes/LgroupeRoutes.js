const AccesSociete = require('../Models/Lgroupe'); // Assurez-vous d'importer correctement votre modèle
const groupe = require('../Models/Groupe');
const user = require('../Models/Eleve');

// Créer un nouvel accès société (pour plusieurs sociétés)
exports.createAccesSociete = async (req, res) => {
    const { id_user, id_societes,prix } = req.body;  // id_societes devient un tableau
    const userr=await user.findById(id_user);
    const groupee=await groupe.findById(id_societes);
    try {
        // Vérifier que id_societes est un tableau non vide
        if (!Array.isArray(id_societes) || id_societes.length === 0) {
            return res.status(400).json({ message: 'Le champ id_societes doit être un tableau non vide.' });
        }

        // Créer un nouvel accès société
        const newAccesSociete = new AccesSociete({
            iduser:id_user,
            user:userr.name,
            idgroupe:id_societes,  // Stocke plusieurs sociétés
            groupe:groupee.name,
            prix:prix,
        
        });

        const savedAccesSociete = await newAccesSociete.save();
        res.status(201).json(savedAccesSociete); // Renvoie l'objet créé
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'accès société.' });
    }
};

// Récupérer tous les accès sociétés
exports.getAllAccesSociete = async (req, res) => {
    try {
        // Récupérer tous les accès sociétés et peupler les données
        const accesSocietes = await AccesSociete.find().populate('id_user').populate('id_societes');
        res.status(200).json(accesSocietes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des accès sociétés.' });
    }
};

// Récupérer un accès société par ID
exports.getAccesSocieteById = async (req, res) => {
    const { id } = req.params;

    try {
        // Récupérer l'accès société et peupler les sociétés
        const accesSociete = await AccesSociete.findById(id).populate('id_user').populate('id_societes');
        
        if (!accesSociete) {
            return res.status(404).json({ message: 'Accès société non trouvé.' });
        }
        
        res.status(200).json(accesSociete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'accès société.' });
    }
};

// Mettre à jour un accès société (ajouter ou retirer des sociétés)
exports.updateAccesSociete = async (req, res) => {
    const { id } = req.params;
    const { id_user, id_societes } = req.body;  // id_societes devient un tableau

    try {
        // Vérifier que id_societes est un tableau non vide
        if (!Array.isArray(id_societes) || id_societes.length === 0) {
            return res.status(400).json({ message: 'Le champ id_societes doit être un tableau non vide.' });
        }

        // Mettre à jour l'accès société
        const updatedAccesSociete = await AccesSociete.findByIdAndUpdate(id, { id_user, id_societes }, { new: true });

        if (!updatedAccesSociete) {
            return res.status(404).json({ message: 'Accès société non trouvé.' });
        }

        res.status(200).json(updatedAccesSociete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'accès société.' });
    }
};

// Supprimer un accès société
exports.deleteAccesSociete = async (req, res) => {
    const { id } = req.params;

    try {
        // Supprimer l'accès société
        const deletedAccesSociete = await AccesSociete.findByIdAndDelete(id);

        if (!deletedAccesSociete) {
            return res.status(404).json({ message: 'Accès société non trouvé.' });
        }

        res.status(200).json({ message: 'Accès société supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'accès société.' });
    }
};
