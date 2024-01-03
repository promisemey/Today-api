const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);
const { v4: uuidv4 } = require("uuid");
// // 查找所有作品
// exports.getWorks = async (req, res) => {
//   try {
//     const { author_id } = req.query;
//     if (!author_id) return sendJson(res, 403, "参数有误!");
//     const sqlParamsArr = [
//       {
//         sql: "select count(*) as total from works WHERE author_id = ?",
//         params: [author_id],
//       },
//       {
//         sql: "select DISTINCT *,concat(?,image_url) as image_url from works WHERE author_id = ?",
//         params: [baseUrl, author_id],
//       },
//     ];
//     const result = await Model.select(sqlParamsArr);

//     if (result.length) {
//       const { total } = result[0][0];
//       return sendJson(res, 200, "作品信息查询成功", {
//         total,
//         list: result[1],
//       });
//     }

//     return sendJson(res, 400, "不知道写啥");
//   } catch (e) {
//     return sendJson(res, 404, e.message);
//   }
// };

// // 查找作品详情
// exports.getWorksDetails = async (req, res) => {
//   try {
//     const { work_id } = req.query;
//     console.log(req.query);
//     if (!work_id) return sendJson(res, 403, "参数有误!");
//     const sqlParamsArr = [
//       {
//         sql: "select DISTINCT *,concat(?,image_url) as image_url from works WHERE work_id = ?",
//         params: [baseUrl, work_id],
//       },
//     ];
//     const result = await Model.select(sqlParamsArr);

//     if (result.length)
//       return sendJson(res, 200, "作品信息查询成功", result[0][0]);

//     return sendJson(res, 400, "不知道写啥");
//   } catch (e) {
//     return sendJson(res, 404, e.message);
//   }
// };

// 获取当前作品评论总数
exports.getAllCommentCount = async (req, res) => {
  const { recipe_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: "select count(*) as total from recipe_comments WHERE recipe_id = ?",
        params: [recipe_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      const { total } = result[0];
      return sendJson(res, 200, "菜谱评论查询成功", {
        total,
      });
    }
  } catch (e) {
    return sendJson(res, 500, "查询失败!");
  }
};

// 插入评论
exports.postComment = async (req, res) => {
  const params = req.body;
  params.id = uuidv4();
  console.log(params);
  try {
    const sqlParamsArr = [
      {
        sql: "INSERT INTO recipe_comments set ?",
        params,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    console.log("=>>", result);
    if (result[0].affectedRows) return sendJson(res, 201, "评论成功!");
    return sendJson(res, 400, "评论失败!");
  } catch (e) {
    return sendJson(res, 400, "参数有误,评论失败!");
  }
};

// 查询当前作品评论
exports.getAllComment = async (req, res) => {
  const { recipe_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: "select count(*) as total from recipe_comments WHERE recipe_id = ?",
        params: [recipe_id],
      },
      {
        sql: "select wc.*,user.uuid,concat(?, user.avatar) as avatar,user.username from recipe_comments as wc join `user` on wc.author_id = user.uuid and recipe_id = ?  order by created_at desc",
        params: [baseUrl, recipe_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      const { total } = result[0][0];
      return sendJson(res, 200, "菜谱评论查询成功", {
        total,
        list: result[1],
      });
    }
  } catch (e) {
    return sendJson(res, 500, "查询失败!");
  }
};

// 删除菜谱
exports.deleteRecipe = async (req, res) => {
  const { recipe_id } = req.query;
  console.log("=>>>", req.query, recipe_id);
  try {
    const sqlParamsArr = [
      {
        sql: "delete from foods_recipe  where recipe_id = ?",
        params: recipe_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) {
      return sendJson(res, 200, "菜谱删除成功");
    }
  } catch (e) {
    return sendJson(res, 500, "菜谱删除失败!");
  }
};

// 获取菜谱
exports.getRecipe = async (req, res) => {
  const { sub_title } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select DISTINCT
        uuid,username,concat('${baseUrl}',user.avatar) as avatar,fr.recipe_id,sub_title,concat('${baseUrl}',foods_img) AS foods_img
        from foods_recipe  as fr 
        JOIN recipe_author as fa
        ON fr.recipe_id=fa.recipe_id
        JOIN USER 
        on fa.author_id = user.uuid
        join foods_step on
        foods_step.recipe_id = fr.recipe_id 
        where sub_title like '%${sub_title}%'`,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "菜谱获取成功", result[0]);
    }
  } catch (e) {
    return sendJson(res, 500, "菜谱获取失败!");
  }
};

// 修改菜谱
exports.putRecipe = async (req, res) => {
  const params = req.body;
  const fields = Object.entries(params)
    .filter(
      (field) =>
        field[0] !== "recipe_id" && field[1] !== "" && field[1] !== undefined
    )
    .map(
      (value) =>
        `${value[0]} = '${
          typeof value[1] === "object" ? JSON.stringify(value[1]) : value[1]
        }'`
    )
    .join(", ");

  const sqlArr = [
    {
      sql: `UPDATE foods_recipe SET ${fields} WHERE recipe_id = ?`,
      params: req.body.recipe_id,
    },
  ];

  const result = await Model.select(sqlArr);
  if (result[0].affectedRows) return sendJson(res, 201, "修改成功!");
  try {
  } catch (e) {
    return sendJson(res, 500, e.message);
  }
};
