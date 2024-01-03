// 导入模型
const districtModel = require(`${process.cwd()}/model/district`);
const { sendJson, createTree } = require(`${process.cwd()}/common/utils`);

// 三级地区
exports.district = async (req, res) => {
  // console.log(req.query);
  const resResult = await districtModel.select({ ...req.query });
  console.log(resResult);
  if (!Object.keys(resResult).length)
    return sendJson(res, 400, "请求参数有误!");

  const { id, result } = resResult;
  switch (id) {
    case 1:
      return sendJson(res, 200, "城市名查询成功!", result);
    case 2:
      return sendJson(res, 200, "查询地区成功!", result);
  }
};

// 单独查询地区
exports.onlyFcity = async (req, res) => {
  console.log(req.query);
  const result = await districtModel.selectOne({ ...req.query });

  if (result.length) return sendJson(res, 200, "查询地区成功!", result);

  return sendJson(res, 404, "地区不存在!");
};
