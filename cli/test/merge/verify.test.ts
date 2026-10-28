import { describe, it, expect } from 'vitest';
import { UsageError } from '../../src/cli/args.ts';
import { failedTestLines, failureReport, findLockedFile, parseGate } from '../../src/merge/verify.ts';

describe('merge --verify gate', () => {
  const chained = (op: string) => `--verify: el gate encadena comandos con '${op}'; hazlo una tarea de moon o un script de package.json`;

  it('splits on spaces and groups quotes', () => {
    expect(parseGate('node -e "process.exit(1)"')).toEqual(['node', '-e', 'process.exit(1)']);
    expect(parseGate("moon run 'a b'")).toEqual(['moon', 'run', 'a b']);
  });

  it('rejects operators outside quotes only', () => {
    const cases: [string, string][] = [['a && b', '&&'], ['a || b', '||'], ['a; b', ';'], ['a | b', '|'], ['a > f', '>'], ['a < f', '<'], ['test&&lint', '&&']];
    for (const [gate, op] of cases) {
      expect(() => parseGate(gate)).toThrow(UsageError);
      expect(() => parseGate(gate)).toThrow(chained(op));
    }
    expect(parseGate('node -e "a && b"')).toEqual(['node', '-e', 'a && b']);
  });

  it('keeps variables literal', () => {
    expect(parseGate('echo $HOME %PATH% ~')).toEqual(['echo', '$HOME', '%PATH%', '~']);
  });
});

describe('merge en rojo: tests fallidos', () => {
  const filler = (count: number) => Array.from({ length: count }, (_, index) => `línea ${index + 1}`);

  it('picks the Pester failed line', () => {
    const output = ['[+] se llama sdd-propose 10ms', '[-] se llama sdd-archive 12ms', '[+] se llama sdd-verify 9ms', 'Tests Passed: 1246, Failed: 1'];
    expect(failedTestLines(output)).toEqual(['[-] se llama sdd-archive 12ms']);
  });

  it('picks Vitest failures behind a moon prefix', () => {
    const output = ['cli:test |  ✓ test/b.test.ts (3 tests)', 'cli:test |  FAIL  test/a.test.ts > grupo > nombre', 'cli:test |    × nombre 3ms', 'cli:test |       Tests  1 failed | 2 passed (3)'];
    expect(failedTestLines(output)).toEqual(['cli:test |  FAIL  test/a.test.ts > grupo > nombre', 'cli:test |    × nombre 3ms']);
  });

  it('caps the failed test lines at 20', () => {
    const output = Array.from({ length: 25 }, (_, index) => `[-] test ${index + 1}`);
    const report = failureReport(output).split('\n');
    expect(report.slice(0, 21)).toEqual(['tests fallidos:', ...output.slice(0, 20)]);
  });

  it('puts the failed tests before the tail', () => {
    const output = ['[-] se llama sdd-archive 12ms', ...filler(30)];
    expect(failureReport(output)).toBe(['tests fallidos:', '[-] se llama sdd-archive 12ms', ...filler(30).slice(-20)].join('\n'));
  });

  it('keeps the plain tail without failed tests', () => {
    expect(failureReport(filler(30))).toBe(filler(30).slice(-20).join('\n'));
  });
});

describe('merge --verify locked file', () => {
  it('names the file and the process MSBuild reports', () => {
    const output = 'warning MSB3026: Could not copy "obj\\App.dll" to "bin\\App.dll". The process cannot access the file \'bin\\App.dll\' because it is being used by another process. The file is locked by: "App.Api (4242)"';
    expect(findLockedFile(output)).toBe("'bin\\App.dll' lo tiene abierto App.Api (4242)");
  });

  it('names the file from the Spanish .NET message', () => {
    const output = "El proceso no tiene acceso al archivo 'C:\\b\\App.dll' porque está siendo utilizado en otro proceso.";
    expect(findLockedFile(output)).toBe("'C:\\b\\App.dll' lo tiene abierto otro proceso");
  });

  it('names the file from a Node EBUSY error', () => {
    expect(findLockedFile("Error: EBUSY: resource busy or locked, unlink 'dist/app.js'")).toBe("'dist/app.js' lo tiene abierto otro proceso");
  });

  it('returns nothing for a red test run', () => {
    expect(findLockedFile('Tests Failed: 3')).toBeUndefined();
  });
});
