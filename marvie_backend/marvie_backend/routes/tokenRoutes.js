const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");
const verifyJWT = require("../config/auth");

router.get("/", verifyJWT, tokenController.verifyToken);

module.exports = router;
