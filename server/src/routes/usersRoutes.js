import express from "express";
import { registerUser, loginUser, getUserStats } from "../controllers/userController.js";
import auth from "../middlewares/auth.js"; // <--- NAYA: Auth middleware import kiya

const router = express.Router();

// Route for registration
router.post("/signup", registerUser);

// Login route
router.post("/login", loginUser);

// <--- NAYA ROUTE: Get Dashboard Stats --->
router.get("/stats", auth, getUserStats);

export default router;