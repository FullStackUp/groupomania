// Permet d'importer express
const express = require("express");

// Crée un routeur
const router = express.Router();

// Permet d'importer le controller utilisateurs
const userCtrl = require("../controllers/user");

// Permet d'importer le middleware auth
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Routes de l'API pour les utilisateurs
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.getUserProfile);
router.put(
  "/:id",
  auth,
  multer,
  userCtrl.modifyUserProfile,
  userCtrl.grantAccess("updateAny")
);
router.delete(
  "/:id",
  auth,
  userCtrl.deleteAccount,
  userCtrl.grantAccess("deleteAny")
);

// Permet d'exporter le router
module.exports = router;
