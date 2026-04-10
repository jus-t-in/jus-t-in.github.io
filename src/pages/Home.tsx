import { Link } from "react-router-dom";
import { categories, posts } from "../data/posts";
import { cn } from "../lib/utils";

export function Home() {
  const latestPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  const recentlyModified = [...posts].sort((a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()).slice(0, 10);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Networks: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Tools: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Softwares: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Databases: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      Workflows: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Ubuntu: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      LLMs: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          It's never too late. Just do it better.
        </h1>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-colors border border-border/50",
                "hover:bg-muted bg-background text-foreground shadow-sm"
              )}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Latest Posts */}
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            最新发布
          </h2>
          <div className="w-full h-px bg-border mb-4"></div>
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2 px-2 text-sm font-medium text-muted-foreground border-b border-border/50 mb-2">
              <div>标题</div>
              <div className="w-24 text-center">分类</div>
              <div className="w-32 text-right">发布时间</div>
            </div>
            {latestPosts.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="grid grid-cols-[1fr_auto_auto] gap-4 py-3 px-2 hover:bg-muted/50 rounded-lg transition-colors items-center group">
                <div className="font-medium truncate group-hover:text-primary transition-colors">{post.title}</div>
                <div className="w-24 flex justify-center">
                  <span className={cn("text-xs px-2.5 py-1 rounded-md font-medium", getCategoryColor(post.category))}>
                    {post.category}
                  </span>
                </div>
                <div className="w-32 text-right text-sm text-muted-foreground font-mono">
                  {post.date.split(' ')[0]}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Modified */}
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            最近修改
          </h2>
          <div className="w-full h-px bg-border mb-4"></div>
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2 px-2 text-sm font-medium text-muted-foreground border-b border-border/50 mb-2">
              <div>标题</div>
              <div className="w-24 text-center">分类</div>
              <div className="w-32 text-right">修改时间</div>
            </div>
            {recentlyModified.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="grid grid-cols-[1fr_auto_auto] gap-4 py-3 px-2 hover:bg-muted/50 rounded-lg transition-colors items-center group">
                <div className="font-medium truncate group-hover:text-primary transition-colors">{post.title}</div>
                <div className="w-24 flex justify-center">
                  <span className={cn("text-xs px-2.5 py-1 rounded-md font-medium", getCategoryColor(post.category))}>
                    {post.category}
                  </span>
                </div>
                <div className="w-32 text-right text-sm text-muted-foreground font-mono">
                  {post.modifiedDate.split(' ')[0]}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
