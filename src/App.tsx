import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Post } from "./pages/Post";
import { Category } from "./pages/Category";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="blog-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="post/:id" element={<Post />} />
            <Route path="category/:name" element={<Category />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

