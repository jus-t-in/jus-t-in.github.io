import fs from 'fs';
import path from 'path';
// You might need to make sure tsx can load this properly
import { posts } from '../src/data/posts.ts';

const dir = path.join(process.cwd(), 'src/data/posts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

posts.forEach(post => {
  const content = `---
title: '${post.title}'
category: '${post.category}'
date: '${post.date}'
modifiedDate: '${post.modifiedDate}'
---

${post.content}`;
  
  fs.writeFileSync(path.join(dir, `${post.id}.md`), content);
});

console.log('Migration completed!');
import fs from 'fs';
import path from 'path';
import { posts } from '../src/data/posts';

const dir = path.join(process.cwd(), 'src/data/posts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

posts.forEach(post => {
  const content = "---
title: ''
category: ''
date: ''
modifiedDate: ''
---

";
  fs.writeFileSync(path.join(dir, ${post.id}.md), content);
});
console.log('Migration completed!');