import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
       jti: crypto.randomUUID(),
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}