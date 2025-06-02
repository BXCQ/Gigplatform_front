# 厦门零工平台 API 接口文档

## 基础信息

- 基础URL: `http://localhost:8080/api`
- 请求格式: JSON
- 响应格式: JSON

## 通用返回格式

```json
{
  "code": 200,       // 状态码，200表示成功
  "message": "成功",  // 响应消息
  "data": {}         // 响应数据
}
```

## 用户认证相关

### 登录

- **URL**: `/auth/login`
- **方法**: POST
- **请求参数**:

```json
{
  "username": "string",  // 用户名/手机号
  "password": "string"   // 密码
}
```

- **响应**:

```json
{
  "token": "string",       // JWT token
  "userInfo": {
    "id": "string",        // 用户ID
    "username": "string",  // 用户名
    "role": "string",      // 角色: employer/worker
    "avatar": "string"     // 头像URL
  }
}
```

### 注册

- **URL**: `/auth/register`
- **方法**: POST
- **请求参数**:

```json
{
  "username": "string",    // 用户名
  "password": "string",    // 密码
  "phone": "string",       // 手机号
  "verifyCode": "string",  // 短信验证码
  "role": "string"         // 角色: employer/worker
}
```

- **响应**: 与登录接口相同

### 获取短信验证码

- **URL**: `/auth/sms-code/send`
- **方法**: POST
- **请求参数**:

```json
{
  "phone": "string"  // 手机号
}
```

- **响应**:

```json
{
  "expireTime": 300  // 验证码有效期(秒)
}
```

### 验证短信验证码

- **URL**: `/auth/sms-code/verify`
- **方法**: POST
- **请求参数**:

```json
{
  "phone": "string",  // 手机号
  "code": "string"    // 验证码
}
```

- **响应**:

```json
{
  "valid": true  // 是否有效
}
```

### 获取用户信息

- **URL**: `/users/profile`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
{
  "id": "string",
  "username": "string",
  "avatar": "string",
  "phone": "string",
  "role": "string",
  "createTime": "string",
  "lastLoginTime": "string"
}
```

## 雇主相关API

### 获取雇主信息

- **URL**: `/employers/profile`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
{
  "id": "string",
  "name": "string",
  "avatar": "string",
  "phone": "string",
  "companyName": "string",    // 公司名称，个人雇主可能为空
  "creditScore": 100,         // 信用评分
  "certification": "string",  // 认证状态: none/pending/verified
  "address": "string",        // 地址
  "jobsPosted": 10,           // 已发布工作数
  "workerHired": 5            // 已雇佣工人数
}
```

### 更新雇主信息

- **URL**: `/employers/profile/update`
- **方法**: PUT
- **请求参数**:

```json
{
  "name": "string",
  "avatar": "string",
  "companyName": "string",
  "address": "string"
}
```

- **响应**: 更新后的雇主信息

### 发布工作

- **URL**: `/jobs/create`
- **方法**: POST
- **请求参数**:

```json
{
  "jobType": "string",         // 工作类型名称
  "jobTypeId": "string",       // 工作类型ID
  "salary": "number",          // 工资
  "salaryMin": "number",       // 最低工资(可选)
  "salaryMax": "number",       // 最高工资(可选)
  "workerCount": "number",     // 招工人数
  "address": "string",         // 地址
  "addressDetail": "string",   // 详细地址
  "location": {                // 位置坐标
    "latitude": "number",
    "longitude": "number"
  },
  "gender": "string",          // 性别要求: none/male/female
  "content": "string",         // 工作内容
  "startTime": "string",       // 开始时间
  "endTime": "string",         // 结束时间
  "images": ["string"],        // 工作环境图片URL数组
  "payLabor": "boolean",       // 是否支付劳务费
  "paymentType": "string",     // 结算方式: 日结/周结/月结/完工结
  "urgent": "boolean",         // 是否急招
  "hotJob": "boolean",         // 是否热招
  "publishType": "string"      // 发布类型: personal/company
}
```

- **响应**:

```json
{
  "id": "string",  // 工作ID
  "createdAt": "string"  // 创建时间
}
```

### 获取雇主发布的工作列表

- **URL**: `/employers/jobs/list`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
  - `status`: 状态筛选
- **响应**:

```json
{
  "total": 20,
  "pages": 2,
  "currentPage": 1,
  "list": [
    {
      "id": "string",
      "title": "string",
      "salary": "string",
      "workerCount": 5,
      "address": "string",
      "status": "string",
      "applicantCount": 10,
      "createdAt": "string",
      "urgent": true
    }
  ]
}
```

### 获取工作详情

- **URL**: `/jobs/detail/{jobId}`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
{
  "id": "string",
  "title": "string",
  "salary": "string",
  "salaryMin": "number",
  "salaryMax": "number",
  "workerCount": 5,
  "address": "string",
  "addressDetail": "string",
  "location": {
    "latitude": "number",
    "longitude": "number"
  },
  "gender": "string",
  "content": "string",
  "startTime": "string",
  "endTime": "string",
  "images": ["string"],
  "payLabor": true,
  "paymentType": "string",
  "urgent": true,
  "hotJob": true,
  "status": "string",
  "createdAt": "string",
  "employer": {
    "id": "string",
    "name": "string",
    "avatar": "string",
    "companyName": "string",
    "creditScore": 100
  }
}
```

### 更新工作信息

- **URL**: `/jobs/update/{jobId}`
- **方法**: PUT
- **请求参数**: 同发布工作接口
- **响应**: 更新后的工作详情

### 删除工作

- **URL**: `/jobs/delete/{jobId}`
- **方法**: DELETE
- **请求参数**: 无
- **响应**:

```json
{
  "success": true
}
```

### 获取工作申请人列表

- **URL**: `/jobs/applicants/list/{jobId}`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
- **响应**:

```json
{
  "total": 20,
  "pages": 2,
  "currentPage": 1,
  "list": [
    {
      "id": "string",           // 申请ID
      "workerId": "string",     // 工人ID
      "workerName": "string",   // 工人姓名
      "workerAvatar": "string", // 工人头像
      "appliedAt": "string",    // 申请时间
      "status": "string",       // 申请状态
      "age": 28,                // 年龄
      "gender": "string",       // 性别
      "experience": "string"    // 工作经验
    }
  ]
}
```

### 接受工作申请

- **URL**: `/jobs/applicants/accept/{jobId}/{applicantId}`
- **方法**: POST
- **请求参数**: 无
- **响应**:

```json
{
  "success": true
}
```

### 拒绝工作申请

- **URL**: `/jobs/applicants/reject/{jobId}/{applicantId}`
- **方法**: POST
- **请求参数**: 无
- **响应**:

```json
{
  "success": true
}
```

## 工人相关API

### 获取工人信息

- **URL**: `/workers/profile`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
{
  "id": "string",
  "name": "string",
  "avatar": "string",
  "phone": "string",
  "gender": "string",
  "age": 28,
  "skills": ["string"],
  "experience": "string",
  "education": "string",
  "certification": "string",
  "address": "string",
  "rating": 4.8,
  "jobsCompleted": 20
}
```

### 更新工人信息

- **URL**: `/workers/profile/update`
- **方法**: PUT
- **请求参数**:

```json
{
  "name": "string",
  "avatar": "string",
  "gender": "string",
  "age": 28,
  "skills": ["string"],
  "experience": "string",
  "education": "string",
  "address": "string"
}
```

- **响应**: 更新后的工人信息

### 获取工人申请列表

- **URL**: `/workers/applications/list`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
  - `status`: 状态筛选
- **响应**:

```json
{
  "total": 20,
  "pages": 2,
  "currentPage": 1,
  "list": [
    {
      "id": "string",                // 申请ID
      "jobId": "string",             // 工作ID
      "jobTitle": "string",          // 工作标题
      "salary": "string",            // 工资
      "address": "string",           // 地址
      "employerId": "string",        // 雇主ID
      "employerName": "string",      // 雇主名称
      "employerAvatar": "string",    // 雇主头像
      "appliedAt": "string",         // 申请时间
      "status": "string"             // 申请状态: pending/accepted/rejected
    }
  ]
}
```

### 申请工作

- **URL**: `/jobs/apply/{jobId}`
- **方法**: POST
- **请求参数**:

```json
{
  "message": "string"  // 申请留言(可选)
}
```

- **响应**:

```json
{
  "id": "string",      // 申请ID
  "appliedAt": "string"  // 申请时间
}
```

### 取消工作申请

- **URL**: `/workers/applications/cancel/{applicationId}`
- **方法**: DELETE
- **请求参数**: 无
- **响应**:

```json
{
  "success": true
}
```

## 通用工作API

### 获取工作列表

- **URL**: `/jobs/list`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
  - `search`: 搜索关键词
  - `category`: 分类ID
  - `minSalary`: 最低工资
  - `maxSalary`: 最高工资
  - `distance`: 距离(公里)
  - `latitude`: 纬度
  - `longitude`: 经度
  - `gender`: 性别要求
  - `payType`: 结算方式
  - `urgent`: 是否急招(true/false)
  - `hotJob`: 是否热招(true/false)
- **响应**:

```json
{
  "total": 100,
  "pages": 10,
  "currentPage": 1,
  "list": [
    {
      "id": "string",
      "title": "string",
      "salary": "string",
      "address": "string",
      "distance": "string",  // 距离，如"1.2km"
      "startTime": "string",
      "endTime": "string",
      "urgent": true,
      "hotJob": true,
      "paymentType": "string",
      "publishTime": "string",
      "employerName": "string",
      "employerAvatar": "string"
    }
  ]
}
```

### 获取推荐工作

- **URL**: `/jobs/recommended/list`
- **方法**: GET
- **请求参数**:
  - `limit`: 数量, 默认5
- **响应**: 同工作列表

### 获取附近工作

- **URL**: `/jobs/nearby/list`
- **方法**: GET
- **请求参数**:
  - `latitude`: 纬度(必填)
  - `longitude`: 经度(必填)
  - `distance`: 距离(公里), 默认5
  - `limit`: 数量, 默认5
- **响应**: 同工作列表

### 获取最新工作

- **URL**: `/jobs/latest/list`
- **方法**: GET
- **请求参数**:
  - `limit`: 数量, 默认5
- **响应**: 同工作列表

## 工人/零工列表API

### 获取工人列表

- **URL**: `/workers/list`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
  - `search`: 搜索关键词
  - `category`: 分类ID
  - `skills`: 技能(多个用逗号分隔)
  - `minAge`: 最小年龄
  - `maxAge`: 最大年龄
  - `gender`: 性别
  - `experience`: 经验要求
  - `distance`: 距离(公里)
  - `latitude`: 纬度
  - `longitude`: 经度
- **响应**:

```json
{
  "total": 100,
  "pages": 10,
  "currentPage": 1,
  "list": [
    {
      "id": "string",
      "name": "string",
      "avatar": "string",
      "gender": "string",
      "age": 28,
      "skills": ["string"],
      "experience": "string",
      "address": "string",
      "distance": "string",  // 距离，如"1.2km"
      "rating": 4.8,
      "jobsCompleted": 20
    }
  ]
}
```

### 获取工人详情

- **URL**: `/workers/detail/{workerId}`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
{
  "id": "string",
  "name": "string",
  "avatar": "string",
  "gender": "string",
  "age": 28,
  "skills": ["string"],
  "experience": "string",
  "education": "string",
  "certification": "string",
  "address": "string",
  "rating": 4.8,
  "jobsCompleted": 20,
  "recentJobs": [
    {
      "id": "string",
      "title": "string",
      "employerName": "string",
      "completedAt": "string"
    }
  ]
}
```

## 分类/类目API

### 获取所有分类

- **URL**: `/categories/list`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
[
  {
    "id": "string",
    "name": "string",
    "icon": "string",
    "jobCount": 100
  }
]
```

### 获取分类下的工作

- **URL**: `/categories/jobs/list/{categoryId}`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
- **响应**: 同工作列表

### 获取分类下的工人

- **URL**: `/categories/workers/list/{categoryId}`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
- **响应**: 同工人列表

## 评价/评论API

### 提交评价

- **URL**: `/reviews/create`
- **方法**: POST
- **请求参数**:

```json
{
  "jobId": "string",       // 工作ID
  "targetId": "string",    // 评价对象ID(工人ID或雇主ID)
  "targetType": "string",  // 评价对象类型: worker/employer
  "rating": 5,             // 评分(1-5)
  "content": "string"      // 评价内容
}
```

- **响应**:

```json
{
  "id": "string",         // 评价ID
  "createdAt": "string"   // 创建时间
}
```

### 获取工作的评价

- **URL**: `/jobs/reviews/list/{jobId}`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
- **响应**:

```json
{
  "total": 20,
  "pages": 2,
  "currentPage": 1,
  "list": [
    {
      "id": "string",
      "jobId": "string",
      "authorId": "string",
      "authorName": "string",
      "authorAvatar": "string",
      "targetId": "string",
      "targetName": "string",
      "targetType": "string",
      "rating": 5,
      "content": "string",
      "createdAt": "string"
    }
  ]
}
```

### 获取工人的评价

- **URL**: `/workers/reviews/list/{workerId}`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
- **响应**: 同工作评价

### 获取雇主的评价

- **URL**: `/employers/reviews/list/{employerId}`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
- **响应**: 同工作评价

## 消息通知API

### 获取通知列表

- **URL**: `/notifications/list`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
  - `isRead`: 是否已读(true/false)
- **响应**:

```json
{
  "total": 20,
  "pages": 2,
  "currentPage": 1,
  "list": [
    {
      "id": "string",
      "type": "string",       // 通知类型: system/job/review
      "title": "string",      // 通知标题
      "content": "string",    // 通知内容
      "isRead": false,        // 是否已读
      "createdAt": "string",  // 创建时间
      "relatedId": "string",  // 关联ID(如jobId)
      "relatedUrl": "string"  // 关联URL
    }
  ]
}
```

### 标记通知为已读

- **URL**: `/notifications/read/{notificationId}`
- **方法**: POST
- **请求参数**: 无
- **响应**:

```json
{
  "success": true
}
```

### 标记所有通知为已读

- **URL**: `/notifications/read-all`
- **方法**: POST
- **请求参数**: 无
- **响应**:

```json
{
  "success": true,
  "count": 10      // 已标记的通知数量
}
```

## 轮播图API

### 获取轮播图列表

- **URL**: `/banners/list`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
[
  {
    "id": "string",
    "imageUrl": "string",    // 图片URL
    "url": "string",         // 点击跳转链接
    "title": "string",       // 标题
    "sort": 1                // 排序
  }
]
```

## 保险相关API

### 获取保险列表

- **URL**: `/insurances/list`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
[
  {
    "id": "string",
    "name": "string",         // 保险名称
    "description": "string",  // 保险描述
    "price": 100,             // 价格
    "coverage": 10000,        // 保障金额
    "period": 30,             // 保障期(天)
    "coverageDetails": [      // 保障详情
      {
        "title": "string",
        "content": "string"
      }
    ]
  }
]
```

### 购买保险

- **URL**: `/insurances/purchase/{insuranceId}`
- **方法**: POST
- **请求参数**:

```json
{
  "name": "string",       // 被保人姓名
  "idCard": "string",     // 身份证号
  "phone": "string",      // 联系电话
  "period": 30,           // 购买期限(天)
  "paymentMethod": "string"  // 支付方式: wechat/alipay
}
```

- **响应**:

```json
{
  "orderId": "string",     // 订单ID
  "paymentUrl": "string",  // 支付链接
  "amount": 100,           // 支付金额
  "expireTime": 1800       // 订单过期时间(秒)
}
```

### 获取用户已购保险

- **URL**: `/users/insurances/list`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
[
  {
    "id": "string",
    "insuranceId": "string",
    "insuranceName": "string",  // 保险名称
    "orderNo": "string",        // 订单号
    "name": "string",           // 被保人姓名
    "idCard": "string",         // 身份证号(掩码)
    "startDate": "string",      // 开始日期
    "endDate": "string",        // 结束日期
    "status": "string",         // 状态: active/expired
    "purchasedAt": "string"     // 购买时间
  }
]
```

## 培训相关API

### 获取培训列表

- **URL**: `/trainings/list`
- **方法**: GET
- **请求参数**:
  - `page`: 页码, 默认1
  - `limit`: 每页数量, 默认10
  - `category`: 分类ID
- **响应**:

```json
{
  "total": 20,
  "pages": 2,
  "currentPage": 1,
  "list": [
    {
      "id": "string",
      "title": "string",         // 培训标题
      "cover": "string",         // 封面图
      "category": "string",      // 分类
      "startDate": "string",     // 开始日期
      "endDate": "string",       // 结束日期
      "price": 0,                // 价格，0表示免费
      "enrolled": 50,            // 已报名人数
      "maxEnrollment": 100,      // 最大报名人数
      "level": "string",         // 难度级别: beginner/intermediate/advanced
      "isOnline": true           // 是否线上培训
    }
  ]
}
```

### 获取培训详情

- **URL**: `/trainings/detail/{trainingId}`
- **方法**: GET
- **请求参数**: 无
- **响应**:

```json
{
  "id": "string",
  "title": "string",
  "cover": "string",
  "category": "string",
  "startDate": "string",
  "endDate": "string",
  "price": 0,
  "enrolled": 50,
  "maxEnrollment": 100,
  "level": "string",
  "isOnline": true,
  "location": "string",         // 培训地点(线下培训)
  "description": "string",      // 培训描述
  "trainer": {                  // 讲师信息
    "id": "string",
    "name": "string",
    "avatar": "string",
    "title": "string",
    "description": "string"
  },
  "chapters": [                 // 培训章节
    {
      "title": "string",
      "duration": 60,           // 时长(分钟)
      "content": "string"       // 章节内容
    }
  ],
  "isEnrolled": false           // 当前用户是否已报名
}
```

### 报名培训

- **URL**: `/trainings/enroll/{trainingId}`
- **方法**: POST
- **请求参数**:

```json
{
  "paymentMethod": "string"  // 支付方式: wechat/alipay, 免费培训可不传
}
```

- **响应**:

```json
{
  "enrollmentId": "string",   // 报名ID
  "orderId": "string",        // 订单ID(付费培训)
  "paymentUrl": "string",     // 支付链接(付费培训)
  "amount": 100,              // 支付金额(付费培训)
  "expireTime": 1800          // 订单过期时间(秒)(付费培训)
}
```

## 文件上传API

### 上传文件

- **URL**: `/upload/file`
- **方法**: POST
- **Content-Type**: multipart/form-data
- **请求参数**:
  - `file`: 文件
- **响应**:

```json
{
  "url": "string",   // 文件URL
  "size": 1024,      // 文件大小(字节)
  "mimeType": "string"  // 文件类型
}
``` 