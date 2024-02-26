import express from "express";
import rateLimit from "express-rate-limit";
import authMid from "../middleware/authentication";
import testUser from "../middleware/testUser";
import { login, register, updateUser } from "../controllers/auth";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again in 15 minutes",
  },
});

const authRouter = express.Router();

authRouter.post("/register", apiLimiter, register);
authRouter.post("/login", apiLimiter, login);
authRouter.patch("/updateUser", authMid, testUser, updateUser);

export default authRouter;
