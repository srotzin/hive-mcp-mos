#!/usr/bin/env node
/**
 * hive-mcp-mos/src/index.js
 *
 * HiveMOS MCP Server
 * Tether Mining OS (MOS) telemetry via MCP/A2A — read-only site monitoring
 *
 * Backend  : https://hivemorph.onrender.com
 * Status   : v0.1 — pending hivemorph backend build (Q3 2026 spec)
 * Spec     : MCP 2024-11-05 / Streamable-HTTP / JSON-RPC 2.0
 * Brand    : Hive Civilization gold #C08D23 (Pantone 1245 C)
 *
 * RAILS RULE 1 — NO MOCK RESPONSES.
 * All tool calls return HTTP 503 until the backend is live.
 * Agents receive: { "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
 *
 * Three gates per endpoint: NEED + YIELD + CLEAN-MONEY
 *   NEED        : Mining operators need a protocol-neutral telemetry shim
 *                 that routes site data into agent-native rails without
 *                 replacing MOS or requiring SDK access today.
 *   YIELD       : $0.01/call read tier, $10/machine/month subscription
 *                 (pending backend build, Q3 2026 spec).
 *   CLEAN-MONEY : Read-only. No autonomous machine control. No HASHRATE-PERP.
 *                 No mining pool agent. No securitization. Settlement in USDC
 *                 on Base, Ethereum, Solana via x402.
 *
 * Out of scope — permanently: HASHRATE-PERP, mining pool agent, securitization,
 * Wyoming trust, autonomous machine control, GAS-PERP, GPU-PERP.
 *
 * License: MIT
 */

import express from 'express';
import { renderLanding, renderRobots, renderSitemap, renderSecurity, renderOgImage, seoJson, BRAND_GOLD } from '../meta.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HIVE_BASE = process.env.HIVE_BASE || 'https://hivemorph.onrender.com';

// ─── Tool definitions ────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'query_hashrate',
    description: 'Query the current hashrate telemetry for a registered MOS site. Returns TH/s per unit, pool-accepted shares, and variance window. Read-only. Backend pending (Q3 2026).',
    inputSchema: {
      type: 'object',
      required: ['site_did'],
      properties: {
        site_did: {
          type: 'string',
          description: 'Decentralized Identifier (DID) of the registered MOS site (e.g. did:hive:mos:0x...)',
        },
      },
    },
  },
  {
    name: 'query_health',
    description: 'Query operational health of a registered MOS site. Returns per-unit status, temperature readings, fan RPM, and error flags. Read-only. Backend pending (Q3 2026).',
    inputSchema: {
      type: 'object',
      required: ['site_did'],
      properties: {
        site_did: {
          type: 'string',
          description: 'Decentralized Identifier (DID) of the registered MOS site',
        },
      },
    },
  },
  {
    name: 'query_energy',
    description: 'Query energy consumption telemetry for a registered MOS site. Returns kW draw, efficiency (J/TH), and site-level power reading. Read-only. Backend pending (Q3 2026).',
    inputSchema: {
      type: 'object',
      required: ['site_did'],
      properties: {
        site_did: {
          type: 'string',
          description: 'Decentralized Identifier (DID) of the registered MOS site',
        },
      },
    },
  },
  {
    name: 'query_pool',
    description: 'Query pool connection status for a registered MOS site. Returns active pool URL, latency, accepted/rejected share ratio, and last-seen timestamp. Read-only. Backend pending (Q3 2026).',
    inputSchema: {
      type: 'object',
      required: ['site_did'],
      properties: {
        site_did: {
          type: 'string',
          description: 'Decentralized Identifier (DID) of the registered MOS site',
        },
      },
    },
  },
];


const SERVICE_CFG = {
  service: "hive-mcp-mos",
  shortName: "HiveMOS",
  title: "HiveMOS \u00b7 Mining OS Plugin & Energy Arbitrage MCP",
  tagline: "Tether MOS site telemetry, mining intelligence, and energy arbitrage agent.",
  description: "MCP server for HiveMOS \u2014 Tether Mining OS (MOS) plugin and energy arbitrage agent on the Hive Civilization. Site monitoring, mining intelligence, hashrate analytics, energy-arbitrage signals. USDC/USDT settlement on Base, Ethereum, or Solana. Real rails.",
  keywords: ["mcp", "model-context-protocol", "x402", "agentic", "ai-agent", "ai-agents", "llm", "hive", "hive-civilization", "depin", "mining-os", "mos", "tether", "mining-intelligence", "energy-arbitrage", "hashrate-analytics", "site-telemetry", "usdc", "usdt", "base", "base-l2", "agent-economy", "a2a"],
  externalUrl: "https://hive-mcp-gateway.onrender.com/mos",
  gatewayMount: "/mos",
  version: "1.0.1",
  pricing: [
    { name: "mos_query_sites", priceUsd: 0, label: "Query sites \u2014 free" },
    { name: "mos_query_telemetry", priceUsd: 0.001, label: "Query telemetry (Tier 1)" },
    { name: "mos_energy_arb_signals", priceUsd: 0.005, label: "Energy-arb signals (Tier 2)" }
  ],
};
SERVICE_CFG.tools = (typeof TOOLS !== 'undefined' ? TOOLS : []).map(t => ({ name: t.name, description: t.description }));
// ─── Feature-gate response (Rails Rule 1 — no mock) ──────────────────────────
function featureGate(res) {
  return res.status(503).json({
    error: 'feature gating: backend pending; submit interest at hive-mcp-connector',
    backend_status: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
    service: 'hive-mcp-mos',
    interest_url: 'https://hive-mcp-connector.thehiveryiq.com',
  });
}

// ─── MCP JSON-RPC handler ────────────────────────────────────────────────────
app.post('/mcp', async (req, res) => {
  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC' } });
  }
  try {
    switch (method) {
      case 'initialize':
        return res.json({ jsonrpc: '2.0', id, result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'hive-mcp-mos',
            version: '1.0.0',
            description: 'Tether MOS telemetry via MCP/A2A — read-only site monitoring on Hive Civilization rails',
            backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
          },
        } });
      case 'tools/list':
        return res.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      case 'tools/call':
        // Rails Rule 1: backend not yet live — return honest 503, no mock data.
        return featureGate(res);
      case 'ping':
        return res.json({ jsonrpc: '2.0', id, result: {} });
      default:
        return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err) {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32000, message: err.message } });
  }
});

// ─── Discovery + health ──────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'ok',
  service: 'hive-mcp-mos',
  version: '1.0.0',
  backend: HIVE_BASE,
  backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
  toolCount: TOOLS.length,
  brand: '#C08D23',
}));

app.get('/.well-known/mcp.json', (req, res) => res.json({
  name: 'hive-mcp-mos',
  endpoint: '/mcp',
  transport: 'streamable-http',
  protocol: '2024-11-05',
  backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
  tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
}));


// HIVE_META_BLOCK_v1 — comprehensive meta tags + JSON-LD + crawler discovery
app.get('/', (req, res) => {
  res.type('text/html; charset=utf-8').send(renderLanding(SERVICE_CFG));
});
app.get('/og.svg', (req, res) => {
  res.type('image/svg+xml').send(renderOgImage(SERVICE_CFG));
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(renderRobots(SERVICE_CFG));
});
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(renderSitemap(SERVICE_CFG));
});
app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send(renderSecurity());
});
app.get('/seo.json', (req, res) => res.json(seoJson(SERVICE_CFG)));
app.listen(PORT, () => {
  console.log('HiveMOS MCP Server running on :' + PORT);
  console.log('  Backend : ' + HIVE_BASE);
  console.log('  Status  : v0.1 — pending hivemorph backend build (Q3 2026 spec)');
  console.log('  Tools   : ' + TOOLS.length + ' (query_hashrate, query_health, query_energy, query_pool)');
  console.log('  Rails   : tool calls return 503 until backend is live (no mock)');
});
