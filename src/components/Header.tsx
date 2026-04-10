import { Search, Sun, Moon, Github, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/use-theme";
import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight">Jus-t-in's Blog</span>
            </Link>
            
            <div className="hidden md:flex items-center relative">
              <button 
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-md border border-transparent hover:border-border transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-muted-foreground bg-background rounded border">
                  <span className="text-xs">Ctrl</span>K
                </kbd>
              </button>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors">
                Notes
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors">
                Research
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <button className="md:hidden p-2 rounded-full hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

