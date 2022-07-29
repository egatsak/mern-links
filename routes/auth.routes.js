const { Router, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// /api/auth/register
router.post(
  "/register",
  [
    check("email", "incorrect email").isEmail(),
    check(
      "password",
      "Incorrect password, min password lengts is 1 char"
    ).isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      console.log("Body", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect registration data",
        });
      }
      const { email, password } = req.body;

      const candidate = await User.findOne({ email: email });

      if (candidate) {
        return res.status(400).json({ message: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: "User has been registered" });
    } catch (e) {
      res.status(500).json({ message: "Smth went wrong, please try again..." });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect login data",
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ message: "User doesn't exist!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Incorrect password, please try again" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });
      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: "Smth went wrong, please try again..." });
    }
  }
);
module.exports = router;
