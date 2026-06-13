---
name: reference-mcp-config
description: Where Claude Code MCP servers are configured in Sabrina's environment, and how to list/edit them
metadata:
  type: reference
---

MCP servers for Claude Code live in **`~/.claude.json`** (i.e. `C:\Users\sabri\.claude.json`), in two kinds of places:
- top-level `mcpServers` object (applies globally)
- per-project `projects["<path>"].mcpServers` (e.g. `projects["C:/Users/sabri"]`)

The working dir `C:/Users/sabri/YT Claude Teste` has **no** project-scoped mcpServers — it inherits the top-level ones.

Edit safely with Python `json.load`/`json.dump` (the file is large, ~37KB; do not hand-edit blindly). Always back up first: `cp ~/.claude.json ~/.claude.json.bak-...`.

List/verify with `claude mcp list` (runs a health check). The claude.ai connectors (Canva, Google Drive, Gmail) are managed by claude.ai, not in this file.
