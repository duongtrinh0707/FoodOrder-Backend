import express from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addToCart);
router.route("/:id").put(protect, updateCartItem).delete(protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
