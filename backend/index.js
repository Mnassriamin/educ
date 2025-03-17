require('dotenv').config();
const express = require('express');
const connectToDatabase = require('../backend/Models/db');
const authRouter = require('./Routes/AuthRouter');
const groupeRoutes = require('./Routes/GroupeRoutes');
const luserRoutess = require('./Routes/LuserRoutes');
const eleveRoutes = require('./Routes/EleveRoutes');
const matiereRoutes = require('./Routes/MatiereRoutes');
const niveauRoutes = require('./Routes/NiveauRoutes');
const userRoutes = require('./Routes/UserRoutes');
const planningRoutes = require('./Routes/planningRoutes');
const coursRoutes = require ('./Routes/CoursRoutes');
const adminRouter = require('./Routes/AdminRouter')

const cors = require('cors');

const app = express();
// Autoriser toutes les origines
app.use(cors());

// Middleware
app.use(express.json());
app.use(cors());
// Connexion à MongoDB
connectToDatabase();

// Routes
app.use('/api/auth', authRouter);
app.use('/groupe/', groupeRoutes);
//app.use('/luserr/', luserRoutess);
app.use('/eleve/', eleveRoutes);
app.use('/matiere/', matiereRoutes);
app.use('/niveau/', niveauRoutes);
app.use('/users/', userRoutes);
app.use('/api/planning', planningRoutes);
app.use('/', coursRoutes);
app.use('/admin', adminRouter);


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
