/**
 * Ad Manager Module
 * 处理广告集成、投放和收入统计
 */

export interface AdConfig {
  googleAdSenseId?: string; // Google AdSense 发布商 ID
  adExchangeId?: string; // Google Ad Exchange 账户 ID
  enableNativeAds?: boolean; // 是否启用原生广告
  enableAffiliateLinks?: boolean; // 是否启用联盟营销链接
}

export interface AdRevenue {
  date: string;
  impressions: number; // 展示次数
  clicks: number; // 点击次数
  revenue: number; // 收入（美元）
  ctr: number; // 点击率 (%)
  cpm: number; // 每千次展示成本 (美元)
}

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: string;
  commission: number; // 佣金比例 (%)
  isActive: boolean;
}

/**
 * 生成 Google AdSense 代码片段
 */
export function generateAdSenseCode(publisherId: string, adSlot: string): string {
  return `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}"
     crossorigin="anonymous"></script>
<!-- Article Ad Slot -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-${publisherId}"
     data-ad-slot="${adSlot}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
  `.trim();
}

/**
 * 计算广告收入指标
 */
export function calculateAdMetrics(
  impressions: number,
  clicks: number,
  revenue: number
): { ctr: number; cpm: number } {
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;
  return { ctr, cpm };
}

/**
 * 生成联盟营销链接
 * 用于在文章中插入产品推荐链接
 */
export function generateAffiliateLink(
  baseUrl: string,
  affiliateId: string,
  productId: string
): string {
  const params = new URLSearchParams({
    aff_id: affiliateId,
    product_id: productId,
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * 验证 Google AdSense 发布商 ID 格式
 */
export function validateAdSensePublisherId(publisherId: string): boolean {
  // Google AdSense ID 格式: ca-pub-xxxxxxxxxxxxxxxx (16 个数字)
  const pattern = /^ca-pub-\d{16}$/;
  return pattern.test(publisherId);
}

/**
 * 广告投放位置配置
 */
export const AD_POSITIONS = {
  HEADER: "header", // 页面顶部
  SIDEBAR: "sidebar", // 侧边栏
  ARTICLE_TOP: "article_top", // 文章顶部
  ARTICLE_MIDDLE: "article_middle", // 文章中间
  ARTICLE_BOTTOM: "article_bottom", // 文章底部
  FOOTER: "footer", // 页面底部
} as const;

/**
 * 广告格式配置
 */
export const AD_FORMATS = {
  DISPLAY: "display", // 展示广告
  NATIVE: "native", // 原生广告
  VIDEO: "video", // 视频广告
  RESPONSIVE: "responsive", // 响应式广告
} as const;

