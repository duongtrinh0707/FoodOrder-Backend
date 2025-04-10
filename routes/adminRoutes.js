
import express from "express";
import { loginAdmin, getAllOrders, getAllUsers, deleteUser, updateUser,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
 } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/orders", protect, isAdmin, getAllOrders);
router.get("/users", protect, isAdmin, getAllUsers); // GET /api/users



router.delete("/users/:id", protect, isAdmin, deleteUser);
router.put("/users/:id", protect, isAdmin, updateUser);

// Quản lý sản phẩm
router.get("/products", protect, isAdmin, getAllProducts);
router.post("/products", protect, isAdmin, createProduct);
router.put("/products/:id", protect, isAdmin, updateProduct);
router.delete("/products/:id", protect, isAdmin, deleteProduct);
export default router;
