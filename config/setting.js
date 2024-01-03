module.exports = {
  token: {
    // 秘钥
    signKey: 'sun_promise_token_key_-v-',
    // 过期时间
    signTime: 3600 * 24 * 7,
    // signTime: 5,
    // 请求头参数
    header: 'token',
    // 不用校检的路由
    unRoute: ['/api/user/login', '/api/user/registry'],
  },
};
