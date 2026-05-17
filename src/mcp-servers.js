'use strict';

/**
 * MCP server definitions.
 * Each key is the server name used in mcpServers config.
 * `label` and `description` are displayed in the CLI prompt.
 * `config` is the object merged into the IDE's MCP config file.
 * `requiresApiKey` flags if the user should be prompted for a key.
 * `apiKeyEnvVar` is the header/env name where the key goes.
 */
const MCP_SERVERS = {
  context7: {
    label: '📚  Context7 — Documentação de bibliotecas em tempo real',
    description: 'Busca docs atualizadas de qualquer lib/framework via Context7 API',
    requiresApiKey: true,
    apiKeyEnvVar: 'CONTEXT7_API_KEY',
    signupUrl: 'https://context7.com/',
    signupInstructions: 'Acesse o site, faça login e gere sua API Key em Settings → API Keys.',
    config: {
      serverUrl: 'https://mcp.context7.com/mcp',
    },
    configCursor: {
      url: 'https://mcp.context7.com/mcp',
    },
    configClaudeCode: {
      type: 'http',
      url: 'https://mcp.context7.com/mcp',
    },
  },
  'mcp-playwright': {
    label: '🎭  Playwright — Automação de browser e testes E2E',
    description: 'Permite controlar navegadores para testes, screenshots e automação web',
    requiresApiKey: false,
    config: {
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest'],
    },
  },
};

module.exports = { MCP_SERVERS };
