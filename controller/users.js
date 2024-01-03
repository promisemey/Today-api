// 导入token
// const jwt = require('jsonwebtoken');
const redis = require("redis");
const bcrypt = require("bcrypt");
const { verify } = require(`${process.cwd()}/config/verify`);
const { sendJson } = require(`${process.cwd()}/common/utils`);
const userModel = require(`${process.cwd()}/model/users`);
const Model = require(`${process.cwd()}/model/commonModel`);

const setting = require(`${process.cwd()}/config/setting`);

// uuid
const { v4: uuidv4 } = require("uuid");

//
const { baseUrl } = require("../config/ip");
// 秘钥
// const { Secretkey, EXPIRESD } = require(`${process.cwd()}/private.key`);

function setUserInfoMiddleware(req, res, next) {
  // 假设登录成功后从请求或数据库中获取用户信息，并将其存储在req.user中

  // 将用户信息存储在应用程序的本地变量中
  app.locals.user = req;

  // 调用next()继续处理下一个中间件或路由处理函数
  next();
}

// 导出登录处理逻辑
exports.login = async (req, res) => {
  const client = redis.createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));

  const { username, password } = req.body;

  if (!username || !password) return sendJson(res, 400, "参数有误!");
  // 查询条件
  const sql = `username='${username}'`;
  // return;
  try {
    const result = await userModel.select(sql);
    // 用户不存在
    if (!result.length) return sendJson(res, 400, "用户不存在!");
    req.userInfo = result;
    // 和redis建立连接
    await client.connect();
    // 从redis中获取token信息
    let token = await client.get(result[0].uuid);

    // token不存在
    if (!token) {
      // 生成token信息
      token = await verify.setToken({
        role: [
          { role: 0, type: "user", uuid: result[0].uuid },
          { role: 1, type: "admin", uuid: result[0].uuid },
        ][result[0].role],
      });

      // 将token信息存入redis中
      await client.set(result[0].uuid, token, {
        EX: setting.token.signTime,
      });

      // 断开连接
      await client.disconnect();
    }

    const {
      role: { role },
    } = await verify.verifyToken(token);

    const menu = await Model.select([
      {
        sql: "select type,role,menu from foods_menu_list where role = ?",
        params: role.role,
      },
    ]);
    menu[0][0].menu = JSON.parse(menu[0][0].menu);
    // 解密比较
    bcrypt.compare(password, result[0].password, async (err, resultPwd) => {
      if (!resultPwd) return sendJson(res, 401, "密码错误!");

      // 移除密码
      delete result[0].password;
      req.user = result[0];
      return sendJson(res, 200, "登录成功!", result, token, { ...menu[0][0] });
    });
  } catch (e) {
    console.log(e);
    return sendJson(res, 500, "网络繁忙,请刷新后重试...");
  }
};

// 导出注册处理逻辑
exports.reg = async (req, res) => {
  let {
    username,
    password,
    avatar = "",
    address,
    phone = "",
    createtime,
  } = req.body;

  if (!req.body.username || !req.body.password)
    return sendJson(res, 400, "参数有误!");
  // 判断账号名是否已经注册
  const user = `username='${username}'`;
  try {
    const result = await userModel.select(user);

    if (result.length) return sendJson(res, 400, "账号已存在!");

    // 初始化创建时间
    createtime = new Date().toLocaleString();
    // 初始化性别 0:女  1:男
    sex = 0;

    // 初始化地址
    if (!address) address = JSON.stringify({ text: "", value: [] });

    // 密码加密  salt 加盐
    const salt = 10;
    bcrypt.hash(password, salt, async (err, hash) => {
      // 抛出错误信息
      if (err) throw new Error(err.message);
      // 插入数据  hash  加密后的密码
      const sql = `('${uuidv4()}','${username}','${hash}','${sex}','${avatar}','${address}','${phone}','${createtime}')`;
      const resultInsert = await userModel.insert(sql);

      // 返回数据
      if (resultInsert) {
        return sendJson(res, 201, "创建成功!");
      } else {
        return sendJson(res, 500, "操作失败!");
      }
    });
  } catch (e) {
    return sendJson(res, 500, "网络繁忙!");
  }
};

// 导出修改
exports.putUserInfo = async (req, res) => {
  const { uuid } = req.body;
  const updates = req.body;

  if (!uuid) return sendJson(res, 400, "参数有误!");
  const user = `username='${req.body.username}'`;

  try {
    const isuser = await userModel.select(user);

    if (isuser.length && isuser[0].uuid !== uuid)
      return sendJson(res, 400, "账号已存在!");

    const fields = Object.entries(updates)
      .filter(
        (field) =>
          field[0] !== "uuid" && field[1] !== "" && field[1] !== undefined
      )
      .map((value) => `${value[0]} = '${value[1]}'`)
      .join(", ");

    const sqlArr = [
      {
        sql: `UPDATE user SET ${fields} WHERE uuid = ?`,
        params: req.body.uuid,
      },
    ];
    const result = await Model.select(sqlArr);
    if (result[0].affectedRows) return sendJson(res, 201, "修改成功!");
  } catch (e) {
    return sendJson(res, 500, "服务器繁忙!");
  }
};

// exports.putUserInfo = async (req, res) => {
//   let {
//     uuid,
//     username,
//     sex,
//     avatar = "",
//     address,
//     phone = "",
//     birth = "",
//   } = req.body;

//   if (!uuid || !username) return sendJson(res, 400, "用户名必填!");

//   // 查询条件
//   const sql = `uuid='${uuid}'`;
//   const user = await userModel.select(sql);
//   if (!user.length) return sendJson(res, 400, "用户不存在!");

//   if (!address) address = JSON.stringify({ text: "", value: [] });

//   try {
//     const result = await userModel.updateUser([
//       {
//         username,
//         sex,
//         avatar,
//         address,
//         phone,
//         birth,
//       },
//       uuid,
//     ]);
//     if (result) return sendJson(res, 201, "修改成功!");
//   } catch (e) {
//     return sendJson(res, 500, "网络繁忙!");
//   }
// };

// 获取用户个人菜谱
exports.getUserFoods = async (req, res) => {
  const { author_id } = req.query;
  try {
    const sql = [
      {
        sql: "select Count(*) as total from recipe_author where author_id = ?",
        params: author_id,
      },
      {
        sql: "select recipe_author.*,foods_recipe.sub_title,concat(?,foods_recipe.foods_img) as foods_img from recipe_author join foods_recipe on foods_recipe.recipe_id = recipe_author.recipe_id where author_id = ?",
        params: [baseUrl, author_id],
      },
    ];
    const results = await userModel.findAllFoods(sql);
    if (results.length)
      return sendJson(res, 200, "用户菜谱查询成功!", {
        ...results[0][0],
        list: results[1],
      });
  } catch (e) {
    return sendJson(res, 500, "服务器繁忙!");
  }
};

exports.getAllUser = async (req, res) => {
  const {
    pagenum = 1,
    pagesize = 5,
    username,
    phone,
    created_at1,
    created_at2,
  } = req.query;
  const start = (pagenum - 1) * pagesize;

  // 用户名 模糊查询
  let payload = `and username like '%${username}%'`;

  // 手机号精准匹配
  if (Number(phone)) {
    payload += `and phone = ${phone} `;
  }

  // 创建时间
  if (Number(created_at1) && Number(created_at2)) {
    payload += `and (UNIX_TIMESTAMP(createtime) * 1000 > ${created_at1} and UNIX_TIMESTAMP(createtime) * 1000 < ${created_at2})`;
  }

  try {
    const sql = [
      { sql: `select count(*) as total from user where 1 ${payload}` },
      {
        sql: `select  *,concat('${baseUrl}',avatar) as avatar from user where 1 ${payload} limit ${start},${pagesize}`,
      },
    ];
    const result = await Model.select(sql);
    return sendJson(res, 200, "用户列表获取成功", {
      ...result[0][0],
      list: result[1],
    });
  } catch (e) {
    console.log(e);
    return sendJson(res, 500, "服务器繁忙!");
  }
};

exports.postUser = async (req, res) => {
  const { uuid } = req.body;
  try {
    const sql = [
      {
        sql: `select DISTINCT *,concat(?,avatar) as avatar from user where uuid =?`,
        params: [baseUrl, uuid],
      },
    ];
    const result = await Model.select(sql);
    return sendJson(res, 200, "", result[0]);
  } catch (e) {
    return sendJson(res, 500, "服务器繁忙!");
  }
};

// 批量删除
exports.deleteUser = async (req, res) => {
  const { uuid } = req.query;
  const arg = uuid
    .split(",")
    .map((item) => "?")
    .join();

  try {
    const sql = [
      {
        sql: `delete from user where uuid in (${arg})`,
        params: uuid.split(","),
      },
    ];
    const result = await Model.select(sql);
    console.log(result);
    if (result[0].affectedRows) return sendJson(res, 200, "删除成功");
    return sendJson(res, 400, "删除失败");
  } catch (e) {
    return sendJson(res, 500, "服务器繁忙!");
  }
};

// 添加用户
exports.createUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password)
      return sendJson(res, 400, "参数有误!");

    const field = await Model.select([
      {
        sql: `select * from user where username = ?`,
        params: req.body.username,
      },
    ]);

    if (field[0].length) return sendJson(res, 400, "账号已存在!");

    // 密码加密  salt 加盐
    const salt = 10;
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      // 抛出错误信息
      if (err) throw new Error(err.message);
      // 插入数据  hash  加密后的密码
      req.body.password = hash;
      const fields = Object.fromEntries(
        Object.entries(req.body).filter(
          (field) => field[1] !== "" && field[1] !== undefined
        )
      );
      fields.uuid = uuidv4();
      fields.address = JSON.stringify({ text: "", value: [] });

      const sql = [
        {
          sql: `insert into user set  ?`,
          params: fields,
        },
      ];
      const result = await Model.select(sql);
      if (result[0].affectedRows) return sendJson(res, 201, "添加用户成功");
      return sendJson(res, 400, "添加用户失败");
    });
  } catch (e) {
    return sendJson(res, 500, "服务器繁忙!");
  }
};

// 修改密码
exports.putPassword = async (req, res) => {
  const { uuid, password, newPwd, apply } = req.body;
  try {
    const user = [
      {
        sql: "select * from user where uuid = ?",
        params: uuid,
      },
    ];
    const res1 = await Model.select(user);

    if (!res1[0][0].uuid) return sendJson(res, 400, "账号不存在!");
    if (!password || !newPwd || !apply)
      return sendJson(res, 400, "密码不存在!");

    if (newPwd !== apply) return sendJson(res, 400, "密码不正确!");
    bcrypt.compare(password, res1[0][0].password, async (err, resultPwd) => {
      if (!resultPwd) return sendJson(res, 401, "密码错误!");

      const salt = 10;
      bcrypt.hash(apply, salt, async (err, hash) => {
        // 抛出错误信息
        if (err) throw new Error(err.message);
        // 插入数据  hash  加密后的密码
        const pass = [
          {
            sql: "update user set password = ? where uuid = ?",
            params: [hash, uuid],
          },
        ];
        const update = await Model.select(pass);
        if (update[0].affectedRows) return sendJson(res, 201, "修改成功!");
      });
    });
  } catch (e) {
    return sendJson(res, 500, e.message);
  }
};
