const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const followsController = require(`${process.cwd()}/controller/follows`);

// 关注
router.post("/postFans", followsController.postFans);

// 查询是否回关
router.post("/postAllisFollowed", followsController.postAllisFollowed);

// 查询是否回关
router.post("/postIsFollow", followsController.postIsFollow);

// 取消关注
router.delete("/deletefollow", followsController.deletefollow);
// 取消关注
router.get("/getFans", followsController.getFans);
// 取消关注
router.get("/getAttention", followsController.getAttention);

// 获取关注信息
router.get("/getFollowInfo", followsController.getFollowInfo);

module.exports = router;
