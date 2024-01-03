const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { sendJson } = require(`${process.cwd()}/common/utils`);
const { baseUrl } = require("../config/ip");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1024 * 1024 * 20 }, // 最大文件
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "img", maxCount: 8 },
  { name: "video", maxCount: 1 },
]);

// 导入用户模块逻辑（控制器）
// const uploadController = require(`${process.cwd()}/controller/users`);

router.post("/profile", upload, (req, res) => {
  const result = [];
  try {
    Object.keys(req.files).forEach((fileExt) => {
      // 获取文件后缀名
      const currentFile = req.files[fileExt][0];
      const ext = currentFile.originalname.split(".")[1];

      // 通过时间戳修改文件名
      const timeNum = new Date();
      const fileRename =
        timeNum.getTime() +
        "_" +
        timeNum.toLocaleDateString().replaceAll("/", "_") +
        `.${ext}`;

      // 存储到指定文件夹
      let folder = "img";
      switch (fileExt) {
        case "avatar":
          folder = "avatar";
          break;
        case "video":
          folder = "video";
          break;
        default:
          folder = "archive";
          break;
      }
      const newPath = `static/${folder}/${fileRename}`;
      const re = {
        ...currentFile,
        filename: newPath,
        fullPath: `${baseUrl}/${newPath}`,
      };
      delete re.path;
      delete re.destination;
      result.push(re);
      fs.renameSync(currentFile.path, newPath);
    });

    return sendJson(res, 201, "文件上传成功!", result);
  } catch (e) {
    throw new Error(e);
  }

  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
});

module.exports = router;
