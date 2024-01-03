const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const authorController = require(`${process.cwd()}/controller/author`);

// 获取banner
router.get("/getAuthor", authorController.getAuthor);
// 用户注册
// router.post("/registry", userController.reg);

module.exports = router;
