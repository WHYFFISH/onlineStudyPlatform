# 认证接口文档

## 登录接口

### 接口地址
`POST /api/login`

### 请求体参数
```json
{
  "username": "string", // 用户名或手机号
  "password": "string", // 密码
  "role": "string"      // 用户角色
}
```

### 响应情况

#### 登录成功 (200 OK)类似下述
```json
{
    "message": "登录成功",
    "user": {
        "id": 9,
        "name": "testuser",
        "email": "test@example.com",
        "role": "student",
        "avatar": null,
        "status": "active",
        "created_at": "2024-12-17T05:31:53.000Z",
        "login_attempts": 1,
        "phone": "13800138002"
    }
}
```

#### 登录失败场景 (401 未授权)
1. 账号不存在
```json
{
  "error": "账号不存在或角色不匹配"
}
```

2. 账号已冻结
```json
{
  "error": "账号已被冻结，请联系管理员"
}
```

3. 密码错误
```json
{
  "error": "密码错误，还剩X次尝试机会",
  "remainingAttempts": "number" // 剩余登录尝试次数
}
```

#### 服务器错误 (500 内部服务器错误)
```json
{
  "error": "登录失败，请稍后重试"
}
```

## 用户注册/密码重置接口

### 接口地址
`POST /api/register`

### 请求体参数（新用户注册）
```json
{
  "username": "string", // 可选
  "password": "string", // 必填
  "email": "string",    // 可选
  "phone": "string",    // 必填
  "role": "string"      // 必填
}
```
username（学生注册这个必填）
email（老师注册这个必填）
**如果已经存在了，则进行密码修改操作**

### 请求体参数（密码重置）
```json
{
  "username": "string", // 已存在的用户名
  "password": "string", // 新密码
  "phone": "string"     // 可选（用于更新手机号）
}
```

### 响应情况

#### 注册成功 (200 OK)
```json
{
  "message": "注册成功",
  "userId": "number",
  "role": "string",
  "name": "string"
}
```

#### 密码重置成功 (200 OK)
```json
{
  "message": "密码修改成功",
  "userId": "number"
}
```

#### 注册/重置失败场景 (400 错误请求)
1. 手机号已被注册
```json
{
  "error": "手机号已被其他用户注册"
}
```

#### 服务器错误 (500 内部服务器错误)
```json
{
  "error": "操作失败，请稍后重试"
}
```

## 附加说明
### 修改密码
- 是直接使用的/api/register接口（我后端会进行判断，如果是学生会查询用户名是否存在，如果是老师会查询邮箱是否存在）

### 注册操作建议
- 在使用/api/register接口时，想要使用接口判断验证码是否正确

### 登录尝试规则
- 最大登录尝试次数：3次
- 3次失败尝试后，账号将被冻结
- 成功登录会重置登录尝试次数为0

### 账号状态
- `active`：正常状态
- `suspended`：已冻结的账号

## 安全考虑
- 密码使用bcrypt进行哈希加密
- 响应中不返回敏感用户信息
- 跟踪和监控登录尝试次数
