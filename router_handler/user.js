// 在这里定义和用户相关的路由处理函数，供/router/user.js模块进行调用

// 导入数据库操作模块
const db = require('../db/index');

// 导入 bcryptjs 模块
const bcrypt = require('bcryptjs');

// 导入 jsonwebtoken包
// 用这个包来生成token字符串
const jwt = require('jsonwebtoken');
// 导入secret配置文件
const config = require('../config');

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body;
    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空！');
    }
    // 检测用户名是否被占用
    // 定义sql语句
    const sql = "select * from ev_users where username=?";
    //执行sql语句并根据结果判断用户名是否被占用
    db.query(sql, userinfo.username, (err, results) => {
        // 执行sql失败
        if (err) {
            return res.cc(err);
        }
        // 用户名被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名');
        }
        // 用户名可以使用
        // 调用bcrypt.hashSync(明文密码，随机盐的长度)方法，对用户的密码进行加密处理
        // 对用户密码进行bcrypt加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);

        // 插入新用户
        // 定义插入用户的sql语句
        const insertSql = 'insert into ev_users set?';
        // 执行sql语句插入新用户
        db.query(insertSql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                return res.cc('注册失败，请稍后再试！');
            }
            // 注册成功
            res.send({
                status: 0,
                message: '注册成功！'
            });
        });
    });
};

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body;
    // 定义sql语句
    const sql = 'select * from ev_users where username=?';
    // 执行sql语句，查询用户的数据
    db.query(sql, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err);
        }
        // 执行sql语句成功
        // 查询到的数据条数不等于1
        if (results.length !== 1) {
            return res.cc('登陆失败！');
        }
        // 查询到的数据条数为1
        // 判断用户输入的登陆密码是否和数据库中的密码一致
        // 调用bcrypt.compareSync(用户提交的密码，数据库中的密码)方法比较密码是否一致
        // 返回true表示一致，false表示不一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        // 返回false ，表示密码错误
        if (!compareResult) {
            return res.cc('密码错误，登陆失败！');
        }
        // 登录成功，生成token字符串
        // 生成token字符串的时候，要剔除密码和头像
        // 剔除密码和头像之后，user中只保留了用户的id、username、nickname
        const user = {...results[0], password: '', user_pic: '' };
        // 生成Token字符串
        // token有效期为10小时
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' });
        // 将生成的Token字符串相应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用token，在服务器直接拼接上Bearer的前缀
            token: 'Bearer ' + tokenStr
        })

    });
};