// 导入数据库操作模块
const db = require('../db/index');

// 导入 bcryptjs模块
const bcrypt = require('bcryptjs');

//获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义sql语句
    // 根据用户的id，查询用户的基本信息
    // 注意，为了防止用户密码的泄露，需要排除password字段
    const sql = "select id,username,nickname,email,user_pic from ev_users where id=?";
    // 调用db.query()执行sql语句
    // 注意，req对象上的user属性，是token解析成功，express-jwt中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功，但是查询到的数据条数不等于1
        if (results.length !== 1) {
            return res.cc('获取用户信息失败！');
        }
        // 将用户信息响应给客户
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0]
        });
    });
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 定义待执行的SQL语句
    const sql = 'update ev_users set ? where id=?';
    // 调用db.query()执行sql语句并传参
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功，但影响行数不为1
        if (results.affectedRows !== 1) {
            return res.cc('修改用户基本信息失败！');
        }
        // 修改用户基本信息成功
        return res.cc('修改用户基本信息成功！', 0);
    });
};

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
    // 定义根据id 查询用户数据的SQL语句
    const sql = "select * from ev_users where id=?";
    // 执行sql语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 检查指定id的用户是否存在
        if (results.length !== 1) {
            return res.cc('用户不存在！');
        }
        // 使用bcrypt.compareSync(提交的密码，数据库中的密码)方法验证输入的原密码是否正确
        // bcrypt.compareSync()函数范围true表示密码正确，false表示不一致不正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) {
            return res.cc('原密码不正确！');
        }
        // 定义更新用户密码的sql语句
        const updatSql = 'update ev_users set password=? where id=?';
        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        // 执行sql语句，根据id更新用户的密码
        db.query(updatSql, [newPwd, req.user.id], (err, results) => {
            // 执行sql语句失败
            if (err) {
                return res.cc(err);
            }
            // sql语句执行成功，但是影响行数不等于1
            if (results.affectedRows !== 1) {
                return res.cc('更新密码失败！');
            }
            // 更新密码成功
            return res.cc('更新密码成功！', 0);
        });
    });
};

// 更新头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义更新头像的sql语句
    const sql = "update ev_users set user_pic=? where id=?";
    // 执行sql语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行sql失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功，但是影响行数不等于1
        if (results.affectedRows !== 1) {
            return res.cc('更新头像失败！');
        }
        // 更新头像成功
        return res.cc('更新头像成功！', 0);
    });
};