const Model = require(`${process.cwd()}/model/commonModel`);
const { baseUrl } = require("../config/ip");
// uuid
const { sendJson } = require(`${process.cwd()}/common/utils`);
const { v4: uuidv4 } = require("uuid");

exports.issuechange = async (req, res) => {
  let { author_id, name, need_time, difficulty, formData, foods_img, step } =
    req.body;
  step = JSON.parse(step);
  console.log(req.body);
  const uid = uuidv4();
  const params = {
    uid,
    sub_title: name.substr(0, 5),
    title: name,
    need_time: need_time,
    difficulty: difficulty,
    ingredient: formData,
    foods_img: foods_img,
  };
  const sqly = step.map((item) => {
    return {
      sql: "insert into foods_step set ?",
      params: {
        qid: uid,
        step_num: item.step_num,
        step_img: item.step_img,
        step_content: JSON.stringify(item.step_content.split(/\d+\.\s*/)),
        details_img: foods_img,
      },
    };
  });
  try {
    const sqlParamsArr = [
      {
        sql: "INSERT INTO foods_recipe set ?",
        params,
      },
      {
        sql: "INSERT INTO recipe_author set ? ",
        params: {
          recipe_id: uid,
          author_id,
        },
      },
      ...sqly,
    ];
    // return sendJson(res, 201, "创建成功", sqlParamsArr);
    const result = await Model.select(sqlParamsArr);
    console.log(result);
    if (result[result.length - 1].affectedRows) {
      return sendJson(res, 201, "发布成功");
    }
  } catch (error) {
    return sendJson(res, 500, "发布失败");
  }
};

exports.issueRecipe = async (req, res) => {
  let {
    author_id,
    sub_title,
    title,
    need_time,
    category,
    difficulty,
    ingredient,
    foods_img,
    step,
  } = req.body;
  const recipe_id = uuidv4();
  // return;
  console.log(req.body);
  const uid = uuidv4();
  const params = {
    recipe_id,
    sub_uuid: category[1],
    // sub_uuid: category,
    sub_title,
    title,
    need_time: need_time,
    difficulty,
    ingredient: JSON.stringify(ingredient),
    foods_img,
  };
  const sqly = step.map((item, i) => {
    return {
      sql: "insert into foods_step set ?",
      params: {
        recipe_id,
        step_num: i + 1,
        step_img: item.step_img,
        step_content: JSON.stringify(item.step_content.split()),
      },
    };
  });
  try {
    const sqlParamsArr = [
      {
        sql: "INSERT INTO foods_recipe set ?",
        params,
      },
      {
        sql: "INSERT INTO recipe_author set ?",
        params: {
          recipe_id,
          author_id,
        },
      },
      ...sqly,
    ];
    // return sendJson(res, 201, "创建成功", sqlParamsArr);
    const result = await Model.select(sqlParamsArr);
    console.log(result);
    if (result[result.length - 1].affectedRows) {
      return sendJson(res, 201, "发布成功");
    }
  } catch (error) {
    console.log(error);
    return sendJson(res, 500, "发布失败");
  }
};

exports.issueWork = async (req, res) => {
  let { author_id, foods_img: image_url, text_content, title } = req.body;
  const recipe_id = uuidv4();
  // return;
  console.log(req.body);
  const work_id = uuidv4();

  try {
    const sqlParamsArr = [
      {
        sql: "INSERT INTO works set ?",
        params: { author_id, image_url, text_content, title, work_id },
      },
    ];
    // return sendJson(res, 201, "创建成功", sqlParamsArr);
    const result = await Model.select(sqlParamsArr);
    console.log(result);
    if (result[0].affectedRows) {
      return sendJson(res, 201, "发布成功");
    }
  } catch (error) {
    console.log(error);
    return sendJson(res, 500, "发布失败");
  }
};
