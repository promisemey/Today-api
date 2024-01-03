const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);
const { v4: uuidv4 } = require("uuid");

// 收藏菜谱
exports.postFavorites = async (req, res) => {
  const { user_id, recipe_id } = req.body;
  const params = {
    id: uuidv4(),
    user_id,
    recipe_id,
  };

  try {
    const sqlParamsArr = [
      {
        sql: "INSERT INTO favorites set ?",
        params,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) {
      return sendJson(res, 201, "收藏成功", { favorites: recipe_id });
    }
  } catch (e) {
    return sendJson(res, 500, "收藏失败,服务器异常!");
  }
};

// 查询是否收藏
exports.postIsFavorites = async (req, res) => {
  const { user_id, recipe_id } = req.body;
  try {
    const sqlParamsArr = [
      {
        sql: `SELECT EXISTS(SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?) AS is_favoriting`,
        params: [user_id, recipe_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      // 1代表以及收藏
      return sendJson(res, 200, "查询是否已经收藏", result[0][0]);
    }
  } catch (e) {
    return sendJson(res, 500, e.message);
  }
};

// 取消收藏
exports.deleteFavorites = async (req, res) => {
  const { user_id, recipe_id } = req.body;
  console.log("=>>>>", user_id, recipe_id);
  try {
    const sqlParamsArr = [
      {
        sql: `DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?`,
        params: [user_id, recipe_id],
      },
    ];

    const result = await Model.select(sqlParamsArr);

    if (result[0].affectedRows) {
      return sendJson(res, 200, "取消收藏成功", {
        user_id,
        recipe_id,
      });
    }
    return sendJson(res, 404, "未找到收藏关系");
  } catch (e) {
    console.log(e);
    return sendJson(res, 500, "服务器异常");
  }
};

// 查询所有收藏
exports.getAllFavorites = async (req, res) => {
  const { user_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select DISTINCT
        uuid,username,fr.recipe_id,concat('${baseUrl}',user.avatar) as avatar,sub_title,concat('${baseUrl}',foods_img) AS foods_img,need_time,difficulty,ingredient,fr.create_time
        from foods_recipe  as fr 
        JOIN recipe_author as fa
        ON fr.recipe_id=fa.recipe_id
        JOIN USER 
        on fa.author_id = user.uuid
        join foods_step on
        foods_step.recipe_id = fr.recipe_id
        join favorites on favorites.recipe_id = fr.recipe_id
        where user_id = ?
  `,
        params: user_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "查询收藏成功", result[0]);
    }
    return sendJson(res, 404, "查询收藏失败");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};

// 查询所有收藏
exports.rand = async (req, res) => {
  const { user_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select DISTINCT
        uuid,username,fr.recipe_id,concat('${baseUrl}',user.avatar) as avatar,sub_title,concat('${baseUrl}',foods_img) as foods_img,need_time,difficulty,ingredient,fr.create_time
        from foods_recipe  as fr 
        JOIN recipe_author as fa
        ON fr.recipe_id=fa.recipe_id
        JOIN USER 
        on fa.author_id = user.uuid
        join foods_step on
        foods_step.recipe_id = fr.recipe_id
        join favorites on favorites.recipe_id = fr.recipe_id
        ORDER BY RAND() LIMIT 3
  `,
        params: user_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "随机推荐", result[0]);
    }
    return sendJson(res, 404, "查询随机推荐失败");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};

// 获取搜藏总数
exports.getCount = async (req, res) => {
  const { recipe_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select count(*) total from favorites where recipe_id = ?`,
        params: recipe_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "查询收藏数成功！", result[0][0]);
    }
    return sendJson(res, 404, "查询收藏数失败！");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};
