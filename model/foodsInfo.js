// 导入连接池方法
const { query } = require(`${process.cwd()}/common/db`);
const { baseUrl } = require("../config/ip");
exports.select = (params, uuid) => {
  uuid = uuid ? `and uuid = '${uuid}'` : "";
  console.log("=>>>", uuid);
  const { pagenum = 1, pagesize = 10, recipe_id } = params;
  const start = (pagenum - 1) * pagesize;
  return new Promise((resolve, reject) => {
    let sql = [
      `select DISTINCT
      uuid,username,concat('${baseUrl}',user.avatar) as avatar,fr.recipe_id,sub_title,title,concat('${baseUrl}',foods_img) AS foods_img,need_time,difficulty,ingredient,fr.create_time
      from foods_recipe  as fr 
      JOIN recipe_author as fa
      ON fr.recipe_id=fa.recipe_id
      JOIN USER 
      on fa.author_id = user.uuid
      join foods_step on
			foods_step.recipe_id = fr.recipe_id where 1 ${uuid}
      order by fr.create_time limit ${start},${pagesize} `,
      `select count(DISTINCT fr.recipe_id) as total 
			from foods_recipe  as fr 
      JOIN recipe_author as fa 
      ON fr.recipe_id=fa.recipe_id
      JOIN USER 
      on fa.author_id = user.uuid
			join foods_step on
			foods_step.recipe_id = fr.recipe_id where 1 ${uuid}`,
    ];
    // let sql = `select * from ((select count(*) from foods_menu) total,(select * from foods_menu limit ${start},${pagesize}) list)`;
    if (recipe_id) {
      sql = `select * from foods_recipe left join foods_step on foods_recipe.recipe_id = foods_step.recipe_id where foods_recipe.recipe_id = '${recipe_id}'`;
    }
    query(sql, (err, result) => {
      // 处理错误信息
      if (err) {
        reject([]);
      }
      // 查询成功
      resolve(result);
    });
  });
};
