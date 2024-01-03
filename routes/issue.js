const express = require("express");
const router = express.Router();
// 导入地区模块逻辑（控制器）
const issueController = require(`${process.cwd()}/controller/issue`);

router.post("/issue", issueController.issuechange);

router.post("/issueRecipe", issueController.issueRecipe);

// 上传作品
router.post("/issueWork", issueController.issueWork);

module.exports = router;
