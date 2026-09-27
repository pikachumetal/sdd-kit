// PreToolUse de los sujetos web: deniega parar procesos por nombre o por línea de comandos.
// Matar todos los node.exe tumba los MCP de las sesiones abiertas en la máquina y los servidores de los
// demás sujetos. La tool call denegada sigue en el stream, así que la medida no cambia.
import { readFileSync } from 'node:fs';

const BY_NAME = [
  /taskkill\b[^\n]*[/-](IM|FI)\b/i,
  /\bpkill\b/,
  /\bpgrep\b/,
  /\bkillall\b/,
  /Stop-Process\b[^\n]*-(Name|ProcessName)\b/i,
  /\b(kill|spps)\s+-(Name|ProcessName)\b/i,
  /Get-Process\s+(?!-Id\b)[^\n|]*\|[^\n]*(Stop-Process|\bkill\b|Terminate)/i,
  /\bName\s*=\s*['"][^'"]+['"][^\n]*(Terminate|Stop-Process|\bkill\b)/i,
  /CommandLine[^\n]*(Stop-Process|\bkill\b|Terminate)/i,
  /\bcall\s+terminate\b/i,
  /\bwmic\b[^\n]*\bdelete\b/i,
];

const input = JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';
if (BY_NAME.some((pattern) => pattern.test(command))) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: 'Bloqueado por el entorno de pruebas: esta orden puede afectar a procesos de otras sesiones de la máquina.',
    },
  }));
}
