// 导入连接池方法
const { query } = require(`${process.cwd()}/common/db`);
const { createTree } = require(`${process.cwd()}/common/utils`);

exports.select = ({ city_id = 1, district_name = "" }) => {
  return new Promise((resolve, reject) => {
    const sql = `select * from district where 1=1 and district_sqe like '%.${city_id}.%' and district_name like '%${district_name}%'`;

    query(sql, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`用户表查询报错:${err}`);
        reject([]);
      }
      // 查询成功
      if (!result.length) return resolve({});
      if (district_name) return resolve({ id: 1, result });
      // const resultByid = createTree(result, result[0].pid);
      resolve({ id: 2, result: createTree(result, result[0].pid) });
    });
  });
};

exports.selectOne = ({ hierarchy = 2, pid = 1 }) => {
  console.log(hierarchy, pid);

  return new Promise((resolve, reject) => {
    const sql = `select * from district where 1=1 and hierarchy=${hierarchy} and pid = ${pid}`;

    query(sql, (err, result) => {
      // 处理错误信息
      if (err) {
        console.log(`地区表查询报错:${err}`);
        reject([]);
      }
      // 查询成功
      if (result.length) {
        const nResult = [];
        result.forEach((item) => {
          item.children = [];
          nResult.push(item);
        });

        return resolve(nResult);
      }
      // 不存在
      return resolve([]);
    });
  });
};
