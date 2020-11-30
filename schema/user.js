// 导入@hapi/joi 模块
const joi = require('@hapi/joi');

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含a-zA-Z0-9的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值为必须项，不能是undefined
 * patten(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/);
// 重复密码的验证规则（与密码一致）
// const repassword = joi.ref('password');
// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    // 表示需要对req.body中的数据进行验证
    body: {
        username,
        password,
        // repassword
    }
};