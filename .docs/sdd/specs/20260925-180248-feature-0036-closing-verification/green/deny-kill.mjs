// PreToolUse de los sujetos web de la 0036: deniega parar procesos por nombre o por línea de comandos.
// Un sujeto que mata todos los node.exe tumba los MCP de las sesiones del dev-lead y los servidores de los
// demás sujetos (ticket 0077 §1). La tool call denegada sigue en el stream: la medida no cambia.
import { readFileSync } from 'node:fs';

const BY_NAME = [
  /taskkill\b[^\n]*[/-](IM|FI)\b/i,
  /\bpkill\b/,
  /\bkillall\b/,
  /Stop-Process\b[^\n]*-(Name|ProcessName)\b/i,
  /Get-Process\b[^\n|]*[a-z][^\n]*\|\s*Stop-Process/i,
  /CommandLine[^\n]*(Stop-Process|kill|Terminate)/i,
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
