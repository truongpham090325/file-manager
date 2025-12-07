import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const upload = (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    const saveLinks: any[] = [];

    const mediaDir = path.join(__dirname, "../media");

    files?.forEach((file) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const savePath = path.join(mediaDir, filename);
      fs.writeFileSync(savePath, file.buffer);
      saveLinks.push({
        folder: "/media",
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    });

    res.json({
      code: "success",
      message: "Upload thành công!",
      saveLinks: saveLinks,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi upload!",
    });
  }
};
