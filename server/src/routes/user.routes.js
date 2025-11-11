// Existing imports and setup
import express from "express";
import multer from "multer";
import passport from "../middlewares/GoogleAuth.middleware.js";
import { User } from "../models/user.model.js";
import {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Existing user routes...
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = req.user;

      // FIX: Explicitly check for the user object
      if (!user) {
         console.error("Google OAuth Error: User object missing after authentication.");
         return res.redirect(`http://localhost:5173/login?error=auth_failed`); 
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save();

      // Ensure the redirect URL matches what the client expects
      res.redirect(
        `http://localhost:5173/login/success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (err) {
      console.error("Google OAuth Error in token generation/redirect:", err);
      // Redirect to login on server error
      res.redirect(`http://localhost:5173/login?error=server_issue`);
    }
  }
);

// *** New route to get authenticated user info ***
router.get("/google/user", verifyJWT, async (req, res) => {
  try {
    const user = req.user;

    const accessToken = user.generateAccessToken();

    res.status(200).json({
      status: 200,
      data: {
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          role: user.role,
        },
      },
      message: "User info retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching Google OAuth user info:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected user update route
router.put("/update/:id", verifyJWT, upload.single("profilePicture"), updateUser);

export default router;