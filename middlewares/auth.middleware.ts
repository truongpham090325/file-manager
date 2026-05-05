import { NextFunction, Request, Response } from "express";

export const verifySecret = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeaer = req.headers.authorization;
    if (
      !authHeaer ||
      authHeaer !== `Bearer ${process.env.FILE_MANAGER_SECRET}`
    ) {
      res.json({
        code: "error",
        message: "Không có quyền truy cập!",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Không có quyền truy cập!",
    });
  }
};
