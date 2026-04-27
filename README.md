# HiveMOS

**Tether Mining OS (MOS) telemetry via MCP/A2A — read-only site monitoring on Hive Civilization rails**

`hive-mcp-mos` is an MCP server that wraps Tether's Mining OS (MOS) SDK behind x402-paid endpoints. Agents query hashrate, health, energy, and pool status for registered MOS sites using DID-authenticated requests over JSON-RPC 2.0.

> **Backend status:** The hivemorph backend for this vertical is not yet built. All `tools/call` requests return HTTP 503 — no mock data is returned. Backend target: Q3 2026.

> Council R4 — staged for Q3 2026 backend build

---

## Backend Status

All `tools/call` requests return HTTP 503:
```json
{ "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
```
`tools/list`, `/health`, and `/.well-known/mcp.json` are operational and return the full tool catalog.
No mock data is returned at any point.

To register interest: [hive-mcp-connector.thehiveryiq.com](https://hive-mcp-connector.thehiveryiq.com)

---

## Protocol

- **Spec:** MCP 2024-11-05 over Streamable-HTTP / JSON-RPC 2.0
- **Transport:** `POST /mcp`
- **Discovery:** `GET /.well-known/mcp.json`
- **Health:** `GET /health`
- **Auth:** X-Hive-Site-DID + signed nonce (when backend is live)
- **Settlement:** USDC on Base, Ethereum, Solana via x402 (real rails only, for paid calls when backend is live)
- **Brand gold:** Pantone 1245 C / `#C08D23`
- **Tools:** 4

---

## Tools

| Tool | Input | Description |
|---|---|---|
| `query_hashrate` | `site_did` | Current hashrate telemetry for a registered MOS site. Returns TH/s per unit, pool-accepted shares, variance window. Backend pending (Q3 2026). |
| `query_health` | `site_did` | Operational health of a registered MOS site. Returns per-unit status, temperature readings, fan RPM, error flags. Backend pending (Q3 2026). |
| `query_energy` | `site_did` | Energy consumption telemetry. Returns kW draw, efficiency (J/TH), site-level power reading. Backend pending (Q3 2026). |
| `query_pool` | `site_did` | Pool connection status. Returns active pool URL, latency, accepted/rejected share ratio, last-seen timestamp. Backend pending (Q3 2026). |

---

## Backend Endpoints (pending Q3 2026)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/mos/intel/hashrate/{site_did}` | Site hashrate telemetry |
| `GET` | `/v1/mos/intel/health/{site_did}` | Site operational health |
| `GET` | `/v1/mos/intel/energy/{site_did}` | Site energy consumption |
| `GET` | `/v1/mos/intel/pool/{site_did}` | Site pool connection status |

---

## Pricing Target (document only — not enforced in v0.1)

- Read calls: $0.01/call via x402
- Subscription tier: $10/machine/month (pending backend build)

Settlement in USDC on Base, Ethereum, or Solana. No mock receipts.

---

## Run Locally

```bash
git clone https://github.com/srotzin/hive-mcp-mos.git
cd hive-mcp-mos
npm install
npm start
# Server on http://localhost:3000
# tools/list returns tool catalog; tools/call returns 503 (backend pending)
curl http://localhost:3000/health
curl http://localhost:3000/.well-known/mcp.json
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq .result.tools[].name
```

---

## Connect from an MCP Client

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "hive_mcp_mos": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://your-deployed-host/mcp"]
    }
  }
}
```

---

## A2A Agent Card

Machine-readable capability manifest: [`agent.json`](./agent.json)

Compatible with LangChain, CrewAI, AutoGen, and any A2A-compliant orchestrator.

---

## Scope

**Read-only v0.1.** This server exposes telemetry queries only. Out of scope permanently:

- HASHRATE-PERP (permanent reject)
- Mining pool agent (legal hold)
- Securitization / Wyoming trust (legal hold)
- Autonomous machine control (read-only v0.1 only)
- Actual MOS SDK calls (backend pending — Rails Rule 1)

---

## Hive Civilization

Part of the [Hive Civilization](https://www.thehiveryiq.com) — sovereign DID, USDC settlement, HAHS legal contracts, agent-to-agent rails.

Related repositories: [hive-mcp-connector](https://github.com/srotzin/hive-mcp-connector) · [hive-mcp-mining](https://github.com/srotzin/hive-mcp-mining) · [hive-mos-plugin](https://github.com/srotzin/hive-mos-plugin)

## License

MIT (c) 2026 Steve Rotzin / Hive Civilization

This product includes references to Tether MiningOS (MOS), copyright Tether Operations Ltd., licensed Apache-2.0. See [NOTICE](./NOTICE).
