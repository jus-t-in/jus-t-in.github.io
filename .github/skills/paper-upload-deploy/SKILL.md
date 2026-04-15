---
name: paper-upload-deploy
description: Upload article code to GitHub main branch and deploy the website to gh-pages for this repository.
---

Use this skill when the user wants to publish blog updates in this repository.

Repository-specific workflow:

1. Confirm the requested commit message. If none is provided, ask for one before committing.
2. Stage changes:
   - `git add .`
3. Commit:
   - `git commit -m "<message>"`
4. Push source code backup to the `main` branch:
   - `git push origin main`
5. Deploy the built website to `gh-pages`:
   - `npm run deploy`

Project details:

- `npm run deploy` already runs `predeploy` (`npm run build`) first.
- Deploy target is configured in `package.json`:
  - branch: `gh-pages`
  - remote: `https://github.com/jus-t-in/jus-t-in.github.io.git`
- Production URL: `https://jus-t-in.github.io/myblog`

Execution rules:

- Do not skip failed commands; stop and surface the error clearly.
- Do not replace the branch names or remote URL unless the user explicitly asks.
- If the user asks for local preview before publish, run `npm run dev` first.
