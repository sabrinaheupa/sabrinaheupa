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
- **Google Ads:** official free MCP confirmed at `github.com/googleads/google-ads-mcp` (Google's `googleads` org). Runs locally via `pipx run --spec git+...`. Needs: GCP project + Google Ads API enabled + Developer Token (Explorer access) + ADC OAuth (`gcloud auth application-default login`, scope `.../auth/adwords`).
- **Meta Ads:** could NOT verify an official Meta-hosted MCP endpoint (candidate "April 2026 open beta" URLs all 404 as of this session). Confirm current official link in Meta Marketing API docs before configuring. Free fallback: self-host the open-source `meta-ads-mcp` (PyPI pkg, maintained by Pipeboard at `github.com/pipeboard-co/meta-ads-mcp`) using Sabrina's OWN Meta App + access token — bypasses Pipeboard's paid hosted service.
- Full runbook with exact commands + OAuth checklist: `workspace/businesses/almacura/mcp-ads-setup-runbook.md`.

These still need Sabrina's manual OAuth/credential steps before they connect.
