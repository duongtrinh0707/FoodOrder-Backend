import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Lấy giỏ hàng của người dùng
// @route   GET /api/cart
// @access  Private (Chỉ user đã đăng nhập mới truy cập được)
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");

  if (!cart) {
    return res.json({ cartItems: [], totalPrice: 0 });
  }

  const totalPrice = cart.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  res.json({ cartItems: cart.cartItems, totalPrice });
});

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body; // 👈 Giá trị mặc định = 1

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Sản phẩm không tồn tại");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, cartItems: [] });
  }

  const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity += quantity; // ✅ Cập nhật số lượng
  } else {
    cart.cartItems.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(201).json(cart);
});


// @desc    Cập nhật số lượng sản phẩm trong giỏ hàng
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Bạn cần đăng nhập!");
  }

  const { quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Giỏ hàng không tồn tại");
  }

  const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === req.params.id);

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error("Sản phẩm không có trong giỏ hàng");
  }
});

// @desc    Xóa sản phẩm khỏi giỏ hàng
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Bạn cần đăng nhập!");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Giỏ hàng không tồn tại");
  }

  cart.cartItems = cart.cartItems.filter((item) => item.product.toString() !== req.params.id);

  await cart.save();
  res.json(cart);
});
const clearCart = asyncHandler(async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Đã xóa toàn bộ giỏ hàng!" });
  } catch (error) {
    res.status(500);
    throw new Error("Lỗi khi xóa giỏ hàng");
  }
});
export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
