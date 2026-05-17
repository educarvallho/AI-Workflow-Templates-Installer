# Claude Code Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Claude Code as a fully supported IDE option in the installer, enabling installation of workflows to `~/.claude/commands/`, templates to `~/.claude/TEMPLATES_WORKFLOWS/`, and MCPs to `~/.claude/settings.json`.

**Architecture:** Each IDE's config is isolated behind three lookup functions — `getIDEPaths`, `getMcpConfigPath`, and `IDE_RULES_CONFIG` — plus a per-server `configClaudeCode` shape in `mcp-servers.js`. The CLI selects the right shape at merge time. No new files are needed; all changes are additive to existing lookup tables and conditional branches.

**Tech Stack:** Node.js 14+, no test framework present in the project (verification is manual via `node install.js` dry-run inspection).

---

## File Map

| File | Change |
|---|---|
| `src/config.js` | Add `claudecode` branch to `getIDEPaths` + entry in `IDE_RULES_CONFIG` |
| `src/mcp-installer.js` | Add `claudecode` branch to `getMcpConfigPath` |
| `src/mcp-servers.js` | Add `configClaudeCode` shape to `context7` server |
| `src/cli.js` | New IDE choice, update "Todos" list, expand baseConfig selection logic |
| `README.md` | Document Claude Code paths, MCP config location, and updated "Todos" label |

---

## Task 1: Add Claude Code to `getIDEPaths` and `IDE_RULES_CONFIG`

**Files:**
- Modify: `src/config.js:38-59` (getIDEPaths)
- Modify: `src/config.js:113-134` (IDE_RULES_CONFIG)

- [ ] **Step 1: Add `claudecode` branch to `getIDEPaths`**

In `src/config.js`, insert the new `if` block between the `antigravity` block and the cursor `return` (before line 55):

```js
  if (ide === 'claudecode') {
    return {
      workflows: path.join(home, '.claude', 'commands'),
      templates: path.join(home, '.claude', 'TEMPLATES_WORKFLOWS'),
    };
  }
```

The function should now look like:

```js
function getIDEPaths(ide) {
  const home = os.homedir();

  if (ide === 'windsurf') {
    return {
      workflows: path.join(home, '.codeium', 'windsurf', 'global_workflows'),
      templates: path.join(home, '.codeium', 'windsurf', 'TEMPLATES_WORKFLOWS'),
    };
  }

  if (ide === 'antigravity') {
    return {
      workflows: path.join(home, '.gemini', 'antigravity', 'global_workflows'),
      templates: path.join(home, '.gemini', 'antigravity', 'TEMPLATES_WORKFLOWS'),
    };
  }

  if (ide === 'claudecode') {
    return {
      workflows: path.join(home, '.claude', 'commands'),
      templates: path.join(home, '.claude', 'TEMPLATES_WORKFLOWS'),
    };
  }

  return {
    workflows: path.join(home, '.cursor', 'commands'),
    templates: path.join(home, '.cursor', 'TEMPLATES_WORKFLOWS'),
  };
}
```

- [ ] **Step 2: Add `claudecode` entry to `IDE_RULES_CONFIG`**

In `src/config.js`, append `claudecode` to the `IDE_RULES_CONFIG` object (after the `antigravity` entry, before the closing `}`):

```js
  claudecode: {
    rulesDir: '.claude',
    fileExt: '.md',
    name: 'Claude Code',
    ruleFrontmatter: (_description) => '',
  },
```

The full `IDE_RULES_CONFIG` should now be:

```js
const IDE_RULES_CONFIG = {
  windsurf: {
    rulesDir: '.windsurf/rules',
    fileExt: '.md',
    name: 'Windsurf',
    ruleFrontmatter: (description) =>
      `---\ntrigger: model_decision\ndescription: ${description}\n---`,
  },
  cursor: {
    rulesDir: '.cursor/rules',
    fileExt: '.md',
    name: 'Cursor',
    ruleFrontmatter: (description) =>
      `---\ndescription: ${description}\nalwaysApply: true\n---`,
  },
  antigravity: {
    rulesDir: '.agents/rules',
    fileExt: '.md',
    name: 'Antigravity',
    ruleFrontmatter: (_description) => '',
  },
  claudecode: {
    rulesDir: '.claude',
    fileExt: '.md',
    name: 'Claude Code',
    ruleFrontmatter: (_description) => '',
  },
};
```

- [ ] **Step 3: Verify manually**

Run in Node REPL:
```bash
node -e "
const { getIDEPaths, IDE_RULES_CONFIG } = require('./src/config');
console.log(getIDEPaths('claudecode'));
console.log(IDE_RULES_CONFIG.claudecode);
"
```

Expected output (Windows):
```
{ workflows: 'C:\\Users\\<User>\\.claude\\commands', templates: 'C:\\Users\\<User>\\.claude\\TEMPLATES_WORKFLOWS' }
{ rulesDir: '.claude', fileExt: '.md', name: 'Claude Code', ruleFrontmatter: [Function: ruleFrontmatter] }
```

- [ ] **Step 4: Commit**

```bash
git add src/config.js
git commit -m "feat: add claudecode paths and rules config"
```

---

## Task 2: Add Claude Code to `getMcpConfigPath`

**Files:**
- Modify: `src/mcp-installer.js:16-24` (getMcpConfigPath)

- [ ] **Step 1: Add `claudecode` branch**

In `src/mcp-installer.js`, insert the new `if` block between the `antigravity` check and the cursor `return` (before line 23):

```js
  if (ide === 'claudecode') {
    return path.join(home, '.claude', 'settings.json');
  }
```

The function should now look like:

```js
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
```

- [ ] **Step 2: Verify manually**

```bash
node -e "
const os = require('os');
const { getMcpConfigPath } = require('./src/mcp-installer');
console.log(getMcpConfigPath('claudecode', os.homedir()));
"
```

Expected (Windows):
```
C:\Users\<User>\.claude\settings.json
```

- [ ] **Step 3: Commit**

```bash
git add src/mcp-installer.js
git commit -m "feat: add claudecode mcp config path"
```

---

## Task 3: Add `configClaudeCode` shape to Context7

**Files:**
- Modify: `src/mcp-servers.js:17-25` (context7 entry)

- [ ] **Step 1: Add `configClaudeCode` field to `context7`**

In `src/mcp-servers.js`, add `configClaudeCode` after the existing `configCursor` field in the `context7` object:

```js
    configClaudeCode: {
      type: 'http',
      url: 'https://mcp.context7.com/mcp',
    },
```

The full `context7` entry should now be:

```js
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
```

Note: `mcp-playwright` needs no change — its `config` shape (`{ command, args }`) is valid for Claude Code as-is.

- [ ] **Step 2: Verify manually**

```bash
node -e "
const { MCP_SERVERS } = require('./src/mcp-servers');
console.log(MCP_SERVERS.context7.configClaudeCode);
"
```

Expected:
```
{ type: 'http', url: 'https://mcp.context7.com/mcp' }
```

- [ ] **Step 3: Commit**

```bash
git add src/mcp-servers.js
git commit -m "feat: add configClaudeCode shape to context7 mcp server"
```

---

## Task 4: Update CLI to support Claude Code as an IDE option

**Files:**
- Modify: `src/cli.js:86-100` (IDE choices + ides array)
- Modify: `src/cli.js:282-286` (baseConfig selection)

- [ ] **Step 1: Add Claude Code to the IDE choices list and update "Todos"**

In `src/cli.js`, replace the `choices` array inside the IDE `inquirer.prompt` (around line 88-96) with:

```js
      choices: [
        { name: '🌊  Windsurf', value: 'windsurf' },
        { name: '🖱️   Cursor', value: 'cursor' },
        { name: '🪐  Antigravity', value: 'antigravity' },
        { name: '🤖  Claude Code', value: 'claudecode' },
        { name: '📦  Todos (Windsurf + Cursor + Antigravity + Claude Code)', value: 'all-ides' },
      ],
```

- [ ] **Step 2: Update the `ides` array to include `claudecode` in "Todos"**

Replace line 100:
```js
  const ides = ide === 'all-ides' ? ['windsurf', 'cursor', 'antigravity'] : [ide];
```
with:
```js
  const ides = ide === 'all-ides' ? ['windsurf', 'cursor', 'antigravity', 'claudecode'] : [ide];
```

- [ ] **Step 3: Expand baseConfig selection to handle `claudecode`**

In `src/cli.js`, replace the existing `baseConfig` assignment (around line 283-286):

```js
      // Use configCursor for Cursor IDE if available, otherwise use default config
      const baseConfig = currentIde === 'cursor' && srv.configCursor 
        ? { ...srv.configCursor }
        : { ...srv.config };
```

with:

```js
      let baseConfig;
      if (currentIde === 'cursor' && srv.configCursor) {
        baseConfig = { ...srv.configCursor };
      } else if (currentIde === 'claudecode' && srv.configClaudeCode) {
        baseConfig = { ...srv.configClaudeCode };
      } else {
        baseConfig = { ...srv.config };
      }
```

- [ ] **Step 4: Verify the full interactive flow works**

```bash
node install.js
```

Walk through the prompts and verify:
- "Claude Code" appears in the IDE list
- "Todos" label shows all four IDEs
- Selecting Claude Code shows correct install paths (`~/.claude/commands/` and `~/.claude/TEMPLATES_WORKFLOWS/`)
- MCP config step completes without error

- [ ] **Step 5: Commit**

```bash
git add src/cli.js
git commit -m "feat: add claude code ide option to installer cli"
```

---

## Task 5: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add Claude Code to the pré-requisitos section**

In `README.md`, update the prerequisites list to include Claude Code:

```markdown
- **Node.js** v14 ou superior
- **Windsurf**, **Cursor**, **Antigravity** e/ou **Claude Code** instalados
```

- [ ] **Step 2: Add Claude Code paths table**

After the Antigravity paths table (after line 74), add:

```markdown
### Claude Code

| SO      | Commands (Global)                    | Templates                                   |
| ------- | ------------------------------------ | ------------------------------------------- |
| Windows | `C:\Users\<User>\.claude\commands\`  | `C:\Users\<User>\.claude\TEMPLATES_WORKFLOWS\` |
| macOS   | `~/.claude/commands/`                | `~/.claude/TEMPLATES_WORKFLOWS/`             |
| Linux   | `~/.claude/commands/`                | `~/.claude/TEMPLATES_WORKFLOWS/`             |
```

- [ ] **Step 3: Add Claude Code to the MCP config files table**

In the "Arquivos de configuração MCP por IDE" table (around line 370), add a row:

```markdown
| **Claude Code** | `settings.json` | `C:\Users\<User>\.claude\settings.json` | `~/.claude/settings.json` |
```

- [ ] **Step 4: Update the MCP config format section**

After the existing format examples (around line 406), add a note about the Claude Code format:

```markdown
### Claude Code — Formato gerado

Com API Key:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "sua-api-key-aqui"
      }
    }
  }
}
```

> **Nota:** O instalador faz merge no `settings.json` do Claude Code preservando todas as outras configurações existentes no arquivo (tema, permissões, etc.).
```

- [ ] **Step 5: Update the "Todos" description in the README**

Find the "Todos" option description and update:
```markdown
   - Para qual IDE deseja instalar (Windsurf, Cursor, Antigravity, Claude Code ou todos)
```

And in the FAQ:
```markdown
**Posso instalar para múltiplas IDEs?**
Sim. Selecione a opção "Todos" durante a instalação. Os templates e workflows serão instalados nos caminhos de todas as IDEs (Windsurf, Cursor, Antigravity e Claude Code).
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: add claude code to readme (paths, mcp config, todos)"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 5 design points covered — `getIDEPaths`, `IDE_RULES_CONFIG`, `getMcpConfigPath`, `configClaudeCode`, CLI choices + baseConfig logic.
- [x] **Placeholder scan:** No TBD/TODO entries. All code blocks are complete.
- [x] **Type consistency:** `claudecode` string key used consistently across all files. `configClaudeCode` field name matches in both `mcp-servers.js` (definition) and `cli.js` (consumption). `IDE_RULES_CONFIG.claudecode.name` is `'Claude Code'` — used in display only, no cross-file dependency.
- [x] **Edge case — `processor.js`:** `adaptFrontmatter` strips `auto_execution_mode` for any IDE that is not `windsurf` or `antigravity`. `claudecode` inherits this behavior with no code change needed. Verified by reading `processor.js:97`.
- [x] **Edge case — `mergeMcpConfig`:** Reads entire JSON, only touches `mcpServers`, writes back full object. Safely merges into Claude Code's `settings.json` without losing existing keys (theme, permissions, etc.).
