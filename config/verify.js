const jwt = require("jsonwebtoken");
const setting = require("./setting");

const setToken = (role) => {
  return new Promise((resolve) => {
    let token = jwt.sign({ role }, setting.token.signKey, {
      expiresIn: setting.token.signTime,
    });
    resolve(token);
  });
};

const verifyToken = (token) => {
  return new Promise((resolve) => {
    jwt.verify(token, setting.token.signKey, (err, decoded) => {
      // Token无效或过期
      if (err) throw new Error("Invalid or expired token:", err);
      resolve(decoded);
    });
  });
};

module.exports.verify = {
  // 设置token
  setToken,
  verifyToken,
};
