import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// @desc   Tạo đơn hàng mới
// @route  POST /api/orders
// @access Private
import Cart from "../models/Cart.js"; // Import model giỏ hàng

const addOrder = asyncHandler(async (req, res) => {
  console.log("Dữ liệu nhận từ frontend:", req.body);

  const { orderItems, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("Không có sản phẩm nào trong đơn hàng");
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({
        product: item.product || item._id,  // Kiểm tra lại giá trị này
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty
      })),
      paymentMethod,
      totalPrice
    });

      const createdOrder = await order.save();

      // 🛑 Chỉ xóa giỏ hàng nếu tạo đơn hàng thành công
      await Cart.findOneAndDelete({ user: req.user._id });

      res.status(201).json(createdOrder);
  } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      res.status(500).json({ message: "Lỗi khi tạo đơn hàng" });
  }
});

// @desc   Lấy danh sách đơn hàng của user
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Bạn chưa đăng nhập!");
  }

  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc   Lấy chi tiết đơn hàng
// @route  GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Bạn chưa đăng nhập!");
  }

  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name image price"); // Lấy thông tin sản phẩm

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
});

// @desc   Cập nhật trạng thái thanh toán
// @route  PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Bạn chưa đăng nhập!");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Đơn hàng này đã được thanh toán");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

export { addOrder, getMyOrders, getOrderById, updateOrderToPaid };
