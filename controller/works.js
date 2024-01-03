const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);
const { v4: uuidv4 } = require("uuid");
// 查找所有作品
exports.getWorks = async (req, res) => {
  try {
    const { author_id } = req.query;
    if (!author_id) return sendJson(res, 403, "参数有误!");
    const sqlParamsArr = [
      {
        sql: "select count(*) as total from works WHERE author_id = ?",
        params: [author_id],
      },
      {
        sql: "select DISTINCT *,concat(?,image_url) as image_url from works WHERE author_id = ?",
        params: [baseUrl, author_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);

    if (result.length) {
      const { total } = result[0][0];
      return sendJson(res, 200, "作品信息查询成功", {
        total,
        list: result[1],
      });
    }

    return sendJson(res, 400, "不知道写啥");
  } catch (e) {
    return sendJson(res, 404, e.message);
  }
};

// 查找所有作品
exports.deleteWorks = async (req, res) => {
  try {
    const { works_id } = req.query;
    if (!works_id) return sendJson(res, 403, "参数有误!");
    const sqlParamsArr = [
      {
        sql: "delete from works_comments where work_id = ?",
        params: [works_id],
      },
      {
        sql: "delete from works where work_id = ?",
        params: [works_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    console.log(result);
    if (result[1].affectedRows) {
      return sendJson(res, 200, "作品删除成功");
    }

    return sendJson(res, 400, "不知道写啥");
  } catch (e) {
    return sendJson(res, 404, e.message);
  }
};

// 查找所有作品
exports.getAllWorks = async (req, res) => {
  try {
    const sqlParamsArr = [
      {
        sql: "select *,concat(?,image_url) as image_url from works",
        params: baseUrl,
      },
    ];
    const result = await Model.select(sqlParamsArr);

    if (result[0].length) {
      return sendJson(res, 200, "作品信息查询成功", result[0]);
    }

    return sendJson(res, 400, "不知道写啥");
  } catch (e) {
    return sendJson(res, 404, e.message);
  }
};

// 查找所有作品
exports.getWorksDetails = async (req, res) => {
  try {
    const { work_id } = req.query;
    console.log(req.query);
    if (!work_id) return sendJson(res, 403, "参数有误!");
    const sqlParamsArr = [
      {
        sql: "select DISTINCT *,concat(?,image_url) as image_url from works WHERE work_id = ?",
        params: [baseUrl, work_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);

    if (result.length)
      return sendJson(res, 200, "作品信息查询成功", result[0][0]);

    return sendJson(res, 400, "不知道写啥");
  } catch (e) {
    return sendJson(res, 404, e.message);
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
        sql: "INSERT INTO works_comments set ?",
        params,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) return sendJson(res, 201, "评论成功!");
    return sendJson(res, 400, "评论失败!");
  } catch (e) {
    return sendJson(res, 400, "参数有误,评论失败!");
  }
};

// 查询评论
exports.getAllComment = async (req, res) => {
  const { work_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: "select count(*) as total from works_comments WHERE work_id = ?",
        params: [work_id],
      },
      {
        sql: "select wc.*,user.uuid,concat(?, user.avatar) as avatar,user.username from works_comments as wc join `user` on wc.author_id = user.uuid and work_id = ?  order by created_at desc",
        params: [baseUrl, work_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      const { total } = result[0][0];
      return sendJson(res, 200, "评论查询成功", {
        total,
        list: result[1],
      });
    }
  } catch (e) {
    return sendJson(res, 500, "查询失败!");
  }
};

// 查询数量
exports.getAllCommentCount = async (req, res) => {
  const { work_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: "select count(*) as total from works_comments WHERE work_id = ?",
        params: [work_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      const { total } = result[0];
      return sendJson(res, 200, "评论查询成功", {
        total,
      });
    }
  } catch (e) {
    return sendJson(res, 500, "查询失败!");
  }
};
