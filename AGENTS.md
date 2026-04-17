# AGENTS.md

## Deployment Rules

- This repository must use the HTTPS remote, not SSH.
- Expected `origin`: `https://github.com/tammat11/ICwebsite.git`
- Do not use `git@github.com:...` because sandboxed agents may be blocked from reading `~/.ssh/known_hosts`.
- Before pushing, verify the remote with `git remote -v`.
- If push fails because GitHub credentials are missing, stop and ask the user to authenticate HTTPS Git access on this machine.

## Preferred Deploy Flow

- Build locally first with `npm run build` from the repository root.
- For Vercel production deploys, prefer `npx vercel deploy --prod --yes` from the repository root.
- This project is already linked to Vercel via `.vercel/project.json`.
- If Vercel CLI is not installed, `npx vercel ...` is acceptable.
- If Vercel authentication is missing, ask the user for a `VERCEL_TOKEN` or for an interactive `vercel login`.

## Git Push Flow

- After a successful build, push with `git push origin main`.
- If the branch is not `main`, push the current branch explicitly.
- Do not tell the user the push is blocked by SSH unless the remote is actually using SSH.

## Verification

- Treat `npm run build` as the minimum pre-deploy check.
- If the task touches Bitrix or any mass operation, test one safe case first, show the result to the user, then continue with broader actions.
