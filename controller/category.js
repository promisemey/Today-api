const categoryModel = require(`${process.cwd()}/model/category`);
const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { v4: uuidv4 } = require("uuid");
const { sendJson } = require(`${process.cwd()}/common/utils`);

// 导出一级分类处理逻辑
exports.getCategory = async (req, res) => {
  try {
    const sqlParams = [
      {
        sql: "select * from foods_category",
      },
    ];
    const result = await Model.select(sqlParams);
    console.log(result);
    if (result[0].length)
      return sendJson(res, 200, "一级分类查询成功", result[0]);
    return sendJson(res, 400, "分类不存在");
  } catch (e) {
    throw new Error("一级分类查询异常", e);
  }
};

exports.getSubcategory = async (req, res) => {
  try {
    const { category_id } = req.query; // 获取一级分类ID
    const sqlParams = [
      {
        sql: "SELECT * FROM foods_subcategory WHERE category_id = ?",
        params: category_id,
      },
    ];
    const sql = "";
    const result = await Model.select(sqlParams);
    if (result[0].length)
      return sendJson(res, 200, "二级分类查询成功", result[0]);
    return sendJson(res, 400, "分类不存在");
  } catch (e) {
    return sendJson(res, 500, "网络繁忙!");
  }
};

// 查询联动分类数据
exports.getLinkCategory = async (req, res) => {
  try {
    const sql = `SELECT 
    fc.category_id AS categoryId, 
    fc.level as plevel,
    fc.category_name AS categoryName, 
    fsc.subcategory_name AS subcategoryName, 
    fsc.level as slevel,
    fsc.subcategory_id AS subcategoryId, 
    fd.* 
    FROM foods_category fc 
    JOIN foods_subcategory fsc ON fc.category_id = fsc.category_id
    JOIN foods_dish fd ON fsc.sub_uuid = fd.dish_uuid`;
    const sqlParamsArr = [{ sql }];
    const result = await categoryModel.select(sqlParamsArr);
    if (result[0].length) {
      // 构建数据格式
      // const categoryList = [];
      const categoryList = result[0].reduce((acc, cur) => {
        const category = acc.find((c) => c.categoryId === cur.categoryId);
        if (category) {
          category.children.push({
            categoryId: cur.dish_uuid,
            categoryName: cur.subcategoryName,
            subcategoryId: cur.subcategoryId,
            level: cur.slevel,
            subcategoryName: cur.subcategoryName,
            dish_id: cur.dish_id,
            dish_uuid: cur.dish_uuid,
            name: cur.subcategoryName,
            description: cur.description,
            image_url: baseUrl + cur.image_url,
          });
        } else {
          acc.push({
            categoryId: cur.categoryId,
            categoryName: cur.categoryName,
            level: cur.plevel,
            children: [
              {
                categoryId: cur.dish_uuid,
                categoryName: cur.subcategoryName,
                subcategoryId: cur.subcategoryId,
                level: cur.slevel,
                subcategoryName: cur.subcategoryName,
                dish_id: cur.dish_id,
                dish_uuid: cur.dish_uuid,
                name: cur.subcategoryName,
                description: cur.description,
                image_url: baseUrl + cur.image_url,
              },
            ],
          });
        }
        return acc;
      }, []);
      return sendJson(res, 200, "联动分类查询成功!", categoryList);
    }
    return sendJson(res, 400, "联动分类查询失败!");
  } catch (e) {}
};

exports.putSubCategory = async (req, res) => {
  const { dish_uuid } = req.body;

  try {
    const fields = Object.entries(req.body)
      .filter(
        (field) =>
          field[0] !== "dish_uuid" && field[1] !== "" && field[1] !== undefined
      )
      .map((value) => `${value[0]} = '${value[1]}'`)
      .join(", ");
    const sqlParamsArr = [
      {
        sql: `UPDATE foods_subcategory fs
        JOIN foods_dish fd ON fs.sub_uuid = fd.dish_uuid
        SET ${fields}
        WHERE fd.dish_uuid = ?;`,
        params: dish_uuid,
      },
    ];
    console.log(sqlParamsArr);
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) return sendJson(res, 201, "菜谱分类修改成功");
  } catch (e) {
    return sendJson(res, 500, "菜谱分类修改失败!");
  }
};

// 删除分类
exports.deleteSubCate = async (req, res) => {
  const { sub_uuid } = req.query;
  try {
    const sqlParamsArr = [
      {
        sql: "DELETE FROM foods_subcategory where sub_uuid = ?",
        params: sub_uuid,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) {
      return sendJson(res, 200, "分类删除成功");
    }
  } catch (e) {
    return sendJson(res, 500, "系统分类,禁止删除!");
  }
};

// 创建分类
exports.postSubCate = async (req, res) => {
  const { category_id, subcategory_name, description, image_url } = req.body;
  const sub_uuid = uuidv4();
  try {
    const sqlParamsArr = [
      {
        sql: "insert into foods_subcategory set ?",
        params: { category_id, subcategory_name, sub_uuid },
      },
      {
        sql: "insert into foods_dish set ?",
        params: { dish_uuid: sub_uuid, description, image_url },
      },
    ];
    const result = await Model.select(sqlParamsArr);
    if (result[0].affectedRows) {
      return sendJson(res, 201, "分类创建成功");
    }
  } catch (e) {
    return sendJson(res, 500, "分类创建失败!");
  }
};
// 创建分类
exports.getSubList = async (req, res) => {
  const { dash_uuid } = req.query;
  console.log(dash_uuid);
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
        where sub_uuid = ?`.toLocaleLowerCase(),
        params: dash_uuid,
      },
    ];
    const result = await Model.select(sqlParamsArr);
    console.log(result[0].length);
    if (result[0].length) {
      return sendJson(res, 200, "菜谱分类搜索成功", result[0]);
    }
  } catch (e) {
    return sendJson(res, 500, "菜谱搜索失败!");
  }
};

