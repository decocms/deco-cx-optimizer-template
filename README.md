### deco-cx-optimizer

Deco CMS app with opinionated performance guides, playbooks, and helper views to harden and speed up deco.cx stores. It ships ready-to-browse documentation (JSON) and utilities you can add to any Deco site.

- One‑click install (imports the template into your Deco CMS org):
[Deploy to deco](https://admin.decocms.com/?importGithub=decocms/deco-cx-optimizer-template)

#### What’s inside
- `documents/` — curated guides (performance principles, async rendering, loader caching, images, fonts, scripts, islands, etc.). Start at “0. 📚 Documentation INDEX: Quick Reference Guide”.
- `views/Markdown-to-Documents-Uploader.tsx` — optional view to upload Markdown and create Document entries in your site.
- `agents/` and `database/` — building blocks used by the optimizer (e.g., for MCP-based workflows).
- `deco.mcp.json` — MCP configuration for tools that integrate with the optimizer.

#### How to use (after installing)
1. Open your site in Deco Admin.
2. Mention (@) the index document and ask the agent to optimize your site.


