import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @desc    Lấy danh sách tất cả sản phẩm
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query; // Lấy category từ query params

  let query = {}; // Tạo một object query rỗng

  if (category) {
    query.category = category; // Nếu có category, thêm vào query
  }

  const products = await Product.find(query).populate("category", "name"); // Lấy tên category

  res.json(products);
});


// @desc    Lấy thông tin chi tiết sản phẩm
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});



// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  // Kiểm tra xem category có tồn tại không
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(400).json({ message: "Category không tồn tại!" });
  }

  // Tạo sản phẩm mới
  const product = new Product({
    name,
    price,
    description,
    image,
    category,
    countInStock
  });

  const createdProduct = await product.save();

  // Populate category để hiển thị tên thay vì ID
  const productWithCategory = await Product.findById(createdProduct._id).populate("category", "name");

  res.status(201).json(productWithCategory);
});


// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, description, category, countInStock } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.description = description || product.description;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }
});

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Sản phẩm đã được xóa" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
