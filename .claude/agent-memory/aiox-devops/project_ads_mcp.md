---
name: project-ads-mcp
description: Meta Ads + Google Ads MCPs were migrated off paid Pipeboard; Google official MCP verified, Meta official endpoint unconfirmed
metadata:
  type: project
---

On 2026-06-12 the paid **Pipeboard** MCPs (`meta-ads` + `google-ads`, both `*.mcp.pipeboard.co` HTTP servers sharing token `pk_602521ebb8664563bbb620e1100d9b7f`) were **removed** from `~/.claude.json` to stop the recurring cost.

**Why:** Sabrina is in financial recovery and wants Pipeboard's cost gone. See [[user-sabrina]].

**How to apply / current state:**
- Removal is done. Backup at `~/.claude.json.bak-pipeboard-20260612-180552`.
- **Google Ads (UPDATED 2026-06-16):** the MCP actually wired up and working is **`@channel47/google-ads-mcp`** (npx `-y @channel47/google-ads-mcp@latest`), configured under project-scope `projects["C:/Users/sabri/YT Claude Teste"].mcpServers["google-ads"]` in `~/.claude.json` — NOT the `googleads/google-ads-mcp` pipx package. Auth is via OAuth refresh token (env: DEVELOPER_TOKEN, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, LOGIN_CUSTOMER_ID=3887668386 MCC, DEFAULT_CUSTOMER_ID=7761956605).
- **READ/WRITE toggle:** this package gates its `mutate` tool entirely on env `GOOGLE_ADS_READ_ONLY`. When `"true"` only `list_accounts` + `query` (read-only) are exposed; when `"false"` the `mutate` tool (GoogleAdsService.Mutate, defaults `dry_run=true`) is also exposed. Verified in package `server/index.js` line 161. **Flipped to `"false"` on 2026-06-16** to enable pausing keywords. Backup: `~/.claude.json.bak-gads-readonly-20260616-111853`. Env changes require a Claude Code RESTART to take effect (MCP servers spawn at session start).
- **Meta Ads:** could NOT verify an official Meta-hosted MCP endpoint (candidate "April 2026 open beta" URLs all 404 as of this session). Confirm current official link in Meta Marketing API docs before configuring. Free fallback: self-host the open-source `meta-ads-mcp` (PyPI pkg, maintained by Pipeboard at `github.com/pipeboard-co/meta-ads-mcp`) using Sabrina's OWN Meta App + access token — bypasses Pipeboard's paid hosted service.
- Full runbook with exact commands + OAuth checklist: `workspace/businesses/almacura/mcp-ads-setup-runbook.md`.

These still need Sabrina's manual OAuth/credential steps before they connect.
