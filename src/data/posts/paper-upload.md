---
title: '文章上传部署流程'
category: 'Workflows'
date: '2026/04/10 16:38'
modifiedDate: '2026/04/10 16:38'
---

## 1.写文章
在 posts 目录下新建或修改 Markdown (.md) 文件。
    (确保文章头部带有 --- 包裹的 title 等基础信息)

## 2.本地预览效果

```sh
npm run dev
```

## 3.推送源码到GitHub备份
(main分支)

### 暂存修改/新增文件
```sh
git add .
```

### 提交修改
```sh
git commit -m "备注"
```

### 推送到main
```sh
git push origin main
```

## 4.打包发布网页
(gh-pages)

```sh
npm run deploy
```