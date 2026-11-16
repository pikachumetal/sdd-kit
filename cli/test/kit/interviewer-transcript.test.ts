import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseStream, render } from '../../../tests/batteries/interviewer/transcript.mjs';
import { tempDirs } from './temp-tree.ts';

const EXTRACT = join(import.meta.dirname, '../../../tests/headless/extract.mjs');
const SKILL = 'D:/k/skills/sdd-grilling/SKILL.md';
const LONG_BASH = `cd D:/k && ls skills/sdd-propose/references skills/sdd-templates/templates && head -20 README.md CHANGELOG.md PRODUCT.md ROADMAP.md && cat skills/sdd-propose/references/spec-writing.md; cat ${SKILL}`;

const toolUse = (name: string, input: Record<string, unknown>) => ({ type: 'assistant', message: { content: [{ type: 'tool_use', name, input }] } });
const streamOf = (...events: object[]) => events.map((event) => JSON.stringify(event)).join('\n');
const transcriptOf = (...events: object[]) => render(parseStream(streamOf(...events)), []);

describe('transcript.mjs de la batería del entrevistador', () => {
  it('no corta un Bash largo que acaba leyendo el núcleo', () => {
    expect(LONG_BASH.length).toBeGreaterThan(160);
    expect(transcriptOf(toolUse('Bash', { command: LONG_BASH }))).toContain(`> Bash: ${LONG_BASH}`);
  });

  it('enseña offset y limit de un Read', () => {
    expect(transcriptOf(toolUse('Read', { file_path: SKILL, offset: 1, limit: 80 }))).toContain(`> Read: ${SKILL} · offset=1 · limit=80`);
  });

  it('un Read sin rango lleva solo la ruta', () => {
    expect(transcriptOf(toolUse('Read', { file_path: SKILL }))).toContain(`> Read: ${SKILL}\n`);
  });

  it('corta a 160 el volcado JSON de una herramienta sin argumento conocido', () => {
    const line = transcriptOf(toolUse('TodoWrite', { todos: 'x'.repeat(300) })).split('\n').find((l) => l.startsWith('> TodoWrite: '));
    expect(line).toHaveLength('> TodoWrite: '.length + 160);
  });
});

describe('extract.mjs tools', () => {
  const temp = tempDirs();
  const toolsOf = (...events: object[]) => {
    const dir = temp('extract-');
    writeFileSync(join(dir, 'stream.jsonl'), streamOf(...events));
    const result = spawnSync(process.execPath, [EXTRACT, 'tools', join(dir, 'stream.jsonl'), join(dir, 'run')], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    return result.stdout;
  };

  it('enseña offset y limit de un Read', () => {
    expect(toolsOf(toolUse('Read', { file_path: SKILL, offset: 1, limit: 80 }))).toContain(`>>> Read: ${SKILL} · offset=1 · limit=80\n`);
  });

  it('un Read sin rango lleva solo la ruta', () => {
    expect(toolsOf(toolUse('Read', { file_path: SKILL }))).toContain(`>>> Read: ${SKILL}\n`);
  });

  it('escribe el rango de un Read igual que transcript.mjs', () => {
    const read = toolUse('Read', { file_path: SKILL, limit: 2000 });
    const fromExtract = toolsOf(read).match(/>>> Read: (.*)\n/)?.[1];
    const fromTranscript = transcriptOf(read).match(/> Read: (.*)\n/)?.[1];
    expect(fromExtract).toBe(`${SKILL} · limit=2000`);
    expect(fromTranscript).toBe(fromExtract);
  });
});
