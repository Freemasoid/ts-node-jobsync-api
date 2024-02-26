import { BadRequestError } from "../errors/custom-errors";
import { Request, Response, NextFunction } from "express";

function testUser(req: Request, res: Response, next: NextFunction) {
  if (req.user.testUser) {
    throw new BadRequestError("Test User. Read Only!");
  }
  next();
}

export default testUser;
