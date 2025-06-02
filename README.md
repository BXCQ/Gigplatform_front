# 厦门零工市场平台

这是一个基于uni-app框架开发的厦门零工市场平台，旨在为零工与雇主之间搭建高效、便捷的双向服务平台。通过该平台，零工可以快速找到合适的工作机会，雇主可以方便地发布岗位并找到合适的工作人员。

## 项目概述

本项目采用了现代化的移动端UI设计，同时兼顾了良好的用户体验。主要分为零工端和雇主端两个角色，实现了工作发布、搜索、申请、管理等核心功能。

### 特色功能

- **双重身份系统**：用户可以在零工和雇主身份之间自由切换
- **分类搜索**：支持按工种、区域、薪资等多维度筛选
- **实时消息**：雇主与零工之间可进行实时沟通
- **离线数据**：在网络不可用时展示示例数据，保证良好用户体验
- **评价系统**：完整的工作评价和用户评分系统

## 技术栈

- **前端框架**：Vue.js 2.x + uni-app
- **UI库**：ColorUI + 自定义组件
- **样式**：SCSS
- **状态管理**：Vuex
- **网络请求**：uni.request封装
- **地图服务**：基于位置的附近工作查询

## 项目结构

```
├── api                   // API接口
│   └── index.js          // API请求封装
├── components            // 公共组件
│   ├── custom-nav-bar.vue  // 自定义导航栏
│   ├── job-card.vue        // 岗位卡片
│   ├── job-card-compact.vue // 紧凑型岗位卡片
│   └── identity-switch.vue // 身份切换组件
├── pages                 // 页面
│   ├── index             // 首页
│   ├── jobSearch         // 岗位搜索
│   ├── jobDetail         // 岗位详情
│   ├── category          // 分类页面
│   │   ├── categoryJobs.vue    // 分类工作列表
│   │   └── categoryWorkers.vue // 分类工人列表
│   ├── message           // 消息通知
│   ├── mine              // 个人中心
│   ├── worker            // 工人详情页
│   ├── employer          // 雇主相关页面
│   │   ├── index.vue     // 雇主首页
│   │   ├── jobPost.vue   // 发布工作
│   │   ├── resume        // 简历管理
│   │   └── applications  // 申请管理
│   └── training          // 培训相关页面
├── static                // 静态资源
│   ├── img               // 图片资源
│   │   ├── category      // 分类图标
│   │   ├── icons         // 通用图标
│   │   ├── tabbar        // 底部导航图标
│   │   └── default       // 默认图片和示例图
├── store                 // 全局状态管理
├── colorui               // ColorUI组件库
└── employerPackage       // 雇主专属包
```

## 功能模块详解

### 1. 零工端

#### 首页
- 轮播广告展示
- 工作分类导航
- 热门/最新/附近工作推荐
- 快捷搜索

#### 工作搜索
- 多条件筛选（工种、区域、薪资等）
- 关键词搜索
- 分类浏览

#### 个人中心
- 简历管理
- 工作申请记录
- 收藏的工作
- 账户设置

#### 消息通知
- 系统通知
- 雇主沟通
- 申请状态更新

### 2. 雇主端

#### 企业中心
- 企业认证信息
- 已发布的工作
- 收到的申请

#### 工作管理
- 发布新工作
- 编辑已有工作
- 工作状态管理

#### 简历库
- 浏览零工简历
- 筛选合适人选
- 主动邀请

## API接口规范

项目采用了明确的API路径命名规范，使用`/xxx/action`格式统一管理接口：

- 列表查询：`/xxx/list`
- 详情获取：`/xxx/detail/:id`
- 创建操作：`/xxx/create`
- 更新操作：`/xxx/update/:id`
- 删除操作：`/xxx/delete/:id`

详细API文档请查看 [API接口文档](./API接口文档.md)

## 环境搭建与运行

### 开发环境要求
- Node.js 12.0+ 
- npm 6.0+
- HBuilderX 3.0+（推荐）

### 安装依赖

```bash
# 安装项目依赖
npm install
```

### 开发模式

```bash
# HBuilderX中运行
直接在HBuilderX中导入项目，点击运行按钮

# 命令行运行
npm run dev:h5        # H5版本
npm run dev:mp-weixin # 微信小程序版本
```

### 生产构建

```bash
# 构建H5版本
npm run build:h5

# 构建微信小程序版本
npm run build:mp-weixin
```

## 设计规范

### 色彩系统
- **主色调**：#4CAF50（绿色）
- **辅助色**：
  - 强调：#1976D2（蓝色）
  - 成功：#4CAF50（绿色）
  - 警告：#FF9800（橙色）
  - 错误：#F44336（红色）
  - 信息：#607D8B（蓝灰色）

### 字体规范
- 标题：36rpx, 加粗
- 副标题：32rpx
- 正文：28rpx
- 辅助文字：24rpx
- 小型文字：22rpx

## 贡献指南

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request

## 许可证

此项目基于MIT许可证开源 - 查看 [LICENSE.md](LICENSE.md) 获取更多详情

## 致谢

感谢所有为本项目提供支持和贡献的开发者！ 