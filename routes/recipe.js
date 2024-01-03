const express = require("express");
const router = express.Router();

// 导入用户模块逻辑（控制器）
const recipeController = require(`${process.cwd()}/controller/recipe`);

// // 获取作品
// router.get("/getWorks", worksController.getWorks);

// // 获取作品
// router.get("/getWorksDetails", worksController.getWorksDetails);

// 获取当前菜谱评论总数
router.get("/getAllCommentCount", recipeController.getAllCommentCount);

// 获取菜谱评论
router.get("/getAllComment", recipeController.getAllComment);

// 菜谱评论
router.post("/postComment", recipeController.postComment);

// 删除菜谱
router.delete("/deleteRecipe", recipeController.deleteRecipe);

// 搜索菜谱
router.get("/getRecipe", recipeController.getRecipe);

// 修改菜谱
router.put("/putRecipe", recipeController.putRecipe);

module.exports = router;
