/**
 * 接口响应
 * @param {Object} res      响应对象
 * @param {Number} state     状态码
 * @param {String} msg  提示信息
 * @param {mixed}  data     响应数据
 */

// 数据响应格式
exports.sendJson = (
  res,
  state,
  message,
  data = null,
  token,
  menu = undefined
) => {
  data
    ? res.json({
        meta: {
          state,
          message,
          token,
        },
        data,
        menu,
      })
    : res.json({
        meta: {
          state,
          message,
          token,
        },
      });
};

// 树形分类
exports.createTree = (arr, id = 0) => {
  // 查找子元素
  const findByid = (root_arr, root_id) => {
    const child = [];
    for (let i = 0; i < root_arr.length; i++) {
      if (root_arr[i].pid === root_id) {
        child.push(root_arr[i]);
      }
    }
    // root_arr?.forEach((item) => {
    //   if (item.pid === root_id) child.push(item);
    // });
    return child;
  };

  // console.log(findByid(1, district));
  // 创建树形分类数组
  const tree = (data_arr, root_id) => {
    const result = findByid(data_arr, root_id);
    // 无数据  返回空数组
    if (!result.length) {
      return null;
    } else {
      for (let i = 0; i < result.length; i++) {
        if (tree(data_arr, result[i].id)) {
          //   console.log(item);
          result[i]["children"] = tree(data_arr, result[i].id);
        }
      }
      // result.forEach((item) => {
      //   if (tree(data_arr, item.id)) {
      //     item['children'] = tree(data_arr, item.id);
      //   }
      // });
    }
    return result;
  };

  return tree(arr, id);
};

exports.createTree = (arr, id = 0) => {
  // 查找子元素
  const findByid = (root_arr, root_id) => {
    const child = [];
    for (let i = 0; i < root_arr.length; i++) {
      if (root_arr[i].pid === root_id) {
        child.push(root_arr[i]);
      }
    }
    return child;
  };
  // 创建树形分类数组
  const tree = (data_arr, root_id) => {
    const result = findByid(data_arr, root_id);
    // 无数据  返回空数组
    if (!result.length) {
      return null;
    } else {
      for (let i = 0; i < result.length; i++) {
        if (tree(data_arr, result[i].id)) {
          //   console.log(item);
          result[i]["children"] = tree(data_arr, result[i].id);
        }
      }
    }
    return result;
  };

  return tree(arr, id);
};

const express = require("express");
const jwt = require("jsonwebtoken");
const redis = require("redis");

const app = express();
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
