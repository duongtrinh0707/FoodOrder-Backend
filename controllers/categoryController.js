import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// @desc    Lấy danh sách tất cả danh mục
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const categories = await Category.find({
      name: { $regex: searchQuery, $options: "i" }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách category" });
  }
};
// @desc    Lấy thông tin chi tiết danh mục
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }
});

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error("Danh mục đã tồn tại");
  }

  const category = new Category({ name });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Cập nhật danh mục
// @route   PUT /api/categories/:id
// @access  Private (Admin)
// @desc    Cập nhật category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true } // Trả về dữ liệu sau khi update
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  
  
  
// @desc    Xóa danh mục
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: "Danh mục đã được xóa" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }
});

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
