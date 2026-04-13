export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  modifiedDate: string;
  content: string;
}

export const categories = [
  'Networks',
  'Tools',
  'Softwares',
  'Databases',
  'Workflows',
  'Linux',
];

const mdFiles = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const posts: Post[] = Object.entries(mdFiles).map(([filepath, rawContent]) => {
  // Extract id from the file path, e.g., './posts/my-post.md' -> 'my-post'
  const id = filepath.replace('./posts/', '').replace(/\.md$/, '');
  
  // Basic regex to match frontmatter
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    // Fallback if no frontmatter found
    return {
      id,
      title: id,
      category: 'Uncategorized',
      date: '',
      modifiedDate: '',
      content: rawContent.trim(),
    };
  }

  const [, frontmatterStr, contentStr] = match;
  const metadata: Record<string, string> = {};

  // Parse very simple YAML-like frontmatter
  frontmatterStr.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Strip outer quotes if they exist
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
        value = value.replace(/''/g, "'"); // Unescape single quotes
      } else if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      metadata[key] = value;
    }
  });

  return {
    id,
    title: metadata.title || id,
    category: metadata.category || 'Uncategorized',
    date: metadata.date || '',
    modifiedDate: metadata.modifiedDate || '',
    content: contentStr.trim(),
  };
});

// Sort by date (descending)
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
