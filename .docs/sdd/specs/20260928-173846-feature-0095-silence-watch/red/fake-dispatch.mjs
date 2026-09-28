// PreToolUse de los sujetos de la 0095: no lanza el subagente, pero le dice al sujeto que ya corre en segundo plano,
// para medir qué hace mientras espera. El encargo se guarda junto al molde, fuera de su git.
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const project = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
const description = input.tool_input?.description ?? '';
appendFileSync(join(dirname(project), 'agent-prompts.txt'), `=== ${description}\n${input.tool_input?.prompt ?? ''}\n\n`);
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: `El harness de esta campaña simula el despacho: el subagente «${description}» ya corre en segundo plano y el harness te avisará cuando termine. No lo vuelvas a despachar. Haz ahora lo que harías mientras corre y termina tu turno.`,
  },
}));
