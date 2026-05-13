import Joi from "joi";
import { User, validate } from "../models/User.js";
import UserStats from "../models/UserStats.js"; // <--- NAYA: Stats Model Import Kiya
import bcrypt from "bcrypt";

// Sign Up
const registerUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      return res.status(409).send({ message: "Email already in use!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();

    res.status(201).send({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

// Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

// Login
const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password!" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid email or password!" });
    }

    const token = user.generateAuthToken();
    res
      .status(200)
      .send({ token, userId: user._id, message: "Logged in successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

// <--- NAYA FUNCTION: Get User Stats --->
const getUserStats = async (req, res) => {
  try {
    const stats = await UserStats.findOne({ userId: req.user._id });
    
    // Agar naya user hai aur abhi tak koi stat nahi bana
    if (!stats) {
      return res.status(200).json({
        totalNotesGenerated: 0,
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        totalScore: 0
      });
    }
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats." });
  }
};

export { registerUser, loginUser, getUserStats }; // <--- Export mein add kiya