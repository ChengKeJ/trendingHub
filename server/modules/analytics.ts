/**
 * Analytics Module
 * 处理流量分析、性能追踪和数据统计
 */

export interface PageViewMetrics {
  articleId: number;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // 秒
  bounceRate: number; // 百分比
  scrollDepth: number; // 平均滚动深度 (%)
}

export interface ArticlePerformance {
  articleId: number;
  title: string;
  totalViews: number;
  totalUniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  likes: number;
  shares: number;
  publishedAt: Date;
  lastViewedAt: Date;
}

export interface TrafficTrend {
  date: string;
  totalPageViews: number;
  totalUniqueVisitors: number;
  avgPageViews: number; // 平均每篇文章的浏览量
  topArticle: {
    id: number;
    title: string;
    views: number;
  };
}

export interface SourceMetrics {
  source: string; // 'organic', 'direct', 'referral', 'social', 'paid'
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
}

/**
 * 计算文章的性能评分 (0-100)
 * 基于浏览量、停留时间和点赞数
 */
export function calculatePerformanceScore(
  views: number,
  avgTimeOnPage: number,
  likes: number,
  bounceRate: number
): number {
  // 权重配置
  const viewWeight = 0.4;
  const timeWeight = 0.3;
  const likeWeight = 0.2;
  const bounceWeight = 0.1;

  // 标准化各指标 (0-100)
  const viewScore = Math.min((views / 1000) * 100, 100); // 1000 次浏览为满分
  const timeScore = Math.min((avgTimeOnPage / 300) * 100, 100); // 5 分钟为满分
  const likeScore = Math.min((likes / 100) * 100, 100); // 100 个赞为满分
  const bounceScore = Math.max(100 - bounceRate, 0); // 反向计算

  const score =
    viewScore * viewWeight +
    timeScore * timeWeight +
    likeScore * likeWeight +
    bounceScore * bounceWeight;

  return Math.round(score);
}

/**
 * 计算文章的 SEO 得分
 * 基于流量来源和搜索排名指标
 */
export function calculateSeoScore(
  organicViews: number,
  totalViews: number,
  avgTimeOnPage: number,
  bounceRate: number
): number {
  const organicPercentage = totalViews > 0 ? (organicViews / totalViews) * 100 : 0;

  // SEO 得分组成
  const organicScore = Math.min(organicPercentage, 100); // 有机流量占比
  const engagementScore = Math.min((avgTimeOnPage / 180) * 100, 100); // 参与度
  const bounceScore = Math.max(100 - bounceRate, 0); // 反弹率

  const score = organicScore * 0.5 + engagementScore * 0.3 + bounceScore * 0.2;
  return Math.round(score);
}

/**
 * 生成流量趋势分析
 */
export function analyzeTrend(
  metrics: PageViewMetrics[],
  days: number = 7
): { trend: "up" | "down" | "stable"; percentChange: number } {
  if (metrics.length < 2) {
    return { trend: "stable", percentChange: 0 };
  }

  const midpoint = Math.floor(metrics.length / 2);
  const firstHalf = metrics.slice(0, midpoint);
  const secondHalf = metrics.slice(midpoint);

  const avgFirst =
    firstHalf.reduce((sum, m) => sum + m.pageViews, 0) / firstHalf.length;
  const avgSecond =
    secondHalf.reduce((sum, m) => sum + m.pageViews, 0) / secondHalf.length;

  const percentChange = ((avgSecond - avgFirst) / avgFirst) * 100;

  let trend: "up" | "down" | "stable" = "stable";
  if (percentChange > 5) trend = "up";
  if (percentChange < -5) trend = "down";

  return { trend, percentChange: Math.round(percentChange * 100) / 100 };
}

/**
 * 计算用户参与度指标
 */
export function calculateEngagementMetrics(
  pageViews: number,
  uniqueVisitors: number,
  avgTimeOnPage: number,
  bounceRate: number
): {
  engagementRate: number;
  returnVisitorRate: number;
  avgSessionDuration: number;
} {
  const engagementRate = 100 - bounceRate; // 参与率 = 100% - 反弹率
  const returnVisitorRate =
    uniqueVisitors > 0
      ? Math.min(((pageViews - uniqueVisitors) / uniqueVisitors) * 100, 100)
      : 0; // 回访率
  const avgSessionDuration = avgTimeOnPage; // 平均会话时长

  return {
    engagementRate: Math.round(engagementRate * 100) / 100,
    returnVisitorRate: Math.round(returnVisitorRate * 100) / 100,
    avgSessionDuration: Math.round(avgSessionDuration),
  };
}

/**
 * 流量来源分类
 */
export const TRAFFIC_SOURCES = {
  ORGANIC: "organic", // 搜索引擎
  DIRECT: "direct", // 直接访问
  REFERRAL: "referral", // 推荐链接
  SOCIAL: "social", // 社交媒体
  PAID: "paid", // 付费广告
  EMAIL: "email", // 邮件营销
} as const;

/**
 * 分析周期
 */
export const ANALYTICS_PERIODS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  QUARTER: "quarter",
  YEAR: "year",
} as const;

