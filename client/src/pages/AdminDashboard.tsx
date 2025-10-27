import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
// Chart library - install with: pnpm add recharts
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, FileText, Eye, DollarSign, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = trpc.analytics.dashboardMetrics.useQuery();
  const { data: adStats, isLoading: adStatsLoading } = trpc.ads.revenueStats.useQuery({ period: "month" });
  const { data: articles } = trpc.articles.list.useQuery({ limit: 10 });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">无权限访问</h1>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">管理后台</h1>
            <Link href="/">
              <Button variant="outline">返回首页</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总文章数</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalArticles || 0}</div>
              <p className="text-xs text-slate-600">已发布的文章</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalPageViews || 0}</div>
              <p className="text-xs text-slate-600">本月浏览次数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">独立访客</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalUniqueVisitors || 0}</div>
              <p className="text-xs text-slate-600">独立用户数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">广告收入</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${adStats?.totalRevenue || 0}</div>
              <p className="text-xs text-slate-600">本月收入</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>流量趋势</CardTitle>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="w-full h-80 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                <p>流量趋势图表（需要安装 recharts）</p>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>广告收入统计</CardTitle>
            </CardHeader>
            <CardContent>
              {adStatsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="w-full h-80 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                <p>广告收入图表（需要安装 recharts）</p>
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Articles Section */}
        <Card>
          <CardHeader>
            <CardTitle>热门文章</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">文章标题</th>
                    <th className="text-left py-3 px-4 font-semibold">浏览量</th>
                    <th className="text-left py-3 px-4 font-semibold">点赞</th>
                    <th className="text-left py-3 px-4 font-semibold">状态</th>
                    <th className="text-left py-3 px-4 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles && articles.length > 0 ? (
                    articles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900 truncate max-w-xs">
                          {article.title}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{article.viewCount || 0}</td>
                        <td className="py-3 px-4 text-slate-600">{article.likeCount || 0}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={article.status === "published" ? "default" : "secondary"}
                          >
                            {article.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            编辑
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-600">
                        暂无文章
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button size="lg" className="w-full">
            创建新文章
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            查看热点词
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            广告设置
          </Button>
        </div>
      </main>
    </div>
  );
}

