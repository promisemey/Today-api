const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);
const { v4: uuidv4 } = require("uuid");

// 获取当前作品评论总数
exports.postFans = async (req, res) => {
  const { follower_id, following_id } = req.body;
  const params = {
    id: uuidv4(),
    follower_id,
    following_id,
  };

  try {
    const sqlParamsArr = [
      {
        sql: "INSERT INTO follows set ?",
        params,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) {
      return sendJson(res, 201, "关注成功", { fans: follower_id });
    }
  } catch (e) {
    return sendJson(res, 500, "关注失败,已经是他的粉丝!");
  }
};

// 查询当前用户粉丝，以及是佛回关了
exports.postAllisFollowed = async (req, res) => {
  const { following_id } = req.body;
  try {
    const sqlParamsArr = [
      {
        sql: `
        SELECT follower_id,u.username,concat('${baseUrl}', u.avatar) as avatar, f.created_at AS followed_at,sex,createtime,
        IF(EXISTS(SELECT * FROM follows WHERE follower_id = ? AND following_id = f.follower_id), true, false) AS is_followed_by_me
        FROM user AS u
        JOIN follows AS f ON f.follower_id = u.uuid
        WHERE f.following_id = ?
        ORDER BY followed_at DESC;`,
        params: [following_id, following_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      return sendJson(res, 200, "互关查询成功", result[0]);
    }
  } catch (e) {
    return sendJson(res, 500, "查询失败!");
  }
};

// 说明
// 在这个查询中，follower_id 是当前用户的 ID，表示当前用户是这些关注者的粉丝，而 followed_user_id 是被关注者的 ID，表示这些关注者关注的用户。具体来说，查询语句中：

// FROM users AS u 表示从 users 表中查询用户信息。
// JOIN followers AS f ON f.followed_user_id = u.id 表示将 users 表和 followers 表通过被关注者的 ID 进行关联。
// WHERE f.follower_id = ? 表示只查询当前用户关注的粉丝。
// ORDER BY followed_at DESC 表示按照关注时间倒序排列。
// 在 IF 函数中， SELECT * FROM followers WHERE follower_id = ? AND followed_user_id = f.follower_id 表示查询当前用户是否关注了这些粉丝。如果存在这样的记录，说明当前用户关注了这个粉丝，函数返回 true；否则函数返回 false。

//
exports.postIsFollow = async (req, res) => {
  const { follower_id, following_id } = req.body;
  try {
    // SELECT EXISTS(SELECT * FROM follows WHERE follower_id = <当前用户ID> AND following_id = <被查询用户ID>) AS is_following;
    const sqlParamsArr = [
      {
        sql: `SELECT EXISTS(SELECT * FROM follows WHERE follower_id = ? AND following_id = ?) AS is_following`,
        params: [follower_id, following_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result.length) {
      return sendJson(res, 200, "查询是否关注成功", result[0][0]);
    }
  } catch (e) {
    return sendJson(res, 500, e.message);
  }
};

// 取关
exports.deletefollow = async (req, res) => {
  const { follower_id, following_id } = req.body;
  try {
    const sqlParamsArr = [
      {
        sql: `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
        params: [follower_id, following_id],
      },
    ];
    const result = await Model.select(sqlParamsArr);
    console.log(result[0]);
    if (result[0].affectedRows) {
      return sendJson(res, 200, "取消关注成功", {
        follower_id,
        following_id,
      });
    }
    return sendJson(res, 404, "未找到关注关系");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};

// 查询粉丝
exports.getFans = async (req, res) => {
  const { following_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select count(*) as fans from follows where following_id = ?`,
        params: following_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "查询粉丝量成功", result[0][0]);
    }
    return sendJson(res, 404, "未找到关注关系");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};

// 查询关注者
exports.getAttention = async (req, res) => {
  const { follower_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select count(*) as attention from follows where follower_id = ?`,
        params: follower_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "查询关注成功", result[0][0]);
    }
    return sendJson(res, 404, "未找到关注关系");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};

// 查询关注者
exports.getFollowInfo = async (req, res) => {
  // const field = `${Object.keys(req.query)[0]} = '${
  //   Object.values(req.query)[0]
  // }'`;
  const { follower_id } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: `select uuid,username,sex,concat('${baseUrl}',user.avatar) avatar,concat(1) as is_followed_by_me,createtime from user join follows on user.uuid = follows.following_id  where follower_id = ?`,
        params: follower_id,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].length) {
      return sendJson(res, 200, "查询关注成功", result[0]);
    }
    return sendJson(res, 404, "未找到关注关系");
  } catch (e) {
    return sendJson(res, 500, "服务器异常");
  }
};
