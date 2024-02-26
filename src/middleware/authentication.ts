import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/custom-errors";
import { NextFunction, Request, Response } from "express";

async function authMid(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const testUser = payload.userID === "65650f0721d2576f35e79c23";
    req.user = { userID: payload.userID, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
}

export default authMid;
