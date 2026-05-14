'use strict';

const fs = require('fs');
const path = require('path');
const { WORKFLOW_META } = require('./config');
const { replaceTemplatePaths, replaceIDEPlaceholders, adaptFrontmatter } = require('./processor');
const templates = require('./templates');
const workflows = require('./workflows');

// ============================================================
// File operations
// ============================================================

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ============================================================
// Template installation
// ============================================================

/**
 * Writes all embedded templates to the target directory.
 * IDE-specific placeholders are replaced before writing.
 * Returns an array of { file, ok, reason? } results.
 */
function installTemplates(templatesDir, ide) {
  ensureDir(templatesDir);
  const results = [];

  for (const [filename, content] of Object.entries(templates)) {
    try {
      const dest = path.join(templatesDir, filename);
      const processed = replaceIDEPlaceholders(content, ide);
      fs.writeFileSync(dest, processed, 'utf-8');
      results.push({ file: filename, ok: true });
    } catch (err) {
      results.push({ file: filename, ok: false, reason: err.message });
    }
  }

  return results;
}

// ============================================================
// Workflow installation
// ============================================================

/**
 * Processes each embedded workflow (path replacement + IDE placeholders + frontmatter)
 * and writes to the target directory.
 * Returns an array of { file, ok, reason? } results.
 */
function installWorkflows(workflowsDir, templatesDir, ide) {
  ensureDir(workflowsDir);
  const results = [];

  for (const [filename, rawContent] of Object.entries(workflows)) {
    try {
      let content = replaceTemplatePaths(rawContent, templatesDir);
      content = replaceIDEPlaceholders(content, ide);
      content = adaptFrontmatter(content, ide, filename);

      const dest = path.join(workflowsDir, filename);
      fs.writeFileSync(dest, content, 'utf-8');
      results.push({ file: filename, ok: true });
    } catch (err) {
      results.push({ file: filename, ok: false, reason: err.message });
    }
  }

  return results;
}

module.exports = {
  installTemplates,
  installWorkflows,
};
