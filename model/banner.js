// 导入连接池方法
const { queryPlus } = require(`${process.cwd()}/common/db`);

// 删除
// const select = (sql, data) => {
const select = (sqlParamsArr) => {
  return new Promise((resolve, reject) => {
    queryPlus(sqlParamsArr, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`横幅表查询报错:${err}`);
        reject(0);
      }
      // 查询成功
      resolve(result);
    });
  });
};

// 导出
module.exports = {
  select,
};
