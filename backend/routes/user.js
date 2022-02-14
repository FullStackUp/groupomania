const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const auth = require("../middleware/auth");

router.get("/", userCtrl.findAllUsers);
router.get("/:id", userCtrl.findOneUser);

module.exports = router;
