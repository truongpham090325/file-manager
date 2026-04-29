import { NextFunction, Request, Response } from "express";

export const checkDomain = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refecer = req.headers.referer;
  const allowedOrigin = process.env.DOMAIN;
  if (refecer !== allowedOrigin) {
    res.send("Không có quyền truy cập!");
    return;
  }

  next();
};
