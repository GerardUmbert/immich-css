#!/usr/bin/env node
// Tracks which parts of custom.css depend on which upstream files.
// Two references are kept next to this repo (both git-ignored):
//   immich/        shallow clone of immich-app/immich
//   ui/<version>/  the published @immich/ui package (what actually ships)
//
//   node tools/hooks.mjs setup                      create / refresh both references for the version in hooks.json
//   node tools/hooks.mjs check <oldRef> <newRef>    hooks whose Immich source files changed between two git refs
//   node tools/hooks.mjs check-ui <oldVer> <newVer> hooks whose @immich/ui files changed between two versions
//   node tools/hooks.mjs ui-version <ref>           the exact @immich/ui version a given Immich ref pins
//   node tools/hooks.mjs docs                       regenerate HOOKS.md from hooks.json
//
// Refs are tags / branches / commits in ./immich (fetch one with:
//   git -C immich fetch --depth 1 origin tag v3.4.0).
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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

const uiDir = (version) => join(root, 'ui', version);
const uiFile = (version, file) => join(uiDir(version), 'dist', file);

function fetchUi(version) {
  if (existsSync(join(uiDir(version), 'dist'))) return;
  const tmp = mkdtempSync(join(tmpdir(), 'immich-ui-'));
  try {
    console.log(`Fetching @immich/ui@${version} ...`);
    execSync(`npm pack @immich/ui@${version} --silent --pack-destination .`, { cwd: tmp, stdio: 'pipe' });
    rmSync(uiDir(version), { recursive: true, force: true });
    mkdirSync(uiDir(version), { recursive: true });
    // relative archive name: GNU tar reads "C:\..." as a remote host
    // forward slashes: GNU tar (from Git for Windows) treats backslashes as escapes
    const target = uiDir(version).replaceAll('\\', '/');
    execSync(`tar -xzf immich-ui-${version}.tgz -C "${target}" --strip-components=1`, {
      cwd: tmp,
      stdio: 'pipe',
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function setup() {
  if (!existsSync(clone)) {
    console.log(`Cloning immich ${map.checkedAgainst} ...`);
    execFileSync(
      'git',
      ['clone', '--depth', '1', '--branch', map.checkedAgainst, 'https://github.com/immich-app/immich.git', clone],
      { stdio: 'inherit' },
    );
  } else {
    console.log(`Fetching tag ${map.checkedAgainst} into the existing clone ...`);
    try {
      git('fetch', '--depth', '1', 'origin', 'tag', map.checkedAgainst);
    } catch (error) {
      console.log(`(could not fetch the tag: ${error.message.split('\n')[0]})`);
    }
  }
  fetchUi(map.uiVersion);

  let ok = true;
  for (const hook of map.hooks) {
    for (const file of hook.upstream) {
      if (!existsAt(map.checkedAgainst, file)) {
        ok = false;
        console.log(`MISSING upstream file for [${hook.id}] at ${map.checkedAgainst}: ${file}`);
      }
    }
    for (const file of hook.ui ?? []) {
      if (!existsSync(uiFile(map.uiVersion, file))) {
        ok = false;
        console.log(`MISSING @immich/ui file for [${hook.id}] in ${map.uiVersion}: dist/${file}`);
      }
    }
  }
  console.log(ok ? 'Setup done; every file listed in hooks.json exists.' : 'Setup done, with missing files (above).');
}

function report(hook, problems) {
  console.log(`\n[${hook.id}] ${hook.what}`);
  console.log(`  re-check selectors: ${hook.hooks.join(' | ')}`);
  if (hook.external.length > 0) console.log(`  also depends on: ${hook.external.join('; ')}`);
  console.log(problems.join('\n'));
  console.log(`  last verified: ${hook.verified}`);
}

function check(oldRef, newRef) {
  if (!oldRef || !newRef) usage();
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
      report(hook, problems);
    }
  }
  if (clean) console.log(`No hooked Immich files changed between ${oldRef} and ${newRef}.`);
  let oldUi;
  let newUi;
  try {
    oldUi = uiVersionAt(oldRef);
    newUi = uiVersionAt(newRef);
  } catch {
    // refs without a lockfile in the shallow clone: skip the hint
  }
  if (oldUi && newUi) {
    console.log(
      oldUi === newUi
        ? `\n@immich/ui is ${newUi} at both refs.`
        : `\n@immich/ui changed: ${oldUi} -> ${newUi}. Run: node tools/hooks.mjs check-ui ${oldUi} ${newUi}`,
    );
  }
}

function uiVersionAt(ref) {
  const lock = git('show', `${ref}:pnpm-lock.yaml`);
  const match = lock.match(/'@immich\/ui@(\d+\.\d+\.\d+[^'(:]*)/);
  if (!match) throw new Error(`no @immich/ui entry in pnpm-lock.yaml at ${ref}`);
  return match[1];
}

function checkUi(oldVer, newVer) {
  if (!oldVer || !newVer) usage();
  fetchUi(oldVer);
  fetchUi(newVer);
  let clean = true;
  for (const hook of map.hooks) {
    const problems = [];
    for (const file of hook.ui ?? []) {
      const before = existsSync(uiFile(oldVer, file)) ? readFileSync(uiFile(oldVer, file), 'utf8') : undefined;
      const after = existsSync(uiFile(newVer, file)) ? readFileSync(uiFile(newVer, file), 'utf8') : undefined;
      if (after === undefined) problems.push(`  MISSING in ${newVer}: dist/${file}`);
      else if (before !== undefined && before !== after) problems.push(`  changed: dist/${file}`);
    }
    if (problems.length > 0) {
      clean = false;
      report(hook, problems);
    }
  }
  if (clean) console.log(`No hooked @immich/ui files changed between ${oldVer} and ${newVer}.`);
  console.log('\nMaplibre / svelte-maplibre-gl (map marker markup) are not covered: compare their versions by hand.');
}

function docs() {
  const lines = [
    '# Hook map',
    '',
    `Generated from \`hooks.json\` by \`node tools/hooks.mjs docs\`. Do not edit by hand. Checked against Immich **${map.checkedAgainst}** and @immich/ui **${map.uiVersion}**.`,
    '',
    'Each entry says what a group of rules does, why it exists, which selectors it relies on, and which upstream files those selectors come from.',
    'After an update, run `node tools/hooks.mjs check <oldRef> <newRef>` (Immich) and `node tools/hooks.mjs check-ui <oldVer> <newVer>` (@immich/ui) to list the entries whose files changed.',
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
      `- **Immich files** (under \`${map.upstreamRoot}\`): ${hook.upstream.map((f) => `\`${f}\``).join(', ')}`,
    );
    if ((hook.ui ?? []).length > 0) lines.push(`- **@immich/ui files** (under \`dist\`): ${hook.ui.map((f) => `\`${f}\``).join(', ')}`);
    if (hook.external.length > 0) lines.push(`- **Also depends on:** ${hook.external.join('; ')}`);
    lines.push(`- **Verified:** ${hook.verified}`, '');
  }
  writeFileSync(join(root, 'HOOKS.md'), lines.join('\n'));
  console.log('Wrote HOOKS.md');
}

function usage() {
  console.error('usage: node tools/hooks.mjs <setup | check <oldRef> <newRef> | check-ui <oldVer> <newVer> | ui-version <ref> | docs>');
  process.exit(1);
}

const [command, ...args] = process.argv.slice(2);
if (command === 'setup') setup();
else if (command === 'check') check(...args);
else if (command === 'check-ui') checkUi(...args);
else if (command === 'ui-version') console.log(uiVersionAt(args[0] ?? map.checkedAgainst));
else if (command === 'docs') docs();
else usage();
