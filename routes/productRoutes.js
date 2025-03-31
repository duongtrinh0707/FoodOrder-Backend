import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Lấy danh sách tất cả sản phẩm
router.get("/", getProducts);

// Lấy thông tin chi tiết của một sản phẩm
router.get("/:id", getProductById);

// Thêm sản phẩm mới
router.post("/", createProduct);

// Cập nhật sản phẩm
router.put("/:id", updateProduct);

// Xóa sản phẩm
router.delete("/:id", deleteProduct);


export default router;
