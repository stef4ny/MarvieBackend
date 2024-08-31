const express = require("express");
const router = express.Router();
const connectController = require("../controllers/connectController");
const verifyJWT = require("../config/auth");

router.get("/", connectController.connection);

module.exports = router;