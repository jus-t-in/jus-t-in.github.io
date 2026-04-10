import { useParams, Link } from "react-router-dom";
import { posts, categories } from "../data/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // We'll use custom styles in index.css but this provides base
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export function Post() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2, h3");
      let current = "";
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top >= 0 && top < 300) {
          current = heading.id;
        }
      });
      if (current) setActiveHeading(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    return <div className="container mx-auto py-20 text-center">Post not found</div>;
  }

  // Extract headings for TOC
  const headings = post.content.match(/^(##|###) (.*$)/gim) || [];
  const toc = headings.map((heading) => {
    const level = heading.startsWith("###") ? 3 : 2;
    const text = heading.replace(/^(##|###) /, "");
    const slug = text.toLowerCase().replace(/\s+/g, "-");
    return { level, text, slug };
  });

  return (
    <div className="flex w-full max-w-[1600px] mx-auto">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border/40 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-6 pl-4 pr-6">
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryPosts = posts.filter((p) => p.category === category);
            if (categoryPosts.length === 0) return null;
            return (
              <div key={category}>
                <h4 className="font-semibold mb-3 text-sm">{category}</h4>
                <ul className="space-y-2">
                  {categoryPosts.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/post/${p.id}`}
                        className={cn(
                          "block text-sm py-1 px-2 -mx-2 rounded-md transition-colors",
                          p.id === id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 py-10 px-6 md:px-12 lg:px-20">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">{post.title}</h1>
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ node, ...props }) => {
                  const id = props.children?.toString().toLowerCase().replace(/\s+/g, "-");
                  return <h2 id={id} {...props} />;
                },
                h3: ({ node, ...props }) => {
                  const id = props.children?.toString().toLowerCase().replace(/\s+/g, "-");
                  return <h3 id={id} {...props} />;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      {/* Right Sidebar (TOC) */}
      <aside className="hidden xl:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-10 pr-4 pl-6">
        {toc.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4 text-sm">On this page</h4>
            <ul className="space-y-2.5 text-sm">
              {toc.map((item, index) => (
                <li
                  key={index}
                  className={cn(
                    "transition-colors",
                    item.level === 3 ? "pl-4" : "",
                    activeHeading === item.slug
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <a href={`#${item.slug}`} className="block truncate">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
