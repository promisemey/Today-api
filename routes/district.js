const express = require("express");
const router = express.Router();

// 导入地区模块逻辑（控制器）
const districtController = require(`${process.cwd()}/controller/district`);

// 地区
router.get("/district", districtController.district);

// 单独地区
router.get("/onlyFcity", districtController.onlyFcity);

module.exports = router;
