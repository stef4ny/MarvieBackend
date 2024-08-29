const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../config/auth");

router.post("/", verifyJWT, usersController.createUser);
router.get("/", verifyJWT, usersController.getUsers);
router.get("/:id", verifyJWT, usersController.getUserById);
router.post("/login", usersController.login);

module.exports = router;
