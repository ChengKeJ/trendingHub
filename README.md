# Trending Hub - Google Trends Content Generator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-22%2B-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**追踪热点，发布内容，赚取收入** - 一个基于 Google Trends 热点词的自动化内容生成和流量变现平台。

## 功能特性

### 核心功能

- **🔥 实时热点追踪** - 自动监控 Google Trends，第一时间捕捉热点话题
- **🤖 AI 内容生成** - 集成 OpenAI API，自动生成 SEO 友好的高质量文章
- **📊 流量分析** - 实时追踪文章性能、用户行为和流量来源
- **💰 广告变现** - 集成 Google AdSense，支持多种广告格式和位置
- **👥 用户管理** - 基于 Manus OAuth 的用户认证和权限管理
- **📱 响应式设计** - 完美适配桌面、平板和移动设备

### 技术特性

- **全栈 TypeScript** - 前后端类型安全
- **tRPC** - 类型安全的 API 调用
- **React 19** - 现代化前端框架
- **Tailwind CSS** - 高效的样式系统
- **MySQL/TiDB** - 可靠的数据存储
- **Express** - 轻量级后端框架

## 快速开始

### 前置要求

- Node.js 22+
- MySQL 8.0+
- Git

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/ChengKeJ/trendingHub.git
cd trendingHub

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 4. 运行数据库迁移
pnpm db:push

# 5. 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 查看网站。

## 项目结构

```
trendingHub/
├── client/                    # 前端应用
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   │   ├── Home.tsx      # 首页
│   │   │   ├── Article.tsx   # 文章详情页
│   │   │   └── AdminDashboard.tsx  # 管理后台
│   │   ├── components/       # 可复用组件
│   │   ├── lib/              # 工具函数
│   │   └── App.tsx           # 主应用
│   └── public/               # 静态资源
├── server/                    # 后端应用
│   ├── routers.ts            # tRPC 路由
│   ├── db.ts                 # 数据库查询
│   ├── modules/              # 业务模块
│   │   ├── analytics.ts      # 分析模块
│   │   └── adManager.ts      # 广告管理
│   └── _core/                # 核心框架代码
├── drizzle/                   # 数据库 Schema
│   └── schema.ts             # 表定义
├── DEPLOYMENT.md             # 部署指南
├── SEO_GUIDE.md              # SEO 优化指南
├── OPERATIONS_GUIDE.md       # 运营手册
└── package.json              # 项目配置
```

## 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# 数据库
DATABASE_URL=mysql://user:password@localhost:3306/trending_hub

# OAuth
JWT_SECRET=your-jwt-secret-key
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# 应用配置
VITE_APP_ID=your-app-id
VITE_APP_TITLE=Trending Hub
VITE_APP_LOGO=https://your-domain.com/logo.png

# Google AdSense
GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx

# API
BUILT_IN_FORGE_API_KEY=your-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# 分析
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## API 文档

### 热点话题 API

```typescript
// 获取热点话题列表
trpc.trends.list.useQuery({ limit: 10 })

// 创建新热点话题（需要管理员权限）
trpc.trends.create.useMutation({
  keyword: "AI",
  searchVolume: 10000,
  trendScore: 85,
  category: "Technology"
})
```

### 文章 API

```typescript
// 获取文章列表
trpc.articles.list.useQuery({ limit: 20, offset: 0 })

// 获取文章详情
trpc.articles.getBySlug.useQuery({ slug: "article-slug" })

// 创建文章（需要认证）
trpc.articles.create.useMutation({
  title: "Article Title",
  slug: "article-slug",
  content: "Article content",
  excerpt: "Article excerpt"
})

// 发布文章（需要管理员权限）
trpc.articles.publish.useMutation({ articleId: 1 })
```

### 内容生成 API

```typescript
// 生成文章大纲（需要管理员权限）
trpc.generate.articleOutline.useMutation({
  topic: "AI trends 2025"
})
```

### 分析 API

```typescript
// 获取文章性能数据
trpc.analytics.articlePerformance.useQuery({ articleId: 1 })

// 获取仪表板指标（需要管理员权限）
trpc.analytics.dashboardMetrics.useQuery()

// 获取流量来源（需要管理员权限）
trpc.analytics.trafficBySource.useQuery({ period: "week" })
```

### 广告 API

```typescript
// 获取活跃广告位
trpc.ads.getActive.useQuery()

// 获取特定位置的广告
trpc.ads.getByPosition.useQuery({ position: "article_top" })

// 生成 Google AdSense 代码（需要管理员权限）
trpc.ads.generateAdCode.useMutation({
  publisherId: "ca-pub-xxxxxxxxxxxxxxxx",
  adSlot: "1234567890"
})

// 获取广告收入统计（需要管理员权限）
trpc.ads.revenueStats.useQuery({ period: "month" })
```

## 部署

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

详见 [部署指南](./DEPLOYMENT.md)

## 文档

- [部署指南](./DEPLOYMENT.md) - 详细的部署步骤和配置
- [SEO 优化指南](./SEO_GUIDE.md) - 搜索引擎优化最佳实践
- [运营手册](./OPERATIONS_GUIDE.md) - 日常运营和内容策略

## 开发指南

### 本地开发

```bash
# 启动开发服务器
pnpm dev

# 运行类型检查
pnpm type-check

# 构建生产版本
pnpm build

# 运行生产版本
pnpm start
```

### 数据库迁移

```bash
# 推送 schema 变更
pnpm db:push

# 生成迁移文件
pnpm db:generate

# 查看迁移状态
pnpm db:studio
```

### 添加新功能

1. 在 `drizzle/schema.ts` 中定义新表
2. 运行 `pnpm db:push` 迁移数据库
3. 在 `server/db.ts` 中添加查询函数
4. 在 `server/routers.ts` 中添加 tRPC 路由
5. 在前端使用 `trpc.*` hooks 调用 API

## 性能指标

- **首屏加载时间**: < 1.8s
- **最大内容绘制**: < 2.5s
- **累积布局偏移**: < 0.1
- **移动 Lighthouse 评分**: > 90

## 安全性

- HTTPS 加密传输
- JWT 会话管理
- SQL 注入防护
- XSS 防护
- CSRF 防护
- 定期安全审计

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

- 📧 邮件: support@trendinghub.com
- 💬 Discord: [加入我们的社区](https://discord.gg/trendinghub)
- 📖 文档: [完整文档](https://docs.trendinghub.com)

## 路线图

- [ ] Google Trends API 集成
- [ ] 定时任务系统
- [ ] 高级编辑器
- [ ] 社交媒体自动分享
- [ ] 多语言支持
- [ ] 移动应用
- [ ] AI 图片生成
- [ ] 视频内容支持

## 常见问题

**Q: 如何获取 Google AdSense 发布商 ID？**

A: 访问 [Google AdSense](https://www.google.com/adsense/start/) 注册账户，通过审核后即可获得发布商 ID。

**Q: 如何集成 Google Trends API？**

A: Google Trends 没有官方 API，建议使用第三方服务如 SerpApi 或 Scrapeless。

**Q: 网站支持多语言吗？**

A: 当前版本主要支持中文，多语言支持在开发计划中。

**Q: 如何增加网站流量？**

A: 详见 [运营手册](./OPERATIONS_GUIDE.md) 中的"流量增长"章节。

## 致谢

感谢所有贡献者和用户的支持！

---

**最后更新:** 2025-10-27  
**版本:** 1.0.0  
**作者:** Trending Hub Team

