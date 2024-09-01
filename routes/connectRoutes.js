const express = require("express");
const router = express.Router();
const connectController = require("../controllers/connectController");

router.get("/", connectController.connection);

module.exports = router;