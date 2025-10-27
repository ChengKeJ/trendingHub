# Trending Hub SEO 优化指南

## 目录

1. [技术 SEO](#技术-seo)
2. [内容 SEO](#内容-seo)
3. [链接建设](#链接建设)
4. [性能优化](#性能优化)
5. [监控和分析](#监控和分析)

## 技术 SEO

### Meta 标签优化

在每篇文章页面中添加必要的 Meta 标签：

```html
<!-- 基础 Meta 标签 -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="文章摘要，150-160 个字符" />
<meta name="keywords" content="关键词1, 关键词2, 关键词3" />

<!-- Open Graph (社交媒体分享) -->
<meta property="og:title" content="文章标题" />
<meta property="og:description" content="文章摘要" />
<meta property="og:image" content="文章配图 URL" />
<meta property="og:url" content="文章完整 URL" />
<meta property="og:type" content="article" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="文章标题" />
<meta name="twitter:description" content="文章摘要" />
<meta name="twitter:image" content="文章配图 URL" />
```

### 结构化数据

使用 JSON-LD 格式添加结构化数据，帮助搜索引擎理解内容：

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "文章标题",
  "description": "文章摘要",
  "image": "文章配图 URL",
  "datePublished": "2025-10-27T00:00:00Z",
  "dateModified": "2025-10-27T00:00:00Z",
  "author": {
    "@type": "Person",
    "name": "作者名称"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Trending Hub",
    "logo": {
      "@type": "ImageObject",
      "url": "logo URL"
    }
  }
}
```

### URL 结构

**最佳实践:**
- 使用清晰、简洁的 URL 结构
- 包含主要关键词
- 避免使用数字 ID，改用 slug

**示例:**
```
✓ 好: /article/google-trends-2025-predictions
✗ 差: /article/12345
✗ 差: /article?id=12345&title=something
```

### Sitemap 和 Robots.txt

创建 `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/article/google-trends-2025</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

创建 `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://yourdomain.com/sitemap.xml
```

## 内容 SEO

### 标题优化

**规则:**
- 长度: 50-60 个字符
- 包含主要关键词
- 吸引人，包含数字或问题

**示例:**
```
✓ 好: "2025 年 Google Trends 热点词预测：10 个必看趋势"
✗ 差: "热点词"
✗ 差: "这是一篇关于谷歌热点词的文章"
```

### 标题层级 (H1, H2, H3)

**最佳实践:**
- 每页只有一个 H1（文章标题）
- H2 用于主要章节
- H3 用于子章节
- 避免跳过层级

### 关键词优化

**关键词密度:** 1-2%（自然分布）

**关键词位置:**
- 标题中
- 第一段落中
- 小标题中
- 图片 Alt 文本中
- URL slug 中

### 内容长度

**建议:**
- 最少 1,500 字（深度内容）
- 最多 3,000 字（保持可读性）
- 热点文章可以 500-1,000 字（快速发布）

### 内容结构

**最佳实践:**
1. 引人入胜的开头（前 100 字）
2. 清晰的目录或概述
3. 分段落讲解（每段 100-150 字）
4. 使用列表和要点
5. 包含相关图片和视频
6. 强有力的结尾和行动号召

## 链接建设

### 内部链接

**策略:**
- 链接到相关的旧文章
- 使用描述性锚文本
- 每篇文章 3-5 个内部链接

**示例:**
```html
<!-- ✓ 好 -->
<a href="/article/google-trends-2024">查看 2024 年 Google Trends 热点</a>

<!-- ✗ 差 -->
<a href="/article/google-trends-2024">点击这里</a>
```

### 外部链接

**获取高质量外链的方法:**
1. 创建高质量、可分享的内容
2. 联系行业相关的网站和博客
3. 在社交媒体上推广
4. 参与行业讨论和论坛
5. 发布新闻稿或行业报告

## 性能优化

### 页面加载速度

**目标:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

**优化方法:**
1. 压缩图片
2. 启用 Gzip 压缩
3. 使用 CDN
4. 缓存静态资源
5. 延迟加载图片和广告

### 移动优化

**检查清单:**
- [ ] 响应式设计
- [ ] 可点击元素足够大（最少 48x48px）
- [ ] 避免弹窗阻挡内容
- [ ] 快速加载（移动网络）

### 核心 Web Vitals

使用 Google PageSpeed Insights 检查:
- https://pagespeed.web.dev/

## 监控和分析

### Google Search Console

1. 验证网站所有权
2. 提交 Sitemap
3. 监控搜索性能
4. 检查索引状态
5. 修复爬虫错误

### Google Analytics

**关键指标:**
- 有机流量
- 平均停留时间
- 跳出率
- 转化率
- 热门页面

### 排名追踪

使用工具追踪关键词排名:
- Google Search Console (免费)
- Ahrefs (付费)
- SEMrush (付费)
- Moz (付费)

### 定期审计

每月进行 SEO 审计:
- [ ] 检查死链
- [ ] 验证 Meta 标签
- [ ] 检查移动友好性
- [ ] 分析竞争对手
- [ ] 更新旧内容

## 快速检查清单

- [ ] 每篇文章有唯一的 Meta 描述
- [ ] 使用 H1 标签（仅一个）
- [ ] 包含内部链接
- [ ] 图片有 Alt 文本
- [ ] URL 包含关键词
- [ ] 移动友好
- [ ] 页面加载速度 < 3s
- [ ] 使用 HTTPS
- [ ] 提交 Sitemap
- [ ] 设置 robots.txt

---

**更新日期:** 2025-10-27
**版本:** 1.0.0

