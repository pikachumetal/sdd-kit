// Falla cuando el SKILL.md de alguna skill llega al corte de Claude Code tras compactar.
//
// Portada de tests/skill-size/test-skill-size.sh de superpowers v7.0.1 (MIT, ver THIRD_PARTY_NOTICES.md), con su
// lógica y su mensaje en castellano (ADR 0013). Tras una compactación, Claude Code vuelve a adjuntar
// cada skill invocada cortada a 20.000 caracteres, y lo de detrás se pierde el resto de la sesión
// salvo que el agente relea el fichero (medida de la feature 0296). Lo que la skill solo necesita a
// veces va en su references/, que el agente lee del disco en el paso que lo pide.
//
// Mide bytes, más estricto que caracteres con tildes. Uso: node tests/skill-size/check.ts
// (moon run kit:skill-size). Corre al cortar la release, no en el pre-commit (patch 0298).
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const LIMIT = 20_000;
const REPO_ROOT = resolve(import.meta.dirname, '../..');

export function checkSkillSize(repoRoot: string): { code: number; lines: string[] } {
  const skillsDir = join(repoRoot, 'skills');
  const lines: string[] = [];
  for (const name of readdirSync(skillsDir).sort()) {
    const skill = join(skillsDir, name, 'SKILL.md');
    if (!existsSync(skill)) continue;
    const size = statSync(skill).size;
    if (size >= LIMIT) lines.push(`FALLA: skills/${name}/SKILL.md ocupa ${size} bytes (límite: menos de ${LIMIT})`);
  }
  if (lines.length > 0) return { code: 1, lines: [...lines, 'Mueve a su references/ lo que la skill solo necesita a veces.'] };
  return { code: 0, lines: [`OK: todos los SKILL.md ocupan menos de ${LIMIT} bytes`] };
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) {
  const { code, lines } = checkSkillSize(REPO_ROOT);
  for (const line of lines) (code === 0 ? console.log : console.error)(line);
  process.exitCode = code;
}
