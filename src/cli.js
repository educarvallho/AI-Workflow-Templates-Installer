'use strict';

const os = require('os');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { detectOS, getIDEPaths, WORKFLOW_META, IDE_RULES_CONFIG } = require('./config');
const { installTemplates, installWorkflows } = require('./installer');
const { MCP_SERVERS } = require('./mcp-servers');
const { getMcpConfigPath, mergeMcpConfig } = require('./mcp-installer');

// ============================================================
// Display helpers
// ============================================================

function banner() {
  console.log('');
  console.log(chalk.cyan('  ╔═══════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('  ║') + chalk.white.bold('   🚀  AI Workflow Templates — Installer           ') + chalk.cyan('║'));
  console.log(chalk.cyan('  ╚═══════════════════════════════════════════════════╝'));
  console.log('');
}

function printResults(label, results) {
  console.log(chalk.cyan.bold(`\n  ${label}\n`));
  for (const r of results) {
    if (r.ok) {
      console.log(chalk.green(`    ✔  ${r.file}`));
    } else {
      console.log(chalk.yellow(`    ⚠  ${r.file} — ${r.reason}`));
    }
  }
}

function printSummary() {
  console.log('');
  console.log(chalk.green.bold('  ═══════════════════════════════════════════'));
  console.log(chalk.green.bold('    ✅  Instalação concluída com sucesso!'));
  console.log(chalk.green.bold('  ═══════════════════════════════════════════'));
  console.log('');

  console.log(chalk.white.bold('  Workflows disponíveis:\n'));
  for (const [file, meta] of Object.entries(WORKFLOW_META)) {
    const cmd = file.replace('.md', '');
    console.log(chalk.gray(`    /${cmd}`) + chalk.white(` — ${meta.description}`));
  }

  console.log('');
  console.log(
    chalk.gray('  Abra sua IDE e digite ') +
      chalk.white.bold('/') +
      chalk.gray(' seguido do nome do workflow para executá-lo.\n'),
  );
}

// ============================================================
// Main interactive flow
// ============================================================

async function run() {
  banner();

  const osName = detectOS();
  console.log(chalk.gray('  SO detectado : ') + chalk.white.bold(osName));
  console.log(chalk.gray('  Usuário      : ') + chalk.white.bold(os.userInfo().username));
  console.log(chalk.gray('  Home         : ') + chalk.white.bold(os.homedir()));
  console.log('');

  // 1. Choose installation mode
  const { installMode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'installMode',
      message: 'O que deseja instalar/atualizar?',
      choices: [
        { name: '📦  Workflows + Templates + MCPs', value: 'all' },
        { name: '📄  Apenas Workflows + Templates', value: 'workflows' },
        { name: '🔌  Apenas MCPs', value: 'mcps' },
      ],
    },
  ]);

  const installWorkflowsAndTemplates = installMode === 'all' || installMode === 'workflows';
  const installMcps = installMode === 'all' || installMode === 'mcps';

  // 2. Choose IDE
  const { ide } = await inquirer.prompt([
    {
      type: 'list',
      name: 'ide',
      message: 'Para qual IDE deseja instalar?',
      choices: [
        { name: '🌊  Windsurf', value: 'windsurf' },
        { name: '🖱️   Cursor', value: 'cursor' },
        { name: '�  Antigravity', value: 'antigravity' },
        { name: '🤖  Claude Code', value: 'claudecode' },
        { name: '📦  Todos (Windsurf + Cursor + Antigravity + Claude Code)', value: 'all-ides' },
      ],
    },
  ]);

  const ides = ide === 'all-ides' ? ['windsurf', 'cursor', 'antigravity', 'claudecode'] : [ide];

  // 3. Show paths and confirm
  if (installWorkflowsAndTemplates) {
    console.log(chalk.cyan('\n  Caminhos de instalação:\n'));

    for (const currentIde of ides) {
      const paths = getIDEPaths(currentIde);
      const label = IDE_RULES_CONFIG[currentIde].name;
      console.log(chalk.white.bold(`  ── ${label} ──`));
      console.log(chalk.gray(`    Workflows → `) + chalk.white(paths.workflows));
      console.log(chalk.gray(`    Templates → `) + chalk.white(paths.templates));
      console.log('');
    }

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Confirma a instalação nos caminhos acima?',
        default: true,
      },
    ]);

    if (!proceed) {
      console.log(chalk.yellow('\n  Instalação cancelada pelo usuário.\n'));
      process.exit(0);
    }
  }

  // 4. Install workflows and templates
  if (installWorkflowsAndTemplates) {
    for (const currentIde of ides) {
      const paths = getIDEPaths(currentIde);
      const label = IDE_RULES_CONFIG[currentIde].name;

      const tplResults = installTemplates(paths.templates, currentIde);
      printResults(`📁  Templates → ${label}`, tplResults);

      const wfResults = installWorkflows(paths.workflows, paths.templates, currentIde);
      printResults(`📄  Workflows → ${label}`, wfResults);
    }
  }

  // 5. MCP configuration
  if (installMcps) {
    await promptMcpSetup(ides, installMode === 'mcps');
  }

  // 6. Summary
  printSummary();
}

// ============================================================
// Browser helper
// ============================================================

function openBrowser(url) {
  const { exec } = require('child_process');
  const platform = os.platform();

  if (platform === 'win32') {
    exec(`start "" "${url}"`);
  } else if (platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
}

// ============================================================
// MCP configuration flow
// ============================================================

async function promptMcpSetup(ides, skipConfirmation = false) {
  // Skip confirmation if user explicitly chose "Apenas MCPs" mode
  if (!skipConfirmation) {
    const { configureMcp } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'configureMcp',
        message: 'Deseja configurar servidores MCP (ex: Context7)?',
        default: true,
      },
    ]);

    if (!configureMcp) return;
  }

  // Build choices from available MCP servers
  const mcpChoices = Object.entries(MCP_SERVERS).map(([key, srv]) => ({
    name: srv.label,
    value: key,
    checked: true,
  }));

  const { selectedMcps } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedMcps',
      message: 'Quais MCPs deseja configurar?',
      choices: mcpChoices,
    },
  ]);

  if (selectedMcps.length === 0) {
    console.log(chalk.gray('\n  Nenhum MCP selecionado.\n'));
    return;
  }

  // Collect API keys for servers that require them
  const selectedServersData = {};
  for (const name of selectedMcps) {
    const srv = MCP_SERVERS[name];
    let apiKey = '';

    if (srv.requiresApiKey) {
      // 1. Try reading from environment variable
      const envValue = process.env[srv.apiKeyEnvVar];
      if (envValue && envValue.trim()) {
        apiKey = envValue.trim();
        console.log(
          chalk.green(`\n    ✔  ${name}: API Key lida da variável de ambiente `) +
            chalk.white.bold(srv.apiKeyEnvVar),
        );
      } else {
        // 2. Open signup URL in browser if available
        if (srv.signupUrl) {
          console.log('');
          console.log(chalk.cyan.bold(`  🔑  ${name} — API Key necessária\n`));
          console.log(chalk.gray(`    ${srv.signupInstructions || ''}`));
          console.log(chalk.gray('    URL: ') + chalk.white.underline(srv.signupUrl));
          console.log('');

          const { openLink } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'openLink',
              message: `Abrir ${srv.signupUrl} no navegador para gerar a API Key?`,
              default: true,
            },
          ]);

          if (openLink) {
            openBrowser(srv.signupUrl);
            console.log(chalk.gray('\n    Aguardando você gerar a API Key...\n'));
          }
        }

        // 3. Prompt for manual input
        const { inputKey } = await inquirer.prompt([
          {
            type: 'input',
            name: 'inputKey',
            message: `Cole a API Key para ${name} (${srv.apiKeyEnvVar}):`,
          },
        ]);

        if (inputKey && inputKey.trim()) {
          apiKey = inputKey.trim();
        }
      }

      if (!apiKey) {
        console.log(
          chalk.yellow(`\n    ⚠  ${name}: Nenhuma API Key fornecida. O MCP será configurado sem autenticação.\n`),
        );
      }
    }

    selectedServersData[name] = { srv, apiKey };
  }

  // Merge into each IDE's config
  const home = os.homedir();

  for (const currentIde of ides) {
    const configPath = getMcpConfigPath(currentIde, home);
    const label = IDE_RULES_CONFIG[currentIde].name;

    // Build IDE-specific server configs
    const serversToInstall = {};
    for (const [name, { srv, apiKey }] of Object.entries(selectedServersData)) {
      let baseConfig;
      if (currentIde === 'cursor' && srv.configCursor) {
        baseConfig = { ...srv.configCursor };
      } else if (currentIde === 'claudecode' && srv.configClaudeCode) {
        baseConfig = { ...srv.configClaudeCode };
      } else {
        baseConfig = { ...srv.config };
      }

      if (srv.requiresApiKey && apiKey) {
        if (!baseConfig.headers) baseConfig.headers = {};
        baseConfig.headers[srv.apiKeyEnvVar] = apiKey;
      }

      serversToInstall[name] = baseConfig;
    }

    const { added, skipped } = mergeMcpConfig(configPath, serversToInstall);

    console.log(chalk.cyan.bold(`\n  🔌  MCP Config → ${label}\n`));
    console.log(chalk.gray(`    Arquivo: ${configPath}`));

    for (const s of added) {
      console.log(chalk.green(`    ✔  ${s} — adicionado`));
    }
    for (const s of skipped) {
      console.log(chalk.yellow(`    ⏭  ${s} — já existia (não sobrescrito)`));
    }
  }
}

module.exports = { run };
