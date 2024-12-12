我来帮你编写一个完整的数据库使用文档。以下是建议的内容：

```markdown:src/app/utils/db.md
# 数据库使用文档

## 基本配置

数据库模块使用 MySQL2 作为驱动，采用连接池方式管理数据库连接。配置信息位于 `src/app/utils/db.js`。

## 使用方法

### 1. 导入模块

```javascript
const { query, pool } = require('../utils/db');
```

### 2. 执行查询

#### 基本查询
```javascript
// 简单查询示例
const users = await query('SELECT * FROM users WHERE status = ?', ['active']);

// 插入数据示例
const result = await query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    ['张三', 'zhangsan@example.com']
);

// 更新数据示例
const updateResult = await query(
    'UPDATE users SET status = ? WHERE id = ?',
    ['inactive', 1]
);
```

## 错误处理

推荐的错误处理方式：

```javascript
try {
    const results = await query('SELECT * FROM users WHERE id = ?', [userId]);
    // 处理结果
} catch (error) {
    console.error('查询失败:', error.message);
    // 进行适当的错误处理
}
```
