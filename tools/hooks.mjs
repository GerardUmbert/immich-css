#!/usr/bin/env node
// Tracks which parts of custom.css depend on which upstream Immich files.
//
//   node tools/hooks.mjs check <oldRef> <newRef>   which hooks touch files that changed between two refs
//   node tools/hooks.mjs docs                      regenerate HOOKS.md from hooks.json
//
// Refs are tags / branches / commits in the local clone at ./immich
// (fetch one with: git -C immich fetch --depth 1 origin tag v3.4.0).
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const map = JSON.parse(readFileSync(join(root, 'hooks.json'), 'utf8'));
const clone = join(root, 'immich');
const prefix = map.upstreamRoot;

const git = (...args) => execFileSync('git', ['-C', clone, ...args], { encoding: 'utf8' });
const upstreamPath = (file) => `${prefix}/${file}`;
const existsAt = (ref, file) => {
  try {
    git('cat-file', '-e', `${ref}:${upstreamPath(file)}`);
    return true;
  } catch {
    return false;
  }
};

function check(oldRef, newRef) {
  if (!oldRef || !newRef) {
    console.error('usage: node tools/hooks.mjs check <oldRef> <newRef>');
    process.exit(1);
  }
  let clean = true;
  for (const hook of map.hooks) {
    const problems = [];
    for (const file of hook.upstream) {
      if (!existsAt(newRef, file)) {
        problems.push(`  MISSING in ${newRef}: ${file}`);
        continue;
      }
      if (!existsAt(oldRef, file)) continue;
      const diff = git('diff', '--numstat', oldRef, newRef, '--', upstreamPath(file)).trim();
      if (diff) {
        const [added, removed] = diff.split('\t');
        problems.push(`  changed (+${added} -${removed}): ${file}`);
      }
    }
    if (problems.length > 0) {
      clean = false;
      console.log(`\n[${hook.id}] ${hook.what}`);
      console.log(`  re-check selectors: ${hook.hooks.join(' | ')}`);
      if (hook.external.length > 0) console.log(`  also depends on: ${hook.external.join('; ')}`);
      console.log(problems.join('\n'));
      console.log(`  last verified: ${hook.verified}`);
    }
  }
  if (clean) console.log(`No hooked upstream files changed between ${oldRef} and ${newRef}.`);
  console.log('\nExternal packages (@immich/ui, maplibre) are not covered here: compare their versions by hand.');
}

function docs() {
  const lines = [
    '# Hook map',
    '',
    `Generated from \`hooks.json\` by \`node tools/hooks.mjs docs\`. Do not edit by hand. Checked against Immich **${map.checkedAgainst}**.`,
    '',
    'Each entry says what a group of rules does, why it exists, which selectors it relies on, and which upstream files those selectors come from.',
    'After an Immich update, run `node tools/hooks.mjs check <oldRef> <newRef>` to list the entries whose upstream files changed.',
    '',
  ];
  for (const hook of map.hooks) {
    lines.push(
      `## ${hook.id}${hook.fragile ? ' (fragile)' : ''}`,
      '',
      `- **What:** ${hook.what}`,
      `- **Why:** ${hook.why}`,
      `- **CSS section:** ${hook.css}`,
      `- **Selectors:** ${hook.hooks.map((h) => `\`${h}\``).join(', ')}`,
      `- **Upstream files** (under \`${map.upstreamRoot}\`): ${hook.upstream.map((f) => `\`${f}\``).join(', ')}`,
    );
    if (hook.external.length > 0) lines.push(`- **Also depends on:** ${hook.external.join('; ')}`);
    lines.push(`- **Verified:** ${hook.verified}`, '');
  }
  writeFileSync(join(root, 'HOOKS.md'), lines.join('\n'));
  console.log('Wrote HOOKS.md');
}

const [command, ...args] = process.argv.slice(2);
if (command === 'check') check(...args);
else if (command === 'docs') docs();
else {
  console.error('usage: node tools/hooks.mjs <check <oldRef> <newRef> | docs>');
  process.exit(1);
}
