// 导入定义验证规则的模块
const expressJoi = require('@escook/express-joi');
const joi = require('@hapi/joi');

// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// 校验规则对象 - 添加分类
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
};

// 定义分类id的校验规则
const id = joi.number().min(1).required();
// 校验规则对象 - 删除分类
exports.delete_cate_schema = {
    params: {
        id
    }
};

// 校验规则对象 - 根据id获取分类
exports.get_cate_schema = {
    params: {
        id
    }
};

// 校验规则的对象 - 更新分类
exports.update_cate_schema = {
    body: {
        Id: id,
        name,
        alias
    }
};

// 定义标题、分类Id、内容、发布状态的验证规则
const title = joi.string().required();
const cate_id = joi.number().min(1).required();
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();

// 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
};