// imports
const models = require("../models");
const User = models.users;

const fs = require("fs");

// logique métier : lire tous utilisateurs
exports.findAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      console.log(users);
      res.status(200).json({ data: users });
    })
    .catch((error) => res.status(400).json({ error }));
};

// logique métier : lire un utilisateur par son id
exports.findOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => res.status(404).json({ error }));
};

// logique métier : lire un utilisateur par son id
exports.findAllUserByName = (req, res, next) => {
  User.findAll({ where: { firstname: req.params.name } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => res.status(404).json({ error }));
};
