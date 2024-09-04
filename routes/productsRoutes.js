const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require("../config/auth");

router.get("/", productsController.getProducts);
router.get("/:id", productsController.getProductById);
router.post('/', verifyJWT, productsController.createProduct);
router.put('/:id', verifyJWT, productsController.putProduct);
router.delete('/:id', verifyJWT, productsController.deleteProduct);

module.exports = router;