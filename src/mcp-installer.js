'use strict';

const fs = require('fs');
const path = require('path');

// ============================================================
// MCP Config file management
// ============================================================

/**
 * Returns the full path to the MCP config file for the given IDE.
 *   Windsurf     → ~/.codeium/windsurf/mcp_config.json
 *   Cursor       → ~/.cursor/mcp.json
 *   Antigravity  → ~/.gemini/antigravity/mcp_config.json
 *   Claude Code  → ~/.claude/settings.json
 */
function getMcpConfigPath(ide, home) {
  if (ide === 'windsurf') {
    return path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
  }
  if (ide === 'antigravity') {
    return path.join(home, '.gemini', 'antigravity', 'mcp_config.json');
  }
  if (ide === 'claudecode') {
    return path.join(home, '.claude', 'settings.json');
  }
  return path.join(home, '.cursor', 'mcp.json');
}

/**
 * Reads the existing MCP config file (if any) and returns it as an object.
 * Returns a skeleton `{ mcpServers: {} }` when the file doesn't exist or is invalid.
 */
function readMcpConfig(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.mcpServers) parsed.mcpServers = {};
      return parsed;
    }
  } catch {
    // corrupt / unreadable — start fresh
  }
  return { mcpServers: {} };
}

/**
 * Merges selected MCP server definitions into an existing config
 * and writes the result to disk.
 *
 * @param {string} filePath  Absolute path to the MCP config JSON.
 * @param {Object} servers   Map of serverName → config object to merge.
 * @returns {{ added: string[], skipped: string[] }}
 */
function mergeMcpConfig(filePath, servers) {
  const config = readMcpConfig(filePath);
  const added = [];
  const skipped = [];

  for (const [name, serverConfig] of Object.entries(servers)) {
    if (config.mcpServers[name]) {
      skipped.push(name);
    } else {
      config.mcpServers[name] = serverConfig;
      added.push(name);
    }
  }

  // Ensure directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf-8');

  return { added, skipped };
}

module.exports = {
  getMcpConfigPath,
  readMcpConfig,
  mergeMcpConfig,
};
