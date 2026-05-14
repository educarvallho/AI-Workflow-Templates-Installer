'use strict';

const os = require('os');
const path = require('path');

// ============================================================
// OS Detection
// ============================================================

function detectOS() {
  switch (os.platform()) {
    case 'win32': return 'Windows';
    case 'darwin': return 'macOS';
    default: return 'Linux';
  }
}

// ============================================================
// Path Configuration
// ============================================================

/**
 * Returns target directories for workflows and templates
 * based on the chosen IDE. Paths adapt automatically to the OS.
 *
 * Windsurf:
 *   workflows → ~/.codeium/windsurf/global_workflows
 *   templates → ~/.codeium/windsurf/TEMPLATES_WORKFLOWS
 *
 * Cursor:
 *   workflows → ~/.cursor/commands
 *   templates → ~/.cursor/TEMPLATES_WORKFLOWS
 *
 * Antigravity:
 *   workflows → ~/.gemini/antigravity/global_workflows
 *   templates → ~/.gemini/antigravity/TEMPLATES_WORKFLOWS
 */
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

  return {
    workflows: path.join(home, '.cursor', 'commands'),
    templates: path.join(home, '.cursor', 'TEMPLATES_WORKFLOWS'),
  };
}

// ============================================================
// Workflow Metadata
// ============================================================

const WORKFLOW_META = {
  'criar-codebase-techspec.md': {
    description: 'Documentar Codebase',
    autoExec: 1,
  },
  'criar-prd.md': {
    description: 'Criar PRD',
    autoExec: 1,
  },
  'criar-tasks.md': {
    description: 'Criar Tasks',
    autoExec: 1,
  },
  'criar-tech-spec.md': {
    description: 'Criar Tech Spec',
    autoExec: 2,
  },
  'executar-task.md': {
    description: 'Executar Task',
    autoExec: 1,
  },
};

// ============================================================
// Template file list
// ============================================================

const TEMPLATE_FILES = [
  'prd-template.md',
  'task.md',
  'tasks.md',
  'techspec-codebase-template.md',
  'techspec-template.md',
];

// ============================================================
// Placeholder used inside workflow content
// ============================================================

const TEMPLATES_PLACEHOLDER = '{{TEMPLATES_DIR}}';
const RULES_DIR_PLACEHOLDER = '{{RULES_DIR}}';
const RULES_FILE_EXT_PLACEHOLDER = '{{RULES_FILE_EXT}}';
const RULE_FRONTMATTER_PLACEHOLDER = '{{RULE_FRONTMATTER}}';

// ============================================================
// IDE-specific rules configuration
// ============================================================

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
};

module.exports = {
  detectOS,
  getIDEPaths,
  WORKFLOW_META,
  TEMPLATE_FILES,
  TEMPLATES_PLACEHOLDER,
  RULES_DIR_PLACEHOLDER,
  RULES_FILE_EXT_PLACEHOLDER,
  RULE_FRONTMATTER_PLACEHOLDER,
  IDE_RULES_CONFIG,
};
