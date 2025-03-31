import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js"; // Kiểm tra đường dẫn file User model

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Lấy token sau "Bearer"

      console.log("🔹 Token nhận được:", token); // ✅ Kiểm tra token trong console

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Không tìm thấy người dùng" });
      }

      next();
    } catch (error) {
      console.error("❌ Lỗi xác thực token:", error.message);
      res.status(401).json({ message: "Token không hợp lệ, vui lòng đăng nhập lại" });
    }
  } else {
    res.status(401).json({ message: "Không có quyền truy cập, token không được cung cấp" });
  }
});

export { protect };
