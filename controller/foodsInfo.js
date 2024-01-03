const { baseUrl } = require("../config/ip");
const setting = require(`${process.cwd()}/config/setting`);
const { sendJson, createTree } = require(`${process.cwd()}/common/utils`);
const foodsInfo = require(`${process.cwd()}/model/foodsInfo`);
const { verify } = require(`${process.cwd()}/config/verify`);

exports.foodsInfo = async (req, res) => {
  uuid = undefined;
  if (req.body.token && req.body.card === "pc") {
    console.log(req.body);
    const {
      role: { role },
    } = await verify.verifyToken(req.body.token);
    if (role.role === 0) uuid = role.uuid;
  }

  try {
    const { pagenum = 1, pagesize = 10, recipe_id } = req.body;
    // 判断传入参数不正确
    if (pagenum === "" || pagesize === "")
      return sendJson(res, 400, "参数值不正确!");
    const result = await foodsInfo.select(
      { pagenum, pagesize, recipe_id },
      uuid
    );
    // 不存在食谱详情uid
    if (!result[0].recipe_id) {
      return sendJson(res, 200, "菜谱列表查询成功!", {
        imgBaseUrl: baseUrl,
        list: result[0],
        ...result[1][0], // 总数
      });
    }
    // 食谱详情 uid
    const step = [];
    const endResult = result.reduce((prev, next) => {
      const stepObj = {
        step_num: next.step_num,
        step_img: baseUrl + next.step_img,
        step_content: next.step_content,
      };
      step.push(stepObj);
      prev = {
        recipe_id: next.uid,
        title: next.title,
        foods_img: baseUrl + next.foods_img,
        detail_video: baseUrl + next.details_video,
        need_time: next.need_time,
        difficulty: next.difficulty,
        stars: next.stars,
        ingredient: next.ingredient,
        create_time: next.create_time,
        step,
      };
      return prev;
    }, {});
    return sendJson(res, 200, "食谱详情查询成功!", endResult);
  } catch (e) {
    return sendJson(res, 500, "服务器繁忙!");
  }
};
