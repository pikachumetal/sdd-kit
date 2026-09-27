// PreToolUse de los sujetos de la 0085: deniega los despachos. La tool call denegada sigue en el stream,
// y su prompt se guarda junto al molde, fuera de su git, porque el extracto solo lleva la descripción.
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const project = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
appendFileSync(join(dirname(project), 'agent-prompts.txt'), `=== ${input.tool_input?.description ?? ''}\n${input.tool_input?.prompt ?? ''}\n\n`);
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: 'Despacho no disponible en esta campaña: el encargo queda registrado. Sigue sin él y di qué harías con su resultado.',
  },
}));
