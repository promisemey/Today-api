// 导入连接池方法
const { query, queryPlus } = require(`${process.cwd()}/common/db`);
const { baseUrl } = require("../config/ip");

/**
 *
 * @param data {string}
 * @return promise
 */
const insert = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `insert into user(uuid,username, password, sex, avatar, address, phone, createtime) values ${data}`;
    query(sql, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`用户表插入报错:${err}`);
        reject(0);
      }
      // 插入成功
      resolve(result.affectedRows);
    });
  });
};

// 修改用户
// 修改
const updateUser = (data) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE user SET ? WHERE uuid = ?";
    const sqlParamsArr = [
      {
        sql,
        params: data,
      },
    ];
    queryPlus(sqlParamsArr, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`用户表修改报错:${err}`);
        reject(0);
      }
      // 修改成功
      resolve(result[0].affectedRows);
    });
  });
};

// 修改
const update = (data) => {
  return new Promise((resolve, reject) => {
    const { username, gender, avatar, address, phone, birth } = data;
    console.log(address);
    const sql = `update user SET  gender = '${gender}', avatar = '${avatar}', address = '${address}', phone = '${phone}', birth = '${birth}'
    WHERE username = '${username}';`;
    query(sql, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`用户表修改报错:${err}`);
        reject(0);
      }
      console.log(result);
      // 修改成功
      resolve(result.affectedRows);
    });
  });
};

// 查询
const select = (where) => {
  return new Promise((resolve, reject) => {
    const sql = `select DISTINCT *,concat('${baseUrl}',avatar) as avatar from user where ${
      where ?? "1=1"
    }`;
    query(sql, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`用户表查询报错:${err}`);
        reject([]);
      }
      // 查询成功
      resolve(result);
    });
  });
};

// 删除
const del = () => {};

const findAllFoods = (sqlParamsArr) => {
  return new Promise((resolve, reject) => {
    queryPlus(sqlParamsArr, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`查找用户菜谱报错:${err}`);
        reject(0);
      }
      // 查询成功
      resolve(result);
    });
  });
};

// 导出
module.exports = {
  insert,
  update,
  updateUser,
  select,
  del,
  findAllFoods,
};
