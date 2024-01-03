const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { sendJson } = require(`${process.cwd()}/common/utils`);
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const setting = require(`${process.cwd()}/config/setting`);

// const indexRouter = require('./routes/index');
// 导入路由模块
const usersRouter = require("./routes/users");
const districtRouter = require("./routes/district");
const foodsInfoRouter = require("./routes/foodsInfo");
const uploadRouter = require("./routes/upload");
const postServeIpRouter = require("./routes/postServeIp");
// 分类
const categoryRouter = require("./routes/category");
// banner
const bannerRouter = require("./routes/banner");
// banner
const authorRouter = require("./routes/author");
// 作品
const worksRouter = require("./routes/works");
// 菜谱
const recipeRouter = require("./routes/recipe");
// 粉丝
const followsRouter = require("./routes/follows");
// 发布
const issueRouter = require("./routes/issue");
// 发布
const favoritesRouter = require("./routes/favorites");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/users", usersRouter);
app.use("/api", districtRouter);
app.use("/serve", postServeIpRouter);
app.use("/category", categoryRouter);
app.use("/banner", bannerRouter);
app.use("/author", authorRouter);
app.use("/works", worksRouter);
app.use("/recipe", recipeRouter);
app.use("/follows", followsRouter);
app.use("/issue", issueRouter);
app.use("/favorites", favoritesRouter);
app.use("/foods", foodsInfoRouter);
// token验证
app.use((req, res, next) => {
  // 获取token
  let token = req.headers.token || req.query.token || req.body.token;
  console.log("token =>>", token);
  // token
  if (req.url.includes("/static")) return sendJson(res, 403, "地址不存在");
  if (!token) return sendJson(res, 401, "Token不存在");
  jwt.verify(token, setting.token.signKey, (err, decode) => {
    if (err) return sendJson(res, 403, "Token无效");
    req.jwt = decode;
    next();
  });
});

app.use("/upload", uploadRouter);

// 捕获解析  jwt  失败产生的错误
app.use((err, req, res, next) => {
  // 判断是否 由 Token 解析失败导致
  if (err.name === "MulterError") {
    return sendJson(res, 500, "文件大小最大为20M");
  }
  if (err.name == "UnauthorizedError") {
    return sendJson(res, 401, "无效的Token");
  }
  return sendJson(res, 500, "未知错误!");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
