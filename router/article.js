// 导入express
const express = require('express');

// 创建路由对象
const router = express.Router();

// 导入解析 formdata 格式表单数据的包
const multer = require('multer');
// 导入处理路径的核心模块
const path = require('path');

// 创建multer的实例对象，通过dest属性指定文件的存放路径
const uploads = multer({ dest: path.join(__dirname, '../uploads') });

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章的验证模块
const { add_article_schema } = require('../schema/article');

// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article');
// 发布新文章
// uploads.single()是一个局部生效的中间件，用来解析formData格式的表单数据
// 将文件类型的数据，解析并挂载到req.file属性中
// 将文本类型的数据，解析并挂载到req.body属性中
// 当前路由中使用了两个中间件，先使用multer解析表单数据，再使用expressJoi对解析的表单数据进行验证
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle);

// 向外共享路由模块
module.exports = router;