import Order from "../models/Order.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


// Login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.isAdmin && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Sai thông tin đăng nhập hoặc không phải admin" });
  }
};

// Lấy tất cả đơn hàng
 const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
  }
};
// Lấy tất cả user
 const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}); // Có thể giới hạn trường dữ liệu nếu cần
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
    }
  };
// Xóa user
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "Xóa user thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy user" });
    }
  }
// Cập nhật user
const updateUser = async (req, res) => {
    const { name, email, isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.isAdmin = isAdmin ?? user.isAdmin;
  
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Không tìm thấy user" });
    }
  };
// ➤ GET all products
 const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
    }
  };
  
  // ➤ CREATE product
 const createProduct = async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const saved = await newProduct.save();
      res.status(201).json(saved);
    } catch (error) {
      res.status(400).json({ message: "Lỗi khi thêm sản phẩm" });
    }
  };
  
  // ➤ UPDATE product
 const updateProduct = async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Lỗi khi cập nhật sản phẩm" });
    }
  };
  
  // ➤ DELETE product
 const deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Đã xóa sản phẩm" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
    }
  };
export  { loginAdmin, getAllOrders, getAllUsers,  deleteUser, updateUser,getAllProducts, createProduct, updateProduct, deleteProduct };

