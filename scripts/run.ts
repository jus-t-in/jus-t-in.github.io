import fs from 'fs';
import path from 'path';
import { posts } from '../src/data/posts';

const dir = path.join(process.cwd(), 'src/data/posts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

posts.forEach(post => {
  // escaping possible quotes:
  const title = post.title.replace(/'/g, "''");
  const comp = `---
title: '${title}'
category: '${post.category}'
date: '${post.date}'
modifiedDate: '${post.modifiedDate}'
---

${post.content}`;
  
  fs.writeFileSync(path.join(dir, `${post.id}.md`), comp);
});

console.log('Migration completed!');