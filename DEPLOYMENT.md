# Trending Hub 部署指南

## 目录

1. [环境配置](#环境配置)
2. [Google AdSense 集成](#google-adsense-集成)
3. [数据库设置](#数据库设置)
4. [部署到生产环境](#部署到生产环境)
5. [监控和维护](#监控和维护)

## 环境配置

### 必需的环境变量

```bash
# 数据库连接
DATABASE_URL=mysql://user:password@host:port/database

# OAuth 配置
JWT_SECRET=your-jwt-secret-key
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# 应用配置
VITE_APP_ID=your-app-id
VITE_APP_TITLE=Trending Hub
VITE_APP_LOGO=https://your-domain.com/logo.png

# Google AdSense
GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
GOOGLE_AD_EXCHANGE_ID=your-ad-exchange-id

# LLM 配置
BUILT_IN_FORGE_API_KEY=your-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# 分析工具
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Google AdSense 集成

### 步骤 1: 获取 Google AdSense 账户

1. 访问 [Google AdSense](https://www.google.com/adsense/start/)
2. 按照指示完成账户设置
3. 获取你的发布商 ID（格式：`ca-pub-xxxxxxxxxxxxxxxx`）

### 步骤 2: 配置广告位

在 `server/routers.ts` 中的 `ads.generateAdCode` 端点可以生成 Google AdSense 代码。

**示例:**

```typescript
// 生成 Google AdSense 代码
const response = await trpc.ads.generateAdCode.mutate({
  publisherId: 'ca-pub-xxxxxxxxxxxxxxxx',
  adSlot: '1234567890'
});

// 在前端插入生成的代码
document.getElementById('ad-container').innerHTML = response.adCode;
```

### 步骤 3: 配置广告位置

在数据库中配置广告位置：

```sql
INSERT INTO ad_placements (name, position, ad_code, is_active) VALUES
('Header Ad', 'header', '<ad-code-here>', 1),
('Sidebar Ad', 'sidebar', '<ad-code-here>', 1),
('Article Top Ad', 'article_top', '<ad-code-here>', 1),
('Article Bottom Ad', 'article_bottom', '<ad-code-here>', 1),
('Footer Ad', 'footer', '<ad-code-here>', 1);
```

## 数据库设置

### 创建数据库

```bash
# 使用 MySQL
mysql -u root -p
CREATE DATABASE trending_hub;
USE trending_hub;
```

### 运行迁移

```bash
cd /home/ubuntu/trendingHub
pnpm db:push
```

### 初始化数据

```bash
# 创建默认分类
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Tech news and trends'),
('Business', 'business', 'Business and finance news'),
('Entertainment', 'entertainment', 'Entertainment and celebrity news'),
('Health', 'health', 'Health and wellness news'),
('Sports', 'sports', 'Sports news and updates');

# 创建默认广告位
INSERT INTO ad_placements (name, position, is_active) VALUES
('Header Banner', 'header', 1),
('Sidebar 300x250', 'sidebar', 1),
('Article Top 728x90', 'article_top', 1),
('Article Middle 300x250', 'article_middle', 1),
('Article Bottom 728x90', 'article_bottom', 1),
('Footer 970x90', 'footer', 1);
```

## 部署到生产环境

### 选项 1: 部署到 Vercel (推荐)

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel --prod

# 配置环境变量
vercel env add DATABASE_URL
vercel env add GOOGLE_ADSENSE_PUBLISHER_ID
# ... 添加其他环境变量
```

### 选项 2: 部署到 Docker

```dockerfile
# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# 构建和运行 Docker 镜像
docker build -t trending-hub .
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e GOOGLE_ADSENSE_PUBLISHER_ID="ca-pub-..." \
  trending-hub
```

### 选项 3: 部署到 AWS/阿里云/腾讯云

参考各云服务商的 Node.js 应用部署文档。

## 监控和维护

### 流量监控

使用 `/analytics/dashboardMetrics` 端点获取仪表板数据：

```typescript
const metrics = await trpc.analytics.dashboardMetrics.query();
console.log('Total Page Views:', metrics.totalPageViews);
console.log('Total Unique Visitors:', metrics.totalUniqueVisitors);
console.log('Average Engagement Rate:', metrics.avgEngagementRate);
```

### 广告收入统计

使用 `/ads/revenueStats` 端点获取广告收入数据：

```typescript
const stats = await trpc.ads.revenueStats.query({ period: 'month' });
console.log('Total Revenue:', stats.totalRevenue);
console.log('Impressions:', stats.impressions);
console.log('CTR:', stats.ctr);
console.log('CPM:', stats.cpm);
```

### 日志管理

配置日志系统以便追踪问题：

```typescript
// 在 server/_core/index.ts 中配置日志
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 定期备份

```bash
# 定期备份数据库
mysqldump -u user -p database_name > backup_$(date +%Y%m%d).sql

# 定期备份代码
git push origin main
```

### 性能优化

1. **启用 CDN:** 使用 Cloudflare 或 AWS CloudFront 加速静态资源
2. **数据库索引:** 为频繁查询的字段添加索引
3. **缓存策略:** 使用 Redis 缓存热点数据
4. **图片优化:** 压缩和优化文章中的图片

## 故障排查

### 常见问题

**问题:** 广告不显示
- 检查 Google AdSense 发布商 ID 是否正确
- 确保网站已通过 Google AdSense 审核
- 检查浏览器控制台是否有 JavaScript 错误

**问题:** 流量数据不更新
- 检查分析模块是否正确集成
- 确保 Analytics 表有数据
- 检查数据库连接是否正常

**问题:** 文章发布失败
- 检查 slug 是否唯一
- 确保用户有发布权限
- 检查数据库磁盘空间

---

**更新日期:** 2025-10-27
**版本:** 1.0.0

