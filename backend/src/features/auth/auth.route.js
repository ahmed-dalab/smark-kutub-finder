import { Router } from "express";
import { login,logout,me,refreshToken } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.MIddleware.js";

const authRouter = Router()


// login user
authRouter.post('/login', login)
//  refresh token 
authRouter.post('/refresh-token', refreshToken)
// logout 
authRouter.post("/logout", logout);
// reset password 
// auth me 
authRouter.get("/me", authenticate, me);
export default authRouter;