// 一、导入模块
const mysql = require("mysql");

// 创建MySQL连接池
const configObj = require(process.cwd() + "/common/config.json").db_config;
const pool = mysql.createPool({
  host: configObj.host,
  user: configObj.user,
  password: configObj.pwd,
  database: configObj.dbname,
});

// 二、封装执行SQL命令方法
function query(sql, callback) {
  // 从连接池获取连接
  pool.getConnection((err, conn) => {
    // 判断获取状态
    if (err) {
      callback(err, null);
    } else {
      // 实现多条数据库查询
      if (Array.isArray(sql)) {
        const dataArr = [];
        sql.forEach((item, i) => {
          conn.query(item, (err, datas) => {
            dataArr.push(datas);
            if (i === sql.length - 1) {
              callback(err, dataArr);
            }
          });
        });
        return conn.release();
      }
      conn.query(sql, (err, datas) => {
        conn.release();
        callback(err, datas);
      });
    }
  });
}

// // 连接池升级版
// function queryPlus(sql, params, callback) {
//   // 使用连接池来获取连接对象
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.log(err);
//       return callback(err, null);
//     } else {
//       // 如果 params 参数为 undefined，将其设为 null
//       if (params === undefined) {
//         params = null;
//       }
//       // 执行查询操作
//       connection.query(sql, params, (err, rows) => {
//         connection.release(); // 释放连接对象
//         if (err) {
//           console.log(err);
//           return callback(err, null);
//         } else {
//           return callback(null, rows);
//         }
//       });
//     }
//   });
// }

function queryPlus(sqlParamsArr, callback) {
  // 使用连接池来获取连接对象
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    } else {
      // 将每个查询操作封装成 Promise
      const promises = sqlParamsArr.map((sqlParams) => {
        let { sql, params } = sqlParams;

        return new Promise((resolve, reject) => {
          connection.query(sql, params, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      });
      // 执行所有的查询操作，并将结果合并成一个数组返回
      Promise.all(promises)
        .then((results) => {
          connection.release(); // 释放连接对象
          return callback(null, results);
        })
        .catch((err) => {
          connection.release(); // 释放连接对象
          return callback(err, null);
        });
    }
  });
}

// 三、导出方法
module.exports = { query, queryPlus };
