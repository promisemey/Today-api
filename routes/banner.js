const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const bannerController = require(`${process.cwd()}/controller/banner`);

// 获取banner
router.get("/getBanner", bannerController.getBanner);
// 用户注册
// router.post("/registry", userController.reg);

module.exports = router;
