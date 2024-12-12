const mysql = require('mysql2/promise');

// 数据库连接配置
const dbConfig = {
    host: 'szu-uooc111.rwlb.rds.aliyuncs.com',
    port: 3306,
    user: 'jack',
    password: 'Jack123456',
    database: 'uooc',
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试连接
pool.getConnection()
    .then(connection => {
        console.log('数据库连接成功！');
        connection.release();
    })
    .catch(err => {
        console.error('数据库连接失败:', err.message);
    });

// 导出查询函数
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('查询执行错误:', error.message);
        throw error;
    }
}

module.exports = {
    query,
    pool
}; 