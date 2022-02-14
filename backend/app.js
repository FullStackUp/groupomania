//Création d'une application express :
const express = require("express");
const app = express();

//Configuration d'un réponse :
app.use((req, res) => {
  res.json({ message: "Votre requête a bien été reçue ! " });
  next();
});

// Connexion de la DataBase à l'application
const db = require("./models");
db.sequelize.sync();

//Exportation de cette application pour y avoir accès dans d'autres fichier :
module.exports = app;
