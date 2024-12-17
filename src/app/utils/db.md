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


# 数据库结构设计

## Users 表（用户表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 用户ID，主键，自增 |
| name | VARCHAR(255) | 用户姓名 |
| email | VARCHAR(255) | 邮箱地址，唯一 |
| phone | VARCHAR(20) | 手机号，唯一 |
| password_hash | VARCHAR(255) | 加密后的密码 |
| role | VARCHAR(50) | 用户角色（学生、教师、系统管理员、游客） |
| avatar | VARCHAR(255) | 头像URL |
| status | ENUM | 账号状态(active/inactive/suspended) |
| created_at | TIMESTAMP | 创建时间 |
| login_attempts | INT | 登录尝试次数，默认0 |

## Courses 表（课程表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 课程ID，主键，自增 |
| title | VARCHAR(255) | 课程标题 |
| description | TEXT | 课程描述 |
| thumbnail | VARCHAR(255) | 课程封面图URL |
| total_hours | INT | 总课时 |
| instructor_id | INT | 教师ID，外键关联Users表 |
| status | ENUM | 课程状态(draft/published/archived) |
| price | DECIMAL(10,2) | 课程价格 |
| created_at | TIMESTAMP | 创建时间 |
| author | VARCHAR(255) | 课程作者名字 |
| updated_at | TIMESTAMP | 更新时间，默认为当前时间并在更新时自动更新 |
| likes | INT | 收藏人数，默认为0 |
| registration_count | INT | 注册人数，默认为0 |


## Chapters 表（课程章节表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 章节ID，主键，自增 |
| course_id | INT | 课程ID，外键关联Courses表 |
| title | VARCHAR(255) | 章节标题 |
| sort_order | INT | 排序顺序 |

## Resources 表（学习资源表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 资源ID，主键，自增 |
| chapter_id | INT | 章节ID，外键关联Chapters表 |
| title | VARCHAR(255) | 资源标题 |
| type | ENUM | 资源类型(document/video/audio/code/other) |
| content_url | VARCHAR(255) | 资源URL |
| duration | INT | 视频/音频时长（秒） |
| sort_order | INT | 排序顺序 |
| created_at | TIMESTAMP | 创建时间 |

## Assignments 表（作业表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 作业ID，主键，自增 |
| course_id | INT | 课程ID，外键关联Courses表 |
| chapter_id | INT | 章节ID，外键关联Chapters表 |
| title | VARCHAR(255) | 作业标题 |
| description | TEXT | 作业描述 |
| deadline | TIMESTAMP | 截止时间 |
| submission_type | ENUM | 提交类型(text/file/both) |
| max_score | INT | 满分值 |
| created_at | TIMESTAMP | 创建时间 |

## AssignmentSubmissions 表（作业提交记录表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 提交ID，主键，自增 |
| assignment_id | INT | 作业ID，外键关联Assignments表 |
| user_id | INT | 用户ID，外键关联Users表 |
| content | TEXT | 文本内容 |
| file_url | VARCHAR(255) | 文件URL |
| score | INT | 得分 |
| feedback | TEXT | 教师反馈 |
| status | ENUM | 状态(submitted/graded/returned) |
| submitted_at | TIMESTAMP | 提交时间 |
| graded_at | TIMESTAMP | 批改时间 |

## Discussions 表（讨论表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 讨论ID，主键，自增 |
| course_id | INT | 课程ID，外键关联Courses表 |
| user_id | INT | 用户ID，外键关联Users表 |
| title | VARCHAR(255) | 讨论标题 |
| content | TEXT | 讨论内容 |
| created_at | TIMESTAMP | 创建时间 |

## DiscussionReplies 表（讨论回复表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 回复ID，主键，自增 |
| discussion_id | INT | 讨论ID，外键关联Discussions表 |
| user_id | INT | 用户ID，外键关联Users表 |
| content | TEXT | 回复内容 |
| created_at | TIMESTAMP | 创建时间 |

## Enrollments 表（课程注册表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 注册记录ID，主键，自增 |
| user_id | INT | 学生ID，外键关联Users表 |
| course_id | INT | 课程ID，外键关联Courses表 |
| completed_hours | INT | 已完成课时 |
| last_studied_at | TIMESTAMP | 最后学习时间 |
| enrollment_date | TIMESTAMP | 注册时间 |
| last_chapter_id | INT | 最后学习章节ID，外键关联Chapters表 |
| last_resource_id | INT | 最后学习资源ID，外键关联Resources表 |

## LearningProgress 表（学习进度记录表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 记录ID，主键，自增 |
| user_id | INT | 用户ID，外键关联Users表 |
| resource_id | INT | 资源ID，外键关联Resources表 |
| progress | INT | 进度(0-100) |
| last_position | INT | 视频播放位置（秒） |
| completed | BOOLEAN | 是否完成 |
| last_accessed_at | TIMESTAMP | 最后访问时间 |

## Exercises 表（练习题表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 练习题ID，主键，自增 |
| chapter_id | INT | 章节ID，外键关联Chapters表 |
| question | TEXT | 题目内容 |
| type | ENUM | 题目类型(single_choice/multiple_choice/true_false/fill_blank/short_answer/text) |
| options | JSON | 选项内容 |
| answer | TEXT | 正确答案 |
| explanation | TEXT | 答案解释 |
| score | INT | 分值 |

## ExerciseAttempts 表（练习答题记录表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 记录ID，主键，自增 |
| exercise_id | INT | 练习题ID，外键关联Exercises表 |
| user_id | INT | 用户ID，外键关联Users表 |
| answer | TEXT | 学生答案 |
| is_correct | BOOLEAN | 是否正确 |
| score | INT | 得分 |
| attempted_at | TIMESTAMP | 答题时间 |

## Grades 表（成绩表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 成绩记录ID，主键，自增 |
| user_id | INT | 学生ID，外键关联Users表 |
| course_id | INT | 课程ID，外键关联Courses表 |
| grade | DECIMAL(5,2) | 课程成绩，支持两位小数 |

## 表关系说明
1. Users 和 Courses：
   - 通过 instructor_id 关联教师
   - 通过 Enrollments 表关联学生
2. Courses 和 Chapters：一对多关系
3. Chapters 和 Resources：一对多关系
4. Courses 和 Assignments：一对多关系
5. Users 和 Assignments：通过 AssignmentSubmissions 关联
6. Courses 和 Discussions：一对多关系
7. Users 和 Discussions：
   - 通过 Discussions 表关联发帖
   - 通过 DiscussionReplies 表关联回复
8. Users 和 Resources：通过 LearningProgress 表记录学习进度
9. Chapters 和 Exercises：一对多关系
10. Users 和 Exercises：通过 ExerciseAttempts 表记录答题情况

这种表结构设计支持：
- 完整的课程内容组织（章节、资源）
- 作业管理和提交
- 课程讨论功能
- 详细的学习进度跟踪
- 练习题系统
- 成绩管理
