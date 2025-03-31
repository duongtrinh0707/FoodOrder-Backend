import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Kết nối MongoDB
import userRoutes from "./routes/userRoutes.js"; // Import đúng đường dẫn file
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";



dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Cho phép server đọc dữ liệu JSON
app.use(cors());

// Routes
app.use("/api/users", userRoutes); // Sử dụng routes đúng cách
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại port ${PORT}`));
