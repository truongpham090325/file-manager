import { Request, Response } from "express";

export const upload = (req: Request, res: Response) => {
  console.log("OK");

  res.json({
    code: "success",
    message: "Upload file thành công!",
  });
};
