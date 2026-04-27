# HiveMOS MCP Server — v1.0.0

## Overview

Initial scaffold for `hive-mcp-mos`. The MCP server is structurally complete: `tools/list`, `/health`, and `/.well-known/mcp.json` are operational. The hivemorph backend for this vertical is not yet built. All `tools/call` requests return HTTP 503 — no mock data, no simulated responses.

---

## Tools

| Tool | Description |
|---|---|
| `query_hashrate` | Returns TH/s per unit, pool-accepted shares, and variance window for a registered MOS site. Backend pending (Q3 2026). |
| `query_health` | Returns per-unit status, temperature readings, fan RPM, and error flags. Backend pending (Q3 2026). |
| `query_energy` | Returns kW draw, efficiency (J/TH), and site-level power reading. Backend pending (Q3 2026). |
| `query_pool` | Returns active pool URL, latency, accepted/rejected share ratio, and last-seen timestamp. Backend pending (Q3 2026). |

---

## Backend Endpoints (pending Q3 2026)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/mos/intel/hashrate/{site_did}` | Site hashrate telemetry |
| `GET` | `/v1/mos/intel/health/{site_did}` | Site operational health |
| `GET` | `/v1/mos/intel/energy/{site_did}` | Site energy consumption |
| `GET` | `/v1/mos/intel/pool/{site_did}` | Site pool connection status |

---

## Settlement

Read operations. Pricing target: $0.01/call via x402 when backend is live. Settlement in USDC on Base, Ethereum, or Solana. No mock receipts.

---

## Status

- **Backend:** v0.1 — pending hivemorph build (Q3 2026 spec)
- **Council:** R4
- **`tools/list`:** operational
- **`/health`:** operational
- **`/.well-known/mcp.json`:** operational
- **`tools/call`:** returns HTTP 503

```json
{
  "error": "feature gating: backend pending; submit interest at hive-mcp-connector",
  "backend_status": "v0.1 — pending hivemorph backend build (Q3 2026 spec)",
  "service": "hive-mcp-mos",
  "interest_url": "https://hive-mcp-connector.thehiveryiq.com"
}
```

---

## Brand

Pantone 1245 C / `#C08D23`

---

## Constraints

- No mock data, no simulated settlement at any point
- Brand gold: Pantone 1245 C / `#C08D23`
- No HASHRATE-PERP, GAS-PERP, GPU-PERP, mining pool agent, or securitization
- Read-only v0.1 — no autonomous machine control
- LLM calls route only through `https://hivecompute-g2g7.onrender.com/v1/compute/chat/completions`
- hivemorph remains private; this repository is the public surface
