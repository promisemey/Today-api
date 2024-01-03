const bannerModel = require(`${process.cwd()}/model/banner`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);

// 导出查询横幅处理逻辑
exports.getBanner = async (req, res) => {
  try {
    const sql =
      "SELECT foods_banner.*,foods_banner.image_url as banner_img,CONCAT(?,user.avatar) as avatar FROM foods_banner join recipe_author on foods_banner.menu_id=recipe_author.recipe_id JOIN user on recipe_author.author_id = user.uuid WHERE ?";
    // const sql =
    //   "SELECT foods_banner.*,CONCAT(?,foods_banner.image_url) as banner_img,CONCAT(?,user.avatar) as avatar FROM foods_banner join recipe_author on foods_banner.menu_id=recipe_author.recipe_id JOIN user on recipe_author.author_id = user.uuid WHERE ?";
    // const sql =
    //   "SELECT foods_banner.*,CONCAT(?,foods_banner.image_url) as banner_img,CONCAT(?,user.avatar) as avatar FROM foods_banner join user on foods_banner.author_id=user.uuid WHERE ?";
    const params = [baseUrl, baseUrl, { is_open: 1 }];
    const sqlParamsArr = [
      {
        sql,
        params,
      },
    ];
    const result = await bannerModel.select(sqlParamsArr);
    if (result.length) return sendJson(res, 200, "横幅查找成功", result[0]);
    return sendJson(res, 400, "横幅不存在");
  } catch (e) {
    throw new Error("横幅查询异常", e);
  }
};

