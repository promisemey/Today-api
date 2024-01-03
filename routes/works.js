const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const worksController = require(`${process.cwd()}/controller/works`);

// 获取作品
router.get("/getWorks", worksController.getWorks);

// 删除作品
router.get("/deleteWorks", worksController.deleteWorks);

// 获取作品
router.get("/getAllWorks", worksController.getAllWorks);

// 获取作品
router.get("/getWorksDetails", worksController.getWorksDetails);

// 作品评论
router.post("/postComment", worksController.postComment);

// 获取作品评论
router.get("/getAllComment", worksController.getAllComment);

module.exports = router;
