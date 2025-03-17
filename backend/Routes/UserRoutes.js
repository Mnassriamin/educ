const express = require("express");
const multer = require("multer");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// 📌 Configuration Multer pour l'upload des photos
const storage = multer.memoryStorage(); // Stockage en mémoire
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }).single("photo"); // Max 5MB

// 📌 Route pour créer un utilisateur (POST)
router.post("/api/users", upload, async (req, res) => {
  try {
    const { name, raisonSociale, telephone, email, role, password} = req.body;
    let photo = req.file ? req.file.buffer : null; // Stocke l'image en Buffer

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, raisonSociale, telephone, email, role, password: hashedPassword, photo });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: "Erreur lors de la création de l'utilisateur", details: err });
  }
});

// 📌 Route pour obtenir tous les utilisateurs (GET)
router.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclure le mot de passe
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: "Erreur lors de la récupération des utilisateurs", details: err });
  }
});

// 📌 Route pour obtenir un utilisateur par ID (GET)
router.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send({ error: "Utilisateur non trouvé" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: "Erreur lors de la récupération de l'utilisateur", details: err });
  }
});

// 📌 Route pour mettre à jour un utilisateur (PUT)
router.put("/api/users/:id", upload, async (req, res) => {
  try {
    const { name, raisonSociale, telephone, email, role, password,prixliv,prixret } = req.body;
    let photo = req.file ? req.file.buffer : null;

    let updatedUser = { name, raisonSociale, telephone, email, role,prixliv,prixret };
    if (password) {
      updatedUser.password = await bcrypt.hash(password, 10);
    }
    if (photo) {
      updatedUser.photo = photo;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, { new: true }).select("-password");
    if (!user) {
      return res.status(404).send({ error: "Utilisateur non trouvé" });
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ error: "Erreur lors de la mise à jour de l'utilisateur", details: err });
  }
});

// 📌 Route pour supprimer un utilisateur (DELETE)
router.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send({ error: "Utilisateur non trouvé" });
    }
    res.status(200).send({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).send({ error: "Erreur lors de la suppression de l'utilisateur", details: err });
  }
});
module.exports = router;
