# 智慧零工平台前端系统

[![Vue.js](https://img.shields.io/badge/Vue.js-2.6.11-brightgreen.svg)](https://vuejs.org/)
[![uni-app](https://img.shields.io/badge/uni--app-3.0-blue.svg)](https://uniapp.dcloud.io/)
[![ColorUI](https://img.shields.io/badge/ColorUI-2.1.6-orange.svg)](https://github.com/weilanwl/ColorUI)
[![微信小程序](https://img.shields.io/badge/微信小程序-支持-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![H5](https://img.shields.io/badge/H5-支持-blue.svg)](https://www.w3.org/html/)

## 项目简介

智慧零工平台前端系统是一个基于uni-app框架开发的跨平台移动端应用，支持微信小程序和H5双端运行。平台旨在为零工与雇主之间搭建高效、便捷的双向服务平台，通过现代化的移动端UI设计，为用户提供流畅的工作发布、搜索、申请、管理等全流程服务体验。

### 核心特性

- 🔄 **双重身份系统**: 用户可在零工和雇主身份间自由切换
- 📱 **跨平台支持**: 支持微信小程序和H5，一套代码多端运行
- 🎨 **现代化UI**: 基于ColorUI设计，界面美观、交互流畅
- 🔍 **智能搜索**: 支持多维度筛选（工种、区域、薪资等）
- 💬 **实时通信**: 雇主与零工间实时消息交流
- 📍 **地理定位**: 基于位置的附近工作推荐
- 📊 **离线支持**: 网络不可用时展示示例数据
- ⭐ **评价系统**: 完整的工作评价和信誉体系

## 技术栈

### 核心框架
- **Vue.js 2.6.11** - 渐进式JavaScript框架
- **uni-app 3.0** - 跨平台开发框架
- **ColorUI 2.1.6** - 高颜值UI组件库

### 开发工具
- **SCSS/SASS** - CSS预处理器
- **Vuex** - 状态管理模式
- **uni.request** - 网络请求封装
- **webpack** - 模块打包工具

### 平台支持
- **微信小程序** - 原生小程序体验
- **H5** - 移动端网页应用
- **App** - 原生应用（可扩展）

## 项目架构

```
smart-gig-platform-front/
├── api/                          # API接口层
│   └── index.js                  # 统一请求封装
├── components/                   # 公共组件
│   ├── custom-nav-bar.vue        # 自定义导航栏
│   ├── job-card.vue              # 工作卡片组件
│   ├── job-card-compact.vue      # 紧凑型工作卡片
│   ├── identity-switch.vue       # 身份切换组件
│   ├── employer-navbar.vue       # 雇主导航栏
│   ├── employer-tabbar.vue       # 雇主底部导航
│   └── common-filter.vue         # 通用筛选组件
├── pages/                        # 页面文件
│   ├── index/                    # 首页模块
│   │   └── index.vue             # 主页面
│   ├── jobSearch/                # 工作搜索
│   │   └── jobSearch.vue         # 搜索页面
│   ├── jobDetail/                # 工作详情
│   │   └── jobDetail.vue         # 详情页面
│   ├── category/                 # 分类模块
│   │   ├── categoryJobs.vue      # 分类工作列表
│   │   └── categoryWorkers.vue   # 分类工人列表
│   ├── mine/                     # 个人中心
│   │   ├── mine.vue              # 个人主页
│   │   ├── applications.vue      # 申请记录
│   │   ├── myApplications.vue    # 我的申请
│   │   ├── feedback.vue          # 意见反馈
│   │   └── insurance.vue         # 保险中心
│   ├── login/                    # 登录注册
│   │   ├── login.vue             # 登录页面
│   │   ├── register.vue          # 注册页面
│   │   └── reset-password.vue    # 密码重置
│   ├── worker/                   # 工人相关
│   │   └── workerDetail.vue      # 工人详情
│   ├── employer/                 # 雇主相关
│   │   ├── index.vue             # 雇主首页
│   │   ├── jobPost.vue           # 发布工作
│   │   ├── jobManage.vue         # 工作管理
│   │   ├── certification.vue     # 企业认证
│   │   ├── jobs/                 # 工作管理模块
│   │   │   ├── list.vue          # 工作列表
│   │   │   ├── detail.vue        # 工作详情
│   │   │   └── jobDetail.vue     # 工作管理详情
│   │   ├── resume/               # 简历模块
│   │   │   ├── index.vue         # 简历列表
│   │   │   └── detail.vue        # 简历详情
│   │   └── personal/             # 个人信息
│   │       └── detail.vue        # 个人详情
│   └── training/                 # 培训模块
│       └── training.vue          # 培训页面
├── employerPackage/              # 雇主专属分包
│   └── pages/                    # 雇主页面
│       ├── center/               # 雇主中心
│       ├── postJob/              # 发布工作
│       └── resume/               # 简历管理
├── static/                       # 静态资源
│   ├── img/                      # 图片资源
│   │   ├── category/             # 分类图标
│   │   ├── icons/                # 通用图标
│   │   ├── tabbar/               # 底部导航图标
│   │   ├── employer/             # 雇主专用图标
│   │   └── default/              # 默认图片
│   └── logo.png                  # 应用Logo
├── store/                        # 状态管理
│   └── index.js                  # Vuex配置
├── colorui/                      # ColorUI组件库
│   ├── main.css                  # 主样式文件
│   ├── icon.css                  # 图标样式
│   ├── animation.css             # 动画样式
│   └── components/               # UI组件
├── src/                          # 源码备份目录
├── unpackage/                    # 编译输出目录
├── pages.json                    # 页面配置文件
├── manifest.json                 # 应用配置文件
├── App.vue                       # 应用入口文件
├── main.js                       # 程序入口文件
├── uni.scss                      # 全局样式变量
├── package.json                  # 项目依赖配置
└── README.md                     # 项目说明文档
```

## 核心功能模块

### 1. 用户身份系统
- **身份切换**: 零工/雇主身份无缝切换
- **用户认证**: 手机号登录、短信验证
- **资料管理**: 个人信息、头像上传
- **实名认证**: 身份证验证、企业认证

### 2. 零工端功能

#### 工作发现
- **首页推荐**: 轮播广告、热门工作、最新工作
- **分类浏览**: 按行业分类查看工作机会
- **地理位置**: 基于位置推荐附近工作
- **搜索筛选**: 关键词搜索、多条件筛选

#### 工作申请
- **快速申请**: 一键申请心仪工作
- **申请跟踪**: 实时查看申请状态
- **历史记录**: 申请历史和结果查看
- **收藏管理**: 收藏感兴趣的工作

#### 个人中心
- **简历管理**: 完善个人技能和经验
- **培训中心**: 参与技能培训课程
- **保险中心**: 购买工作保险
- **消息通知**: 接收工作相关通知

### 3. 雇主端功能

#### 工作管理
- **发布工作**: 详细的工作信息发布
- **工作编辑**: 随时修改工作要求
- **状态管理**: 工作上下线、完成状态
- **申请处理**: 查看和处理工人申请

#### 人才发现
- **简历库**: 浏览工人简历信息
- **人才筛选**: 按技能、经验筛选
- **主动邀请**: 向合适工人发送邀请
- **评价系统**: 对工人进行评价

#### 企业管理
- **企业认证**: 营业执照等资质认证
- **订单管理**: 查看历史雇佣记录
- **财务统计**: 支出统计和分析
- **客服沟通**: 平台客服支持

### 4. 通用功能

#### 消息系统
- **实时聊天**: 雇主与工人实时沟通
- **系统通知**: 平台公告和系统消息
- **状态提醒**: 申请、审核状态变更提醒
- **消息历史**: 聊天记录和通知历史

#### 地图定位
- **位置服务**: 获取用户当前位置
- **附近工作**: 显示附近的工作机会
- **地址选择**: 工作地点选择和导航
- **区域筛选**: 按区域范围筛选工作

## 页面路由配置

### 主包页面
```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": { "navigationBarTitleText": "智慧零工" }
    },
    {
      "path": "pages/jobSearch/jobSearch", 
      "style": { "navigationBarTitleText": "搜索工作" }
    },
    {
      "path": "pages/mine/mine",
      "style": { "navigationBarTitleText": "个人中心" }
    }
  ]
}
```

### 分包配置
```json
{
  "subPackages": [
    {
      "root": "employerPackage",
      "name": "employer",
      "pages": [
        {
          "path": "pages/center/index",
          "style": { "navigationBarTitleText": "雇主中心" }
        }
      ]
    }
  ]
}
```

## API接口集成

### 接口配置
```javascript
// api/index.js
const BASE_URL = 'https://lgpt.ybyq.wang/api'

export const request = (options) => {
  return uni.request({
    url: BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    }
  })
}
```

### 主要接口模块
- **用户认证**: `/auth/login`, `/auth/register`, `/auth/sms-code`
- **工作管理**: `/jobs/list`, `/jobs/detail`, `/jobs/apply`
- **用户管理**: `/users/profile`, `/worker-profiles`, `/employer-profiles`
- **文件上传**: `/upload/image`, `/upload/file`
- **消息通知**: `/notifications/list`, `/notifications/read`

## 样式规范

### 设计系统
```scss
// uni.scss - 全局样式变量
$primary-color: #4CAF50;     // 主色调
$success-color: #4CAF50;     // 成功色
$warning-color: #FF9800;     // 警告色
$danger-color: #F44336;      // 危险色
$info-color: #2196F3;        // 信息色

// 间距规范
$spacing-xs: 10rpx;
$spacing-sm: 20rpx;
$spacing-md: 30rpx;
$spacing-lg: 40rpx;
$spacing-xl: 60rpx;

// 字体规范
$font-size-xs: 22rpx;
$font-size-sm: 24rpx;
$font-size-base: 28rpx;
$font-size-lg: 32rpx;
$font-size-xl: 36rpx;
```

### 组件样式
```scss
// 工作卡片样式示例
.job-card {
  background: #fff;
  border-radius: 12rpx;
  padding: $spacing-md;
  margin: $spacing-sm;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  
  &-title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: #333;
  }
  
  &-salary {
    color: $primary-color;
    font-size: $font-size-lg;
    font-weight: bold;
  }
}
```

## 快速开始

### 环境要求
- **Node.js** 14.0+ 或更高版本
- **npm** 6.0+ 或 **yarn** 1.0+
- **HBuilderX** 3.0+ （推荐使用官方IDE）
- **微信开发者工具** （开发小程序时需要）

### 安装与运行

1. **克隆项目**
```bash
git clone https://github.com/BXCQ/Gigplatform_front.git
cd Gigplatform_front
```

2. **安装依赖**
```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

3. **开发模式**
```bash
# H5开发
npm run dev:h5
# 访问 http://localhost:8080

# 微信小程序开发
npm run dev:mp-weixin
# 在微信开发者工具中导入 unpackage/dist/dev/mp-weixin
```

4. **生产构建**
```bash
# 构建H5版本
npm run build:h5

# 构建微信小程序版本  
npm run build:mp-weixin

# 构建App版本
npm run build:app-plus
```

### 使用HBuilderX开发

1. **导入项目**
   - 打开HBuilderX
   - 文件 → 导入 → 从本地目录导入
   - 选择项目根目录

2. **运行项目**
   - 选择要运行的平台（H5/微信小程序/App）
   - 点击工具栏的运行按钮
   - 选择对应的运行环境

3. **发布项目**
   - 点击工具栏的发行按钮
   - 选择发布平台和配置
   - 等待构建完成

## 部署指南

### H5部署

1. **构建生产版本**
```bash
npm run build:h5
```

2. **部署到服务器**
```bash
# 上传 unpackage/dist/build/h5 目录到服务器
scp -r unpackage/dist/build/h5/* user@server:/www/wwwroot/your-domain/
```

3. **Nginx配置示例**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /www/wwwroot/your-domain;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass https://lgpt.ybyq.wang/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 微信小程序发布

1. **构建小程序版本**
```bash
npm run build:mp-weixin
```

2. **使用微信开发者工具**
   - 导入 `unpackage/dist/build/mp-weixin` 目录
   - 配置小程序AppID
   - 点击上传提交审核

3. **小程序配置**
```json
{
  "appid": "your-app-id",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "postcss": true,
    "minified": true
  },
  "permissions": {
    "scope.userLocation": {
      "desc": "获取位置信息用于推荐附近工作"
    }
  }
}
```

## 配置说明

### 应用配置 (manifest.json)
```json
{
  "name": "智慧零工平台",
  "appid": "__UNI__XXXXXX",
  "description": "专业的零工服务平台",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3
  },
  "h5": {
    "title": "智慧零工平台",
    "template": "index.html",
    "publicPath": "/",
    "devServer": {
      "port": 8080,
      "proxy": {
        "/api": {
          "target": "https://lgpt.ybyq.wang",
          "changeOrigin": true,
          "secure": true
        }
      }
    }
  },
  "mp-weixin": {
    "appid": "your-weixin-appid",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "获取位置信息用于推荐附近工作"
      }
    }
  }
}
```

### 页面配置 (pages.json)
```json
{
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "智慧零工",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#4CAF50",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/img/tabbar/home.png",
        "selectedIconPath": "static/img/tabbar/homeactive.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/mine/mine",
        "iconPath": "static/img/tabbar/me.png", 
        "selectedIconPath": "static/img/tabbar/meactive.png",
        "text": "我的"
      }
    ]
  }
}
```

## 开发指南

### 新增页面

1. **创建页面文件**
```bash
mkdir pages/new-page
touch pages/new-page/new-page.vue
```

2. **页面模板**
```vue
<template>
  <view class="container">
    <custom-nav-bar title="页面标题" />
    <!-- 页面内容 -->
  </view>
</template>

<script>
export default {
  name: 'NewPage',
  data() {
    return {
      // 数据定义
    }
  },
  onLoad(options) {
    // 页面加载
  },
  methods: {
    // 方法定义
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: $spacing-md;
}
</style>
```

3. **注册页面路由**
```json
// pages.json
{
  "pages": [
    {
      "path": "pages/new-page/new-page",
      "style": {
        "navigationBarTitleText": "页面标题"
      }
    }
  ]
}
```

### 新增组件

1. **创建组件文件**
```bash
touch components/new-component.vue
```

2. **组件模板**
```vue
<template>
  <view class="new-component">
    <!-- 组件内容 -->
  </view>
</template>

<script>
export default {
  name: 'NewComponent',
  props: {
    // 属性定义
  },
  data() {
    return {
      // 数据定义
    }
  },
  methods: {
    // 方法定义
  }
}
</script>

<style lang="scss" scoped>
.new-component {
  // 样式定义
}
</style>
```

### API接口调用

```javascript
// 在页面中调用API
import { request } from '@/api/index.js'

export default {
  methods: {
    async fetchData() {
      try {
        const response = await request({
          url: '/jobs/list',
          method: 'GET',
          data: { page: 1, size: 10 }
        })
        console.log(response.data)
      } catch (error) {
        console.error('请求失败:', error)
        uni.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    }
  }
}
```

## 性能优化

### 代码分割
- 使用分包加载减少主包体积
- 按需引入第三方库
- 图片懒加载和压缩

### 渲染优化
- 合理使用v-if和v-show
- 列表数据虚拟滚动
- 避免频繁的DOM操作

### 网络优化
- 接口数据缓存
- 图片CDN加速
- 请求防抖和节流

## 测试

### 单元测试
```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage
```

### E2E测试
```bash
# 端到端测试
npm run test:e2e
```

## 常见问题

### Q: 如何配置不同环境的API地址？
A: 在`api/index.js`中根据环境变量设置不同的BASE_URL

### Q: 微信小程序真机调试网络请求失败？
A: 检查域名是否在微信小程序后台配置了request合法域名

### Q: H5页面刷新后出现404？
A: 配置Nginx的try_files，支持单页面应用的路由

### Q: 如何开启gzip压缩？
A: 在Nginx配置中开启gzip，或在构建时生成gzip文件

## 版本历史

- **v1.0.0** (2025-06-02) - 初始版本发布
  - 基础功能实现
  - 支持微信小程序和H5
  - 用户认证和工作管理

- **v1.1.0** (2025-06-02) - 功能增强
  - 新增雇主端功能
  - 优化用户体验
  - 修复已知问题

- **v1.2.0** (2025-06-02) - 性能优化
  - 代码重构优化
  - 新增离线支持
  - 界面美化升级

## 贡献指南

我们欢迎所有形式的贡献，无论是新功能、bug修复还是文档改进。

### 贡献流程

1. **Fork项目**
   ```bash
   # 在GitHub上Fork本仓库
   git clone https://github.com/your-username/Gigplatform_front.git
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **提交代码**
   ```bash
   git commit -m 'feat: 添加某个新功能'
   ```

4. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **创建Pull Request**
   - 在GitHub上创建PR
   - 描述你的更改
   - 等待代码审查

### 代码规范

- 使用ESLint进行代码检查
- 遵循Vue.js官方风格指南
- 组件命名使用PascalCase
- 方法命名使用camelCase
- 常量命名使用UPPER_SNAKE_CASE

### 提交信息规范

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

类型说明：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 联系方式

- **项目主页**: https://github.com/BXCQ/Gigplatform_front
- **问题反馈**: https://github.com/BXCQ/Gigplatform_front/issues
- **邮箱**: 676567473@qq.com
- **博客**: https://blog.ybyq.wang/

## 相关项目

- **后端项目**: [Gigplatform_backend](https://github.com/BXCQ/Gigplatform_backend)
- **在线预览**: https://lgpt.ybyq.wang/
- **API文档**: [接口文档](./API接口文档.md)

## 致谢

感谢以下开源项目和贡献者：

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [uni-app](https://uniapp.dcloud.io/) - 跨平台开发框架  
- [ColorUI](https://github.com/weilanwl/ColorUI) - 高颜值UI组件库
- [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/) - 微信小程序开发框架

特别感谢所有为本项目提供支持、反馈和贡献的开发者们！

---

**智慧零工平台前端系统** - 让工作与人才精准匹配，让就业更简单高效！
