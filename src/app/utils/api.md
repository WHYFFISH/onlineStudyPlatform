# API 路由文档

## 课程相关接口

### 1. 获取课程列表 
**路径**: `/api/courses`  
**方法**: `GET`  
**参数**:
- `keyword`: 搜索关键词（可选）
- `status`: 课程状态（可选）
- `instructor_id`: 教师ID（可选）

**返回数据**:
```json
[
  {
    "id": "课程ID",
    "title": "课程标题",
    "description": "课程描述",
    "thumbnail": "课程封面",
    "total_hours": "总课时",
    "status": "课程状态",
    "price": "课程价格",
    "instructor_name": "教师姓名",
    "instructor_id": "教师ID",
    "registration_count": "注册人数"
  }
]
```

### 2. 获取课程详情
**路径**: `/api/courses/[id]`  
**方法**: `GET`  
**返回数据**:
```json
{
  "id": "课程ID",
  "title": "课程标题",
  "description": "课程描述",
  "thumbnail": "课程封面",
  "total_hours": "总课时",
  "instructor_name": "教师姓名",
  "instructor_avatar": "教师头像",
  "schoolPanel": {
    "name": "学校名称",
    "imgUrl": "学校logo"
  },
  "teachers": [
    {
      "name": "教师姓名",
      "avatar": "教师头像"
    }
  ],
  "assignments": [
    {
      "id": "作业ID",
      "title": "作业标题",
      "status": "作业状态",
      "due_date": "截止日期"
    }
  ],
  "announcements": [
    {
      "title": "公告标题",
      "content": "公告内容",
      "created_at": "创建时间"
    }
  ]
}
```

### 3. 获取课程章节
**路径**: `/api/courses/[id]/chapters`  
**方法**: `GET`  
**返回数据**:
```json
[
  {
    "id": "章节ID",
    "title": "章节标题",
    "total_resources": "资源总数",
    "completed_resources": "已完成资源数",
    "resources": [
      {
        "id": "资源ID",
        "title": "资源标题",
        "type": "资源类型",
        "completed": "是否完成",
        "progress": "学习进度",
        "last_position": "最后学习位置"
      }
    ]
  }
]
```

## 课程注册相关接口

### 1. 课程注册
**路径**: `/api/enrollments`  
**方法**: `POST`  
**请求体**:
```json
{
  "courseId": "课程ID"
}
```

**返回数据**:
```json
{
  "message": "注册成功"
}
```

### 2. 获取已注册课程
**路径**: `/api/enrollments/my-courses`  
**方法**: `GET`  
**返回数据**:
```json
[
  {
    "id": "课程ID",
    "title": "课程标题",
    "description": "课程描述",
    "thumbnail": "课程封面",
    "total_hours": "总课时",
    "instructor_name": "教师姓名",
    "progress": "完成进度",
    "completed_hours": "已完成课时",
    "last_studied_at": "最后学习时间",
    "enrollment_date": "注册时间"
  }
]
```

## 学习统计相关接口

### 1. 获取学习统计
**路径**: `/api/study-stats`  
**方法**: `GET`  
**返回数据**:
```json
{
  "studyTime": [
    {
      "date": "日期",
      "hours": "学习时长"
    }
  ],
  "progress": [
    {
      "name": "课程名称",
      "progress": "完成进度"
    }
  ],
  "deadlines": [
    {
      "title": "任务标题",
      "date": "截止日期",
      "courseName": "课程名称"
    }
  ],
  "stats": {
    "totalCourses": "总课程数",
    "totalHours": "总学习时长",
    "avgProgress": "平均进度",
    "completedCourses": "已完成课程数"
  }
}
```

## 待办任务相关接口

### 1. 获取待完成任务
**路径**: `/api/tasks/pending`  
**方法**: `GET`  
**参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认5）

**返回数据**:
```json
{
  "tasks": [
    {
      "type": "任务类型",
      "id": "任务ID",
      "title": "任务标题",
      "courseName": "课程名称",
      "deadline": "截止日期",
      "status": "任务状态"
    }
  ],
  "total": "总任务数",
  "page": "当前页码",
  "totalPages": "总页数"
}
```

注意：所有接口目前都使用了硬编码的用户ID（1），在实际生产环境中应该从session或token中获取用户ID。
