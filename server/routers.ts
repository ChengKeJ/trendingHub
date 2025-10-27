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
        // Only admins can create trending topics
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
          // Increment view count
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

        const prompt = `你是一位专业的SEO和内容营销专家。请为以下热点话题撰写一篇吸引人的、适合网站流量变现的文章大纲。文章应具有深度和广度，吸引搜索引擎和读者。

热点话题: ${input.topic}

请以以下格式提供大纲:
1. 建议的文章标题
2. 文章摘要
3. 主要段落概述
4. 活跃的关键词`;

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
  }),
});

export type AppRouter = typeof appRouter;

