const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.get("/", productsController.getProducts);

router.post('/product-images/add', productsController.addProductImage);
router.post('/product-images/remove', productsController.removeProductImage);

router.post('/favorites/add', productsController.addFavorite);
router.post('/favorites/remove', productsController.removeFavorite);

router.post('/reviews/add', productsController.addReview);
router.get('/reviews/:product_id', productsController.getProductReviews);

module.exports = router;
