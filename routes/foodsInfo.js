const express = require("express");
const router = express.Router();

// 导入菜谱信息模块逻辑（控制器）
const foodsInfoController = require(`${process.cwd()}/controller/foodsInfo`);

router.post("/postFoodsList", foodsInfoController.foodsInfo);

module.exports = router;
