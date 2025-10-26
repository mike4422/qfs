// validators/auth.js
import { body, validationResult } from "express-validator";

// --- Register rules ---
export const registerRules = [
  // Accept both "name" and "fullName"
  body(["name", "fullName"])
    .custom((_, { req }) => {
      // Normalize: make sure req.body.name always exists
      if (!req.body.name && req.body.fullName) {
        req.body.name = req.body.fullName;
      }
      return !!req.body.name && req.body.name.length >= 2;
    })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Return first validation error cleanly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array()[0].msg });
    }
    next();
  },
];

// --- Login rules ---
export const loginRules = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isString().withMessage("Password is required"),
];
