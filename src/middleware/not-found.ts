import { Request, Response } from "express";

function notFoundMid(req: Request, res: Response) {
  res.status(404).send("Route does not exist");
}

export default notFoundMid;
