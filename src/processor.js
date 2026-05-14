'use strict';

const path = require('path');
const {
  WORKFLOW_META,
  TEMPLATES_PLACEHOLDER,
  RULES_DIR_PLACEHOLDER,
  RULES_FILE_EXT_PLACEHOLDER,
  RULE_FRONTMATTER_PLACEHOLDER,
  IDE_RULES_CONFIG,
} = require('./config');

// ============================================================
// Template path replacement
// ============================================================

/**
 * Replaces every occurrence of {{TEMPLATES_DIR}}/ in the content
 * with the actual templates directory path + OS-native separator.
 */
function replaceTemplatePaths(content, templatesDir) {
  return content
    .split(TEMPLATES_PLACEHOLDER + '/')
    .join(templatesDir + path.sep);
}

// ============================================================
// IDE-specific placeholder replacement
// ============================================================

/**
 * Replaces IDE-specific placeholders in the content:
 *   {{RULES_DIR}}         → e.g. .windsurf/rules, .cursor/rules, .agent/rules
 *   {{RULES_FILE_EXT}}    → e.g. .md, .mdc
 *   {{RULE_FRONTMATTER}}  → IDE-appropriate YAML frontmatter for rule files
 */
function replaceIDEPlaceholders(content, ide) {
  const config = IDE_RULES_CONFIG[ide];
  if (!config) return content;

  let result = content
    .split(RULES_DIR_PLACEHOLDER)
    .join(config.rulesDir);

  result = result
    .split(RULES_FILE_EXT_PLACEHOLDER)
    .join(config.fileExt);

  result = result
    .split(RULE_FRONTMATTER_PLACEHOLDER)
    .join(config.ruleFrontmatter('Usar sempre que precisar tomar decisão arquitetural ou técnicas'));

  return result;
}

// ============================================================
// Frontmatter adaptation
// ============================================================

/**
 * Ensures every workflow has `description` in the YAML frontmatter.
 * For Cursor, strips the Windsurf-specific `auto_execution_mode` key.
 */
function adaptFrontmatter(content, ide, filename) {
  const meta = WORKFLOW_META[filename];
  if (!meta) return content;

  const FM = '---';
  const trimmed = content.trimStart();

  // No frontmatter yet — create one
  if (!trimmed.startsWith(FM)) {
    const lines = [`description: ${meta.description}`];
    if (ide === 'windsurf' || ide === 'antigravity') lines.push(`auto_execution_mode: ${meta.autoExec}`);
    return `---\n${lines.join('\n')}\n---\n${content}`;
  }

  // Parse existing frontmatter
  const firstIdx = trimmed.indexOf(FM);
  const secondIdx = trimmed.indexOf(FM, firstIdx + 3);
  if (secondIdx === -1) return content;

  const fmRaw = trimmed.substring(firstIdx + 3, secondIdx).trim();
  const body = trimmed.substring(secondIdx + 3);

  let fmLines = fmRaw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // Ensure description exists
  if (!fmLines.some((l) => l.startsWith('description:'))) {
    fmLines.unshift(`description: ${meta.description}`);
  }

  // Cursor: remove auto_execution_mode (Windsurf/Antigravity-specific)
  if (ide !== 'windsurf' && ide !== 'antigravity') {
    fmLines = fmLines.filter((l) => !l.startsWith('auto_execution_mode'));
  }

  return `---\n${fmLines.join('\n')}\n---${body}`;
}

module.exports = {
  replaceTemplatePaths,
  replaceIDEPlaceholders,
  adaptFrontmatter,
};
