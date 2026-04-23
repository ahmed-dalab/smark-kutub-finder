import User from "../users/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/auth.tokens.js";
import RefreshToken from "./refresh-token.model.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/auth.cookies.js";



// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid credentials",
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const tokenHash = hashToken(refreshToken);

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.get("user-agent") || null,
      ipAddress: req.ip || null,
    });

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      status: "success",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

// refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      return res.status(401).json({
        status: "failed",
        message: "Refresh token missing",
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshTokenFromCookie);
    } catch {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or expired refresh token",
      });
    }

    const oldTokenHash = hashToken(refreshTokenFromCookie);

    const existingToken = await RefreshToken.findOne({
      tokenHash: oldTokenHash,
      revokedAt: null,
    });

    if (!existingToken) {
      return res.status(401).json({
        status: "failed",
        message: "Refresh token not recognized",
      });
    }

    if (existingToken.expiresAt < new Date()) {
      return res.status(401).json({
        status: "failed",
        message: "Refresh token expired",
      });
    }

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    const newTokenHash = hashToken(newRefreshToken);

    existingToken.revokedAt = new Date();
    existingToken.replacedByTokenHash = newTokenHash;
    await existingToken.save();

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.get("user-agent") || null,
      ipAddress: req.ip || null,
    });

    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

/// logout
export const logout = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (refreshTokenFromCookie) {
      const tokenHash = hashToken(refreshTokenFromCookie);

      await RefreshToken.findOneAndUpdate(
        { tokenHash, revokedAt: null },
        { revokedAt: new Date() }
      );
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

// auth me 
export const me = async (req, res) => {
  return res.status(200).json({
    status: "success",
    user: req.user,
  });
};