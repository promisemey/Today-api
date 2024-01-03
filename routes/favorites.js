const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const favoritesController = require(`${process.cwd()}/controller/favorites`);

// 收藏
router.post("/postFavorites", favoritesController.postFavorites);

// 查询是否已经收藏
router.post("/postIsFavorites", favoritesController.postIsFavorites);

// 取消收藏
router.delete("/deleteFavorites", favoritesController.deleteFavorites);

// 查询所有收藏
router.get("/getAllFavorites", favoritesController.getAllFavorites);

// 随机
router.get("/rand", favoritesController.rand);

// 查询所有收藏
router.get("/getCount", favoritesController.getCount);

// 查询是否收藏
// router.post("/postAllisFollowed", followsController.postAllisFollowed);

// // 查询是否回关
// router.post("/postIsFollow", followsController.postIsFollow);

// // 取消关注
// router.delete("/deletefollow", followsController.deletefollow);
// // 取消关注
// router.get("/getFans", followsController.getFans);
// // 取消关注
// router.get("/getAttention", followsController.getAttention);

module.exports = router;
