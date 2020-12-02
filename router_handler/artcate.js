// 导入数据库操作模块
const expressJoi = require('@escook/express-joi');
const db = require('../db/index');


// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete为 0 表示没有被标记为删除的数据
    const sql = "select * from ev_article_cate where is_delete=0 order by id asc";
    // 执行sql语句
    db.query(sql, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results
        });
    });
};

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查询 分类名称和分类别名是否被占用的sql语句
    const sql = "select * from ev_article_cate where name=? or alias=?";
    // 执行sql语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(res);
        }
        // 分类名称和分类别名都被占用
        if (results.length === 2) {
            return res.cc('分类名称和别名被占用，请更换后重试！');
        }
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名称和别名被占用，请更换后重试！');
        }
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用，请更换后重试！');
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用，请更换后重试！');
        }

        // 新增文章分类
        // 定义新增文章分类的SQL语句
        const insertSql = 'insert into ev_article_cate set ?';
        // 执行新增文章分类的sql语句
        db.query(insertSql, req.body, (err, results) => {
            // 执行sql失败
            if (err) {
                return res.cc(err);
            }
            // 语句执行成功，但是影响行数不等于1
            if (results.affectedRows !== 1) {
                return res.cc('新增文章分类失败！');
            }
            // 新增文章分类成功
            return res.cc('新增文章分类成功！', 0);
        });
    });
};

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    console.log(req);
    // 定义删除文章分类的sql
    const sql = 'update ev_article_cate set is_delete=1 where id=?';
    // 执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行sql失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功，但是影响行数不等于1
        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败！');
        }

        // 删除文章分类成功
        return res.cc('删除文章分类成功', 0);
    });
};

// 根据id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // 定义根据id获取文章分类的sql语句
    const sql = "select * from ev_article_cate where id=?";
    // 执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功，但是查到的数据条数不等于1
        if (results.length !== 1) {
            return res.cc('获取文章分类失败！');
        }
        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类成功！',
            data: results[0]
        });
    });
};

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用sql
    const sql = "select * from ev_article_cate where Id<>? and (name=? or alias=?)";
    // 执行sql语句
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行sql失败
        if (err) {
            return res.cc(err);
        }
        // 分类名称 和 分类别名都被占用
        if (results.length === 2) {
            return res.cc('分类名称和别名被占用，请更换后重试！');
        }
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名称和别名被占用，请更换后重试！');
        }
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用，请更换后重试！');
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用，请更换后重试！');
        }

        // 更新文章分类信息
        // 定义更新文章分类的sql
        const updateSql = "update ev_article_cate set ? where Id=?";
        // 执行sql语句
        db.query(updateSql, [req.body, req.body.Id], (err, results) => {
            // 执行sql语句失败
            if (err) {
                return res.cc(err);
            }
            // 执行sql语句成功，但是影响行数不等于1
            if (results.affectedRows !== 1) {
                return res.cc('更新文章分类失败！');
            }
            // 更新文章分类成功
            return res.cc('更新文章分类成功！', 0);
        });
    });
};