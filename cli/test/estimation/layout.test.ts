import { describe, it, expect } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DomainError } from '../../src/cli/args.ts';
import { generateEstimationLog } from '../../src/estimation/log.ts';
import { estimationLogPath } from '../../src/cli/layout.ts';
import { row, walkthrough } from './helpers.ts';

function projectAt(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-estimation-layout-'));
  for (const [relative, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, relative)), { recursive: true });
    writeFileSync(join(root, relative), content, 'utf8');
  }
  return root;
}

const time = walkthrough({ type: 'docs', est: '2h', real: '1h' });

function build(root: string) {
  const warnings: string[] = [];
  const log = generateEstimationLog(root, (message) => warnings.push(message));
  return { ...log, warnings };
}

describe('estimation log con la estructura 3.0.0', () => {
  it('el log lee changes y specs', () => {
    const root = projectAt({
      '.docs/sdd/specs/20260920-100000-feature-0079-b/walkthrough.md': time,
      '.docs/sdd/changes/20261010-090000-feature-0160-c/walkthrough.md': time,
    });
    const { text } = build(root);
    expect(row(text, '20260920-100000-feature-0079-b')).toContain('| 0079 |');
    expect(row(text, '20261010-090000-feature-0160-c')).toContain('| 0160 |');
  });

  it('el log va a steering y avisa de estimation.md en las dos rutas', () => {
    const root = projectAt({
      '.docs/sdd/steering/estimation.md': '# Estimación',
      '.docs/sdd/estimation.md': '# Estimación vieja',
      '.docs/sdd/changes/20261010-090000-feature-0160-c/walkthrough.md': time,
    });
    const { docsPath, warnings } = build(root);
    expect(estimationLogPath(docsPath)).toBe(join(root, '.docs/sdd/steering/estimation-log.md'));
    expect(warnings).toContain('aviso: también existe .docs/sdd/estimation.md, que no se lee');
  });

  it('CHANGELOG.md manda sobre changelog.md y avisa', () => {
    const root = projectAt({
      'CHANGELOG.md': '# Changelog\n\n## [3.0.0] - 2026-10-20\n',
      '.docs/sdd/changelog.md': '# Changelog\n\n## [2.9.0] - 2026-10-20\n',
      '.docs/sdd/changes/20261010-090000-feature-0160-c/walkthrough.md': `---\ncreated: 2026-10-10\n---\n${time}`,
    });
    const { text, warnings } = build(root);
    expect(text).toContain('| 3.0.0 |');
    expect(text).not.toContain('| 2.9.0 |');
    expect(warnings).toContain('aviso: también existe .docs/sdd/changelog.md, que no se lee');
  });

  it('sin changes ni specs dice qué carpetas buscó', () => {
    const root = projectAt({ '.docs/sdd/estimation.md': '' });
    expect(() => build(root)).toThrow(DomainError);
    expect(() => build(root)).toThrow(/changes\/ ni specs\//);
  });
});
