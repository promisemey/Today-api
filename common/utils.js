// http协议状态码（背 明晚抽查 说不出来30遍）
// 2XX  成功
// 		200-成功    正常返回     （服务器已成功处理了请求）
// 		201-创建    成功创建数据 （表示服务器执行成功，并且创建了新的资源）
// 		202-已接受              （服务器接受请求，但未处理）
// 3XX  重定向（服务器返回信息告知浏览器如何做后续操作才能成功处理请求）
//      301-永久（新网站）
//      302-临时（站内跳转）
//      304-浏览器缓存（请求成功检测为修改数据来源于浏览器）
// 4XX  客户端错误（客户端原因，妨碍了服务器的处理）
//      400-前端请求失败，方式参数不对
//      401-未通过 HTTP 认证的认证信息（场景：网页登录失败）
//      403-禁止访问（码云私有仓库）
//      404-文件不存在
//      405-请求方法有误
// 5XX  服务端错误
//		500-服务器端在执行请求时发生了错误
//		503-服务器过载，无法处理请求
// -------------------------------

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
