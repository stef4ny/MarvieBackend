const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const verifyJWT = require("../config/auth");

router.get("/", verifyJWT, ordersController.getOrders);
router.get("/:id", verifyJWT, ordersController.getOrdersById);

module.exports = router;