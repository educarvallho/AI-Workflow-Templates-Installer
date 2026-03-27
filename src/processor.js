'use strict';

const path = require('path');
const { WORKFLOW_META, TEMPLATES_PLACEHOLDER } = require('./config');

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
  adaptFrontmatter,
};
