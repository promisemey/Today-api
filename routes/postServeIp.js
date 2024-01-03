const express = require("express");
const router = express.Router();

// 导入地区模块逻辑（控制器）
const Serve = require(`${process.cwd()}/controller/serve`);

// 单独地区
router.post("/postServeIp", Serve.getServeIp);

module.exports = router;
