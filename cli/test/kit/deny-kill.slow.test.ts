import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kitRoot, run } from './process.ts';

const hook = join(kitRoot, 'tests', 'headless', 'deny-kill.mjs');

function isDenied(command: string): boolean {
  const payload = JSON.stringify({ tool_input: { command } });
  return run(process.execPath, [hook], { input: payload }).output.includes('"deny"');
}

describe('deny-kill.mjs', () => {
  it.each([
    'taskkill //F //IM node.exe',
    'pkill -f "node server.mjs"',
    'killall node',
    'Stop-Process -Name node -Force',
    'kill -Name node',
    'Get-Process node | Stop-Process',
    'Get-Process node | ForEach-Object { Stop-Process -Id $_.Id }',
    `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Invoke-CimMethod -MethodName Terminate`,
    "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'server.mjs' } | ForEach-Object { Stop-Process -Id $_.ProcessId }",
    'pgrep node | xargs kill',
    'wmic process where name="node.exe" call terminate',
  ])('deniega %s', (command) => {
    expect(isDenied(command)).toBe(true);
  });

  it.each([
    'kill $(cat /tmp/salas.pid)',
    'Stop-Process -Id 4242 -Force',
    'Get-Process -Id 4242 | Stop-Process',
    'Get-NetTCPConnection -LocalPort 4656 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }',
    'taskkill /F /PID 1234',
    'Get-Process node',
  ])('deja pasar %s', (command) => {
    expect(isDenied(command)).toBe(false);
  });
});
