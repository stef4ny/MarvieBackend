const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");

router.get("/product/:productId", reviewsController.getReviewsByProductId);
router.get("/:id", reviewsController.getReviewById);
router.post('/:id', reviewsController.createReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;