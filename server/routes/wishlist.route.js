const express = require("express");
const wishlistController = require("../controllers/wishlist.controller");
const authMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/", authMiddleware, wishlistController.addToWishlist);
router.delete("/", authMiddleware, wishlistController.removeFromWishlist);
router.get("/", authMiddleware, wishlistController.getWishlistByUser);

module.exports = router;
