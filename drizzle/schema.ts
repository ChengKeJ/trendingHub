import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Trending Topics Table - 存储从 Google Trends 获取的热点话题
export const trendingTopics = mysqlTable("trending_topics", {
  id: int("id").autoincrement().primaryKey(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  searchVolume: int("search_volume").default(0), // 搜索量
  trendScore: int("trend_score").default(0), // 热度评分 (0-100)
  category: varchar("category", { length: 100 }), // 分类 (e.g., 'Technology', 'Entertainment')
  source: varchar("source", { length: 50 }).default("google_trends"), // 数据来源
  status: mysqlEnum("status", ["active", "archived"]).default("active"),
  fetchedAt: timestamp("fetched_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TrendingTopic = typeof trendingTopics.$inferSelect;
export type InsertTrendingTopic = typeof trendingTopics.$inferInsert;

// Articles Table - 存储生成的文章
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly slug
  content: text("content"), // 文章正文
  excerpt: text("excerpt"), // 文章摘要
  authorId: int("author_id").notNull(), // 作者 ID (关联 users 表)
  trendingTopicId: int("trending_topic_id"), // 关联的热点话题 ID
  status: mysqlEnum("status", ["draft", "pending", "published", "archived"]).default("draft"),
  viewCount: int("view_count").default(0), // 浏览次数
  likeCount: int("like_count").default(0), // 点赞数
  publishedAt: timestamp("published_at"), // 发布时间
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// Categories Table - 文章分类
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Article Categories Junction Table - 文章与分类的多对多关系
export const articleCategories = mysqlTable("article_categories", {
  articleId: int("article_id").notNull(),
  categoryId: int("category_id").notNull(),
});

// Tags Table - 文章标签
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

// Article Tags Junction Table - 文章与标签的多对多关系
export const articleTags = mysqlTable("article_tags", {
  articleId: int("article_id").notNull(),
  tagId: int("tag_id").notNull(),
});

// Analytics Table - 流量分析数据
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("article_id").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD 格式
  pageViews: int("page_views").default(0),
  uniqueVisitors: int("unique_visitors").default(0),
  avgTimeOnPage: int("avg_time_on_page").default(0), // 秒
  bounceRate: int("bounce_rate").default(0), // 百分比
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// Ad Placements Table - 广告位管理
export const adPlacements = mysqlTable("ad_placements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  position: varchar("position", { length: 50 }).notNull(), // e.g., 'header', 'sidebar', 'footer'
  adCode: text("ad_code"), // 广告代码
  isActive: int("is_active").default(1), // 是否激活
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AdPlacement = typeof adPlacements.$inferSelect;
export type InsertAdPlacement = typeof adPlacements.$inferInsert;