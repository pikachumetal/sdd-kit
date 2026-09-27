// Compone prompt-r1.tmpl y prompt-r2.tmpl desde la cabecera de encargo-revision.md y las plantillas de superpowers.
// Uso: node compose-prompts.mjs <encargo-revision.md> <dir de skills de superpowers>
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [, , briefPath, superpowersSkills] = process.argv;
const brief = readFileSync(briefPath, 'utf8').replace(/\r\n/g, '\n');
const plan = readFileSync(join(here, 'm1/base/.docs/sdd/specs/20260920-100000-task-0007-week-summary/plan.md'), 'utf8').replace(/\r\n/g, '\n');

const codeBlock = plan.split('### De código\n')[1].split('\n### De proceso')[0].trim();
const fences = [...brief.matchAll(/```markdown\n([\s\S]*?)\n```/g)].map((m) => m[1]);
const header = fences[0].split('\n---\n')[0].replace(/<copia literal[^>]*>/, codeBlock);
const howToReview = fences[1];

const templateBody = (relative) => readFileSync(join(superpowersSkills, relative), 'utf8').replace(/\r\n/g, '\n')
  .split('  prompt: |\n')[1].split('\n```')[0]
  .split('\n').map((line) => line.replace(/^ {4}/, '')).join('\n');

const r1 = templateBody('subagent-driven-development/task-reviewer-prompt.md')
  .replace('[GLOBAL_CONSTRAINTS]', codeBlock)
  .replace('[BRIEF_FILE]', '__WS__/task-2-brief.md')
  .replace('[REPORT_FILE]', '__WS__/task-2-report.md')
  .replace('[DIFF_FILE]', '__WS__/review-task2.diff')
  .replaceAll('[BASE_SHA]', '__T2BASE__').replaceAll('[HEAD_SHA]', '__T2HEAD__');

const r2 = templateBody('requesting-code-review/code-reviewer.md')
  .replace('[DESCRIPTION]', 'Task 0007 completa (dos tasks): `slotMinutes` en `src/duration.js` y `formatWeekSummary` en `src/summary.js`, con sus tests.')
  .replace('[PLAN_OR_REQUIREMENTS]', 'Plan: `.docs/sdd/specs/20260920-100000-task-0007-week-summary/plan.md` (spec en la misma carpeta).')
  .replaceAll('[BASE_SHA]', '__FINALBASE__').replaceAll('[HEAD_SHA]', '__T2HEAD__');

const how = howToReview.replace('<ruta que imprime review-package>', '__WS__/review-final.diff');
writeFileSync(join(here, 'prompt-r1.tmpl'), `${header}\n---\n\n${r1}\n`);
writeFileSync(join(here, 'prompt-r2.tmpl'), `${header}\n${how}\n\n---\n\n${r2}\n\nMinors diferidos y rulings del ledger: ninguno.\n`);
