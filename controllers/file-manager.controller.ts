import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const upload = (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const mediaDir = path.join(__dirname, "../media");
    const saveLinks: {
      folder: string;
      fileName: string;
      mimetype: string;
      size: Number;
    }[] = [];

    files.forEach((file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const savePath = path.join(mediaDir, fileName);
      fs.writeFileSync(savePath, file.buffer);
      saveLinks.push({
        folder: "/media",
        fileName: fileName,
        mimetype: file.mimetype,
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

    // Đường dẫn đến file
    const cleanFolder = folder.replace("/", ""); // Loại bỏ dấu /
    const mediaDir = path.join(__dirname, "..", cleanFolder);
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
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
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

    // Đường dẫn đến file
    const cleanFolder = folder.replace("/", ""); // Loại bỏ dấu /
    const mediaDir = path.join(__dirname, "..", cleanFolder);
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
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const createFolderPost = (req: Request, res: Response) => {
  try {
    const { folderName } = req.body;

    if (!folderName && typeof folderName !== "string") {
      res.json({
        code: "error",
        message: "Tên thư mục không hợp lệ!",
      });
      return;
    }

    // Đường dẫn đến folder
    const mediaroot = path.join(__dirname, "..", "media");
    const folderPath = path.join(mediaroot, folderName);

    if (fs.existsSync(folderPath)) {
      res.json({
        code: "error",
        message: "Folder đã tồn tại!",
      });
      return;
    }

    // Tạo folder
    fs.mkdirSync(folderPath);
    res.json({
      code: "success",
      message: "Thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const listFolder = (req: Request, res: Response) => {
  try {
    const mediaPath = path.join(__dirname, "..", "media");
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

    // Sắp xếp theo thời gian tạo
    folders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({
      code: "success",
      message: "Thành công!",
      forderList: folders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Không lấy được danh sách folder!",
    });
  }
};
