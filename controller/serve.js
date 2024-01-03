const { sendJson } = require(`${process.cwd()}/common/utils`);
const { baseUrl } = require("../config/ip");
// 三级地区
exports.getServeIp = async (req, res) => {
  // console.log(req.query);
  if (!baseUrl) return sendJson(res, 500, "服务器异常!");
  return sendJson(res, 200, "获取服务器地址成功!", { api: baseUrl });
};
