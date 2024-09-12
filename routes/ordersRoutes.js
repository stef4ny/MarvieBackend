const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const verifyJWT = require("../config/auth");

router.get("/", verifyJWT, ordersController.getOrders);
router.get("/:id", verifyJWT, ordersController.getOrdersById);
router.post("/", ordersController.createOrders)
router.delete("/:id", ordersController.deleteOrders)
router.put("/:id", ordersController.putOrders)

module.exports = router;