import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, trendingTopics, articles, categories, tags, analytics, adPlacements, InsertTrendingTopic, InsertArticle, InsertAnalytics, InsertAdPlacement } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// Trending Topics Queries
// ============================================

export async function getTrendingTopics(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(trendingTopics)
    .where(eq(trendingTopics.status, 'active'))
    .orderBy((t) => t.createdAt)
    .limit(limit);
}

export async function createTrendingTopic(topic: InsertTrendingTopic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(trendingTopics).values(topic);
  return result;
}

// ============================================
// Articles Queries
// ============================================

export async function getArticles(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy((a) => a.publishedAt)
    .limit(limit)
    .offset(offset);
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createArticle(article: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(articles).values(article);
  return result;
}

export async function updateArticleStatus(articleId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(articles)
    .set({ status: status as any })
    .where(eq(articles.id, articleId));
}

export async function incrementArticleViewCount(articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);
  
  if (article.length === 0) return null;
  
  return await db
    .update(articles)
    .set({ viewCount: (article[0].viewCount || 0) + 1 })
    .where(eq(articles.id, articleId));
}

// ============================================
// Analytics Queries
// ============================================

export async function getAnalyticsByArticleAndDate(articleId: number, date: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(analytics)
    .where(eq(analytics.articleId, articleId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateAnalytics(data: InsertAnalytics) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(analytics).values(data);
}

// ============================================
// Ad Placements Queries
// ============================================

export async function getActiveAdPlacements() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(adPlacements)
    .where(eq(adPlacements.isActive, 1));
}

export async function getAdPlacementByPosition(position: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(adPlacements)
    .where(eq(adPlacements.position, position))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// TODO: add more feature queries here as your schema grows.
