#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { run } = require('./src/cli');

run().catch((err) => {
  console.error(chalk.red('\n  ❌ Erro inesperado:'), err.message);
  process.exit(1);
});
