const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const userController = require(`${process.cwd()}/controller/users`);

// 用户登录
router.post("/login", userController.login);

// 用户注册
router.post("/registry", userController.reg);

// 修改用户资料
router.put("/putUserInfo", userController.putUserInfo);

// 用户菜谱
router.get("/getUserFoods", userController.getUserFoods);

// 获取所有用户
router.get("/getAllUser", userController.getAllUser);

// 删除用户
router.delete("/deleteUser", userController.deleteUser);

// 添加用户
router.post("/createUser", userController.createUser);

// 用户注册   (后台)
router.post("/postUser", userController.postUser);

// 修改密码
router.put("/putPassword", userController.putPassword);

module.exports = router;
