const express = require("express");
const router = express.Router();

// 导入分类模块逻辑（控制器）
const categoryController = require(`${process.cwd()}/controller/category`);

// 获取一级分类
router.get("/getCategory", categoryController.getCategory);
// 获取一级分类
router.get("/getSubcategory", categoryController.getSubcategory);
// 联动分类
router.get("/getLinkCategory", categoryController.getLinkCategory);
// 修该菜谱分类信息
router.put("/putSubCategory", categoryController.putSubCategory);
// 修该菜谱分类信息
router.delete("/deleteSubCate", categoryController.deleteSubCate);
// 创建菜谱分类信息
router.post("/postSubCate", categoryController.postSubCate);
// 查找菜谱分类列表
router.get("/getSubList", categoryController.getSubList);

module.exports = router;
