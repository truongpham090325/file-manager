import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const upload = (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const mediaDir = path.join(__dirname, "../media");
    const saveLinks: {
      forder: string;
      fileName: string;
      minitype: string;
      size: Number;
    }[] = [];

    files.forEach((file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const savePath = path.join(mediaDir, fileName);
      fs.writeFileSync(savePath, file.buffer);
      saveLinks.push({
        forder: "/media",
        fileName: fileName,
        minitype: file.mimetype,
        size: file.size,
      });
    });

    res.json({
      code: "success",
      message: "Upload file thành công!",
      saveLinks: saveLinks,
    });
  } catch (error) {
    console.log(error);

    res.json({
      code: "error",
      message: "Lỗi Upload!",
    });
  }
};
