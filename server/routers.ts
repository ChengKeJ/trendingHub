import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getTrendingTopics,
  createTrendingTopic,
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticleStatus,
  incrementArticleViewCount,
  getActiveAdPlacements,
  getAdPlacementByPosition,
} from "./db";
import { invokeLLM } from "./_core/llm";
import {
  calculatePerformanceScore,
  calculateSeoScore,
  calculateEngagementMetrics,
  analyzeTrend,
} from "./modules/analytics";
import { generateAdSenseCode, validateAdSensePublisherId } from "./modules/adManager";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Trending Topics Router
  trends: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await getTrendingTopics(input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          keyword: z.string(),
          searchVolume: z.number().optional(),
          trendScore: z.number().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await createTrendingTopic({
          keyword: input.keyword,
          searchVolume: input.searchVolume || 0,
          trendScore: input.trendScore || 0,
          category: input.category,
        });
      }),
  }),

  // Articles Router
  articles: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getArticles(input.limit, input.offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await getArticleBySlug(input.slug);
        if (article) {
          await incrementArticleViewCount(article.id);
        }
        return article;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          slug: z.string(),
          content: z.string(),
          excerpt: z.string().optional(),
          trendingTopicId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        return await createArticle({
          title: input.title,
          slug: input.slug,
          content: input.content,
          excerpt: input.excerpt,
          authorId: ctx.user.id,
          trendingTopicId: input.trendingTopicId,
          status: "draft",
        });
      }),

    publish: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await updateArticleStatus(input.articleId, "published");
      }),
  }),

  // Content Generation Router
  generate: router({
    articleOutline: protectedProcedure
      .input(z.object({ topic: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const prompt = `You are a professional SEO and content marketing expert. Please write an article outline for the following trending topic that is engaging and suitable for website traffic monetization. The article should have depth and breadth to attract search engines and readers.

Topic: ${input.topic}

Please provide the outline in the following format:
1. Suggested article title
2. Article summary
3. Main section overview
4. Active keywords`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a professional SEO and content marketing expert.",
            },
            { role: "user", content: prompt },
          ],
        });

        return {
          outline: response.choices[0].message.content,
        };
      }),
  }),

  // Analytics Router
  analytics: router({
    articlePerformance: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return {
          articleId: input.articleId,
          performanceScore: 0,
          seoScore: 0,
          engagementMetrics: {
            engagementRate: 0,
            returnVisitorRate: 0,
            avgSessionDuration: 0,
          },
          trend: "stable",
        };
      }),

    dashboardMetrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return {
        totalArticles: 0,
        totalPageViews: 0,
        totalUniqueVisitors: 0,
        avgEngagementRate: 0,
        topArticles: [],
        trafficTrend: [],
      };
    }),

    trafficBySource: protectedProcedure
      .input(z.object({ period: z.string().default("week") }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return {
          organic: 0,
          direct: 0,
          referral: 0,
          social: 0,
          paid: 0,
        };
      }),
  }),

  // Ads Router
  ads: router({
    getActive: publicProcedure.query(async () => {
      return await getActiveAdPlacements();
    }),

    getByPosition: publicProcedure
      .input(z.object({ position: z.string() }))
      .query(async ({ input }) => {
        return await getAdPlacementByPosition(input.position);
      }),

    generateAdCode: protectedProcedure
      .input(
        z.object({
          publisherId: z.string(),
          adSlot: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        if (!validateAdSensePublisherId(input.publisherId)) {
          throw new Error("Invalid Google AdSense Publisher ID format");
        }

        const adCode = generateAdSenseCode(input.publisherId, input.adSlot);
        return { adCode };
      }),

    revenueStats: protectedProcedure
      .input(z.object({ period: z.string().default("month") }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return {
          totalRevenue: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          cpm: 0,
          dailyRevenue: [],
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

