import { useParams, Link } from "react-router-dom";
import { posts, categories } from "../data/posts";
import { cn } from "../lib/utils";

export function Category() {
  const { name } = useParams();
  
  const categoryName = categories.find(c => c.toLowerCase() === name?.toLowerCase());
  
  const categoryPosts = posts.filter(
    (p) => p.category.toLowerCase() === name?.toLowerCase()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Networks: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Tools: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Softwares: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Databases: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      Workflows: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Linux: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  if (!categoryName) {
    return <div className="container mx-auto py-20 text-center">Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Category: {categoryName}
        </h1>
        <p className="text-muted-foreground">
          Found {categoryPosts.length} posts in this category.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2 px-2 text-sm font-medium text-muted-foreground border-b border-border/50 mb-2">
            <div>标题</div>
            <div className="w-24 text-center">分类</div>
            <div className="w-32 text-right">发布时间</div>
          </div>
          {categoryPosts.map((post) => (
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
    </div>
  );
}
