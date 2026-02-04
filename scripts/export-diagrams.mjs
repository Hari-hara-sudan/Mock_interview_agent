#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const srcDir = resolve(root, 'docs/diagrams');
const outDir = resolve(srcDir, 'exports');

if (!existsSync(outDir)) mkdirSync(outDir);

const diagrams = [
  'system-context',
  'auth-sequence',
  'interview-flow',
  'feedback-flow',
  'code-execution',
  'data-model'
];

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

for (const name of diagrams) {
  const input = resolve(srcDir, `${name}.mmd`);
  const svgOut = resolve(outDir, `${name}.svg`);
  const pngOut = resolve(outDir, `${name}.png`);

  // Export SVG and PNG
  run(`mmdc -i "${input}" -o "${svgOut}"`);
  run(`mmdc -i "${input}" -o "${pngOut}"`);
}

console.log(`\nExport complete. Files saved to: ${outDir}`);
