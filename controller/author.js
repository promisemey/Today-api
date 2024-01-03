const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);

// 导出查询横幅处理逻辑
exports.getAuthor = async (req, res) => {
  try {
    const { recipe_id } = req.query;
    if (!recipe_id) return sendJson(res, 403, "参数有误!");
    const sqlParamsArr = [
      {
        sql: "select DISTINCT *,CONCAT(?,avatar) as avatar from user WHERE uuid = (SELECT author_id from recipe_author WHERE recipe_id = ?)",
        params: [baseUrl, recipe_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) return sendJson(res, 200, "作者信息查询成功", result[0]);
    return sendJson(res, 400, "不知道写啥");
  } catch (e) {
    return sendJson(res, 404, e.message);
  }
};
