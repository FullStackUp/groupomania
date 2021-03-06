// Imports
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const fs = require("fs");

// Permet de créer un nouveau message
exports.createPost = (req, res, next) => {
  const content = req.body.content;

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Permet de vérifier que tous les champs sont complétés
  if (content == null || content == "") {
    return res
      .status(400)
      .json({ error: "Tous les champs doivent être renseignés" });
  }

  // Permet de contrôler la longueur du titre et du contenu du message
  if (content.length <= 1) {
    return res.status(400).json({
      error: "Le contenu du message doit contenir au moins 2 caractères",
    });
  }

  db.User.findOne({
    where: { id: userId },
  })

    .then((userFound) => {
      if (userFound) {
        const post = db.Post.build({
          content: req.body.content,
          imagePost: req.file
            ? `/images/${req.file.filename}`
            : req.body.imagePost,
          UserId: userFound.id,
        });
        post
          .save()
          .then(() =>
            res.status(201).json({ message: "Votre message a bien été créé !" })
          )
          .catch((error) =>
            res
              .status(400)
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

// Permet d'afficher tous les messages
exports.getAllPosts = (req, res, next) => {
  db.Post.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.User,
        attributes: ["username", "imageProfile"],
      },
      {
        model: db.Comment,
      },
    ],
  })
    .then((postFound) => {
      if (postFound) {
        res.status(200).json(postFound);
      } else {
        res.status(404).json({ error: "Aucun message trouvé" });
      }
    })
    .catch((error) => {
      res.status(500).send({ error: "⚠ Oops, une erreur s'est produite !" });
    });
};

// Permet de modifier un message
exports.modifyPost = (req, res, next) => {
  console.log("file", req.file);
  console.log("content", req.body.content);
  console.log("bodypost", req.body.post);
  const postObject = req.file
    ? {
        content: req.body.content,
        imagePost: `/images/${req.file.filename}`,
      }
    : { ...req.body };

  console.log("body", req.body);
  console.log(req.params.postId);

  db.Post.findOne({
    where: { id: req.params.postId },
  })
    .then((postFound) => {
      if (postFound) {
        db.Post.update(postObject, {
          where: { id: req.params.postId },
        })
          .then((post) =>
            res
              .status(200)
              .json({ message: "Votre message a bien été modifié !" })
          )
          .catch((error) =>
            res
              .status(400)
              .json({ error: "⚠ Oops, une erreur s'est produite !" })
          );
      } else {
        res.status(404).json({ error: "Message non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};

// Permet de supprimer un message
exports.deletePost = (req, res, next) => {
  db.Post.findOne({
    attributes: ["id"],
    where: { id: req.params.postId },
  })
    .then((post) => {
      if (post) {
        if (post.imagePost != null) {
          const filename = post.imagePost.split("/images/")[1];

          fs.unlink(`/images/${filename}`, () => {
            db.Post.destroy({
              where: { id: req.params.postId },
            })
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Votre message a été supprimé" })
              )
              .catch(() =>
                res
                  .status(500)
                  .json({ error: "⚠ Oops, une erreur s'est produite !" })
              );
          });
        } else {
          db.Post.destroy({
            where: { id: req.params.postId },
          })
            .then(() =>
              res.status(200).json({ message: "Votre message a été supprimé" })
            )
            .catch(() =>
              res
                .status(500)
                .json({ error: "⚠ Oops, une erreur s'est produite !" })
            );
        }
      } else {
        return res.status(404).json({ error: "Message non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" })
    );
};
