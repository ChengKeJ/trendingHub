import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Loader2, TrendingUp, Eye, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    limit: 12,
    offset: 0,
  });
  const { data: trends } = trpc.trends.list.useQuery({ limit: 5 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{user?.name}</span>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">追踪热点，发布内容，赚取收入</h2>
          <p className="text-xl text-blue-100 mb-8">
            实时监控 Google Trends 热点词，AI 自动生成高质量内容，快速获取流量和广告收入
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary">
              浏览热点文章
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                开始创作
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Trending Topics Section */}
      {trends && trends.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-slate-900">当前热点</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {trends.map((trend) => (
                <Card key={trend.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <Badge className="mb-2">{trend.category || "General"}</Badge>
                    <p className="font-semibold text-slate-900 line-clamp-2">{trend.keyword}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>热度: {trend.trendScore}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">最新文章</h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 line-clamp-3">{article.excerpt || article.content?.substring(0, 120)}</p>

                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.viewCount || 0} 次浏览</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('zh-CN') : '未发布'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Badge variant="secondary">{article.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">暂无文章，敬请期待...</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">平台特性</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  实时热点追踪
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  自动监控 Google Trends，第一时间捕捉热点话题，抢占流量先机。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 text-blue-600" />
                  AI 内容生成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  利用 OpenAI API，自动生成 SEO 友好的高质量文章，大幅降低创作成本。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  流量变现
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  集成 Google AdSense，实时追踪广告收入，多渠道变现热点流量。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 {APP_TITLE}. 追踪热点，发布内容，赚取收入。
          </p>
        </div>
      </footer>
    </div>
  );
}

