import express from "express";
import { registerUser, loginUser ,updateUserProfile} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Trang cá nhân của bạn", user: req.user });
});
router.put("/profile", protect, updateUserProfile);


export default router;
