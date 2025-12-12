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
        filename: filename,
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

export const changeFileNamePatch = (req: Request, res: Response) => {
  try {
    const { folder, oldFileName, newFileName } = req.body;
    if (!folder || !oldFileName || !newFileName) {
      res.json({
        code: "error",
        message: "Thiếu thông tin cần thiết!",
      });
      return;
    }

    // Tạo đường dẫn đến file
    const cleanFoler = folder.replace("/", ""); // Loại bỏ dấu /
    const mediaDir = path.join(__dirname, "..", cleanFoler);
    const oldPath = path.join(mediaDir, oldFileName);
    const newPath = path.join(mediaDir, newFileName);
    if (!fs.existsSync(oldPath)) {
      res.json({
        code: "error",
        message: "File không tồn tại!",
      });
      return;
    }

    if (fs.existsSync(newPath)) {
      res.json({
        code: "error",
        message: "Tên file mới đã tồn tại!",
      });
      return;
    }

    // Đổi tên file
    fs.renameSync(oldPath, newPath);

    res.json({
      code: "success",
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi đổi tên file!",
    });
  }
};

export const deleteFilePatch = (req: Request, res: Response) => {
  try {
    const { folder, fileName } = req.body;
    if (!folder || !fileName) {
      res.json({
        code: "error",
        message: "Thiếu thông tin cần thiết!",
      });
      return;
    }

    // Tạo đường dẫn đến file
    const cleanFoler = folder.replace("/", ""); // Loại bỏ dấu /
    const mediaDir = path.join(__dirname, "..", cleanFoler);
    const filePath = path.join(mediaDir, fileName);
    if (!fs.existsSync(filePath)) {
      res.json({
        code: "error",
        message: "File không tồn tại!",
      });
      return;
    }

    // Xóa file
    fs.unlinkSync(filePath);

    res.json({
      code: "success",
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi xóa file!",
    });
  }
};

export const createFolderPost = (req: Request, res: Response) => {
  try {
    const { folderName, folderPath } = req.body;
    if (!folderName && typeof folderName !== "string") {
      res.json({
        code: "error",
        message: "Tên thư mục không hợp lệ!",
      });
      return;
    }

    const mediaRoot = path.join(__dirname, "..", "media");
    const targetPath = path.join(mediaRoot, folderPath || "", folderName);
    if (fs.existsSync(targetPath)) {
      res.json({
        code: "error",
        message: "Folder đã tồn tại!",
      });
      return;
    }

    // Tạo folder
    fs.mkdirSync(targetPath);

    res.json({
      code: "success",
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi tạo folder!",
    });
  }
};

export const listFolder = (req: Request, res: Response) => {
  try {
    let mediaPath = path.join(__dirname, "..", "media");

    if (req.query.folderPath != "undefined") {
      mediaPath = path.join(mediaPath, `${req.query.folderPath}`);
    }
    // Đọc danh sách file/thư mục trong media
    const items = fs.readdirSync(mediaPath);

    const folders: {
      name: string;
      createdAt: Date;
    }[] = [];

    items.forEach((item) => {
      const itemPath = path.join(mediaPath, item);
      const itemInfo = fs.statSync(itemPath);
      if (itemInfo.isDirectory()) {
        folders.push({
          name: item,
          createdAt: itemInfo.birthtime,
        });
      }
    });

    // Sắp xếp giảm dần theo ngày tạo
    folders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({
      code: "success",
      message: "Thành công!",
      folderList: folders,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lấy danh sách folder không thành công!",
    });
  }
};
