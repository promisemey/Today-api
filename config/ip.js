const os = require("os");
const port = normalizePort(process.env.PORT || "3000");

/**
 * 将端口规范化为数字、字符串或false
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

//获取本机ip
let getIPAdress = function () {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
};

const ip = getIPAdress();
const baseUrl = `http://${ip}:${port}`;

module.exports = {
  ip,
  port,
  baseUrl,
};

