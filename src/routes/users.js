import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// User Registration Route
router.post("/register", async (req, res) => {
  const { userType, email, username, password } = req.body;

  const emailCheck = await UserModel.findOne({ email });
  if (emailCheck) {
    return res.status(404).json({ error: "Email already exists!" });
  }

  const usernameCheck = await UserModel.findOne({ username });
  if (usernameCheck) {
    return res.status(404).json({ error: "Username already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ userType, email, username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully !" });
});

// User Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: "User Doesnt exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(404).json({ error: "Password is incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
  let isAdmin = (user.userType==='admin')
  res.json({ token, userID: user._id, isAdmin: isAdmin });
});


// Define a middleware for verifying JWT tokens
export { router as userRouter };
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403).json({error: "Token verification failed"}); // Token verification failed
      next(); // Proceed to the next middleware or route
    });
  } else {
    res.sendStatus(401).json({error: "Token not provided"}); // Token not provided
  }
};
