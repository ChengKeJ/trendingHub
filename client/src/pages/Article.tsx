import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Clock, Share2, ThumbsUp, ArrowLeft } from "lucide-react";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = trpc.articles.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">文章未找到</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{article.title}</h1>

          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <time dateTime={new Date(article.publishedAt || article.createdAt).toISOString()}>
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount || 0} 次浏览</span>
            </div>

            <Badge variant="secondary">{article.status}</Badge>
          </div>

          {article.excerpt && (
            <p className="text-xl text-slate-600 italic mb-6">{article.excerpt}</p>
          )}
        </div>

        {/* Ad Placement - Top */}
        <div className="mb-8 p-4 bg-slate-100 rounded-lg text-center text-slate-500">
          <p className="text-sm">广告位置</p>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-8">
          <div
            className="text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: article.content || "",
            }}
          />
        </div>

        {/* Ad Placement - Bottom */}
        <div className="mb-8 p-4 bg-slate-100 rounded-lg text-center text-slate-500">
          <p className="text-sm">广告位置</p>
        </div>

        {/* Article Footer */}
        <div className="border-t border-b py-6 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                点赞 ({article.likeCount || 0})
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">相关文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">相关文章标题 {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-2 mb-4">
                    这是一篇相关文章的摘要内容...
                  </p>
                  <Link href="/">
                    <Button variant="outline" size="sm">
                      阅读更多
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 Trending Hub. 追踪热点，发布内容，赚取收入。
          </p>
        </div>
      </footer>
    </div>
  );
}

