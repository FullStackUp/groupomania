// Imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./config/.env" });

const db = require("../models/index");

const { roles } = require("../middleware/roles");

// Permet de gerer les autorisation des utilisateurs
exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "Vous n'avez pas l'autorisation d'exécuter cet action !",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Regex de validation
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,20}/;

// Permet de créer un nouvel utilisateur
exports.signup = (req, res, next) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  // Permet de vérifier que tous les champs sont complétés
  if (
    email == null ||
    email == "" ||
    username == null ||
    username == "" ||
    password == null ||
    password == ""
  ) {
    return res
      .status(400)
      .json({ error: "Tous les champs doivent être renseignés" });
  }

  // Permet de contrôler la longueur du pseudo
  if (username.length <= 3 || username.length >= 15) {
    return res
      .status(400)
      .json({ error: "Le pseudo doit contenir 3 à 15 caractères" });
  }

  // Permet de contrôler la validité de l'adresse mail
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse mail invalide" });
  }

  // Permet de contrôler la validité du mot de passe
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Le mot de passe doit contenir entre 8 et 20 caractères dont au moins une lettre majuscule, une lettre minusucle, un chiffre et un symbole",
    });
  }

  // Permet de vérifier que l'utilisateur que l'on souhaite créer n'existe pas déjà
  db.User.findOne({
    attributes: ["username" || "email"],
    where: {
      username: username,
      email: email,
    },
  })
    .then((userExist) => {
      if (!userExist) {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            const user = db.User.build({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              isAdmin: 0,
            });
            user
              .save()
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Votre compte a bien été créé !" })
              )
              .catch((error) =>
                res
                  .status(400)
                  .json({ error: "⚠ Oops, une erreur s'est produite !" })
              );
          })
          .catch((error) =>
            res.status(500).json({
              error:
                "Une erreur s'est produite lors de la création de votre compte",
            })
          );
      } else {
        return res.status(404).json({ error: "Cet utilisateur existe déjà" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};

// Permet à un utilisateur de se connecter
exports.login = (req, res, next) => {
  db.User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect" });
            }
            res.status(200).json({
              userId: user.id,
              isAdmin: user.isAdmin,
              username: user.username,
              imageProfile: user.imageProfile,
              token: jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) =>
            res
              .status(500)
              .json({ error: "⚠ Oops, une erreur s'est produite !" })
          );
      } else {
        return res.status(404).json({
          error: "Cet utilisateur n'existe pas, veuillez créer un compte",
        });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};

// Permet à un utilisateur d'accéder à son profil
exports.getUserProfile = (req, res, next) => {
  const id = req.params.id;
  db.User.findOne({
    attributes: ["id", "username", "email", "isAdmin", "imageProfile"],
    where: { id: id },
  })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) =>
      res.status(404).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};

// Permet à un utilisateur de modifier son profil
exports.modifyUserProfile = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  const userId = decodedToken.userId;

  req.body.user = userId;

  console.log("bodyUser", req.body.user);
  const userObject = req.file
    ? {
        ...JSON.parse(req.body.user),
        imageProfile: `/images/${req.file.filename}`,
      }
    : { ...req.body };

  db.User.findOne({
    where: { id: userId },
  })
    .then((userFound) => {
      if (userFound) {
        db.User.update(userObject, {
          where: { id: userId },
        })
          .then((user) =>
            res
              .status(200)
              .json({ message: "Votre profil a bien été modifié !" })
          )
          .catch((error) =>
            res
              .status(400)
              .json({ error: "⚠ Oops, une erreur s'est produite !" })
          );
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};

// Permet à un utilisateur de supprimer son compte
exports.deleteAccount = (req, res, next) => {
  const id = req.params.id;
  db.User.findOne({
    attributes: ["id"],
    where: { id: id },
  })
    .then((user) => {
      if (user) {
        db.User.destroy({
          where: { id: id },
        })
          .then(() =>
            res.status(200).json({ message: "Votre compte a été supprimé" })
          )
          .catch(() =>
            res
              .status(500)
              .json({ error: "⚠ Oops, une erreur s'est produite !" })
          );
      } else {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};
