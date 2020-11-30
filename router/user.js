// 导入express模块
const express = require('express');

// 创建路由对象
const router = express.Router();

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user');

// 导入@escook/express-joi模块
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user');

// 注册新用户
// 在注册新用户的路由总，声明局部中间件，对当前请求中携带的数据进行验证
// 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 数据验证失败后，终止后续代码的执行，并抛出一个全局的Error错误，进行全局错误级别中间件进行处理
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser);

// 登录
// 检测登陆表单的数据是否合法
router.post('/login', expressJoi(reg_login_schema), userHandler.login);

// 将路由对象共享出去
module.exports = router;