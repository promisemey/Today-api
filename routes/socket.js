const { baseUrl } = require("../config/ip");
const Model = require(`${process.cwd()}/model/commonModel`);
let intervalId = null;
exports.getFavorite = (ws) => {
  // 监听客户端发送的消息

  console.log("WebSocket client connected111");
  // 每次WebSocket连接建立后开始轮询
  intervalId = setInterval(async () => {
    try {
      const sqlParamsArr = [
        {
          sql: `SELECT * FROM websocket_messages FOR UPDATE`,
        },
      ];

      const result = await Model.select(sqlParamsArr);
      if (result[0].length) {
        return sendJson(res, 200, "取消收藏成功", result[0]);
      }
      return sendJson(res, 404, "未找到收藏关系");
    } catch (e) {
      return sendJson(res, 500, "服务器异常");
    }
    // db.query(
    //   "SELECT * FROM websocket_messages FOR UPDATE",
    //   (error, results) => {
    //     if (error) {
    //       console.error(error);
    //       return;
    //     }
    //     // 遍历查询结果并发送到WebSocket客户端
    //     results.forEach((row) => {
    //       const message = row.message;
    //       try {
    //         ws.send(message);
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     });
    //   }
    // );
  }, 1000);

  //   ws.on("message", async (message) => {
  //     try {
  //       const data = JSON.parse(message);
  //       const { action, payload } = data;

  //       if (action === "getFavorites") {
  //         const { user_id } = payload;

  //         const sqlParamsArr = [
  //           {
  //             sql: `select DISTINCT
  //               uuid,username,uid,concat('${baseUrl}',user.avatar) as avatar,sub_title,concat('${baseUrl}',foods_img) AS foods_img,need_time,difficulty,ingredient,fr.create_time
  //               from foods_recipe  as fr
  //               JOIN recipe_author as fa
  //               ON fr.uid=fa.recipe_id
  //               JOIN USER
  //               on fa.author_id = user.uuid
  //               join foods_step on
  //               foods_step.qid = fr.uid
  //               join favorites on favorites.recipe_id = fr.uid
  //               where user_id = ?
  //               `,
  //             params: user_id,
  //           },
  //         ];

  //         const result = await Model.select(sqlParamsArr);

  //         if (result[0].length) {
  //           const response = {
  //             success: true,
  //             message: "查询收藏成功",
  //             data: result[0],
  //           };

  //           ws.send(JSON.stringify(response));
  //         } else {
  //           const response = { success: false, message: "查询收藏失败" };
  //           ws.send(JSON.stringify(response));
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       const response = { success: false, message: "服务器异常" };
  //       ws.send(JSON.stringify(response));
  //     }
  //   });
};

exports.close = () => {
  console.log("WebSocket client disconnected");
  // WebSocket连接关闭时停止轮询
  clearInterval(intervalId);
};
