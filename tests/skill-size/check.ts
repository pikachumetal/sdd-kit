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
//
// La fase, en caracteres: tras compactar vuelven juntas la skill que dirige y las que manda invocar, cada una ya cortada.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { elementsOf, textLines } from '../own/kit-text.ts';
import { splitSentences } from '../own/sentences.ts';

const LIMIT = 20_000;
const PHASE_LIMIT = 100_000;
const REPO_ROOT = resolve(import.meta.dirname, '../..');
const INVOKE_BEFORE = /(?:invoke|load|\*\*REQUIRED SUB-SKILL:\*\*)\s+`(?:sdd-kit:)?([a-z0-9-]+)`/gi;
const SKILL_AFTER = /`(?:sdd-kit:)?([a-z0-9-]+)`[^`]*?with (?:the )?`Skill`/g;

const sentencesOf = (text: string): string[] =>
  elementsOf(textLines(text)).flatMap((element) => splitSentences(element.parts.map((part) => part.text).join(' ')).map((sentence) => sentence.text));

export function invokedSkills(text: string, self: string, names: string[]): string[] {
  const found = sentencesOf(text).flatMap((sentence) =>
    [...sentence.matchAll(INVOKE_BEFORE), ...sentence.matchAll(SKILL_AFTER)].sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map((match) => match[1]),
  );
  return [...new Set(found)].filter((name) => name !== self && names.includes(name));
}

function skillTexts(repoRoot: string): Map<string, string> {
  const skillsDir = join(repoRoot, 'dist', 'skills');
  const texts = new Map<string, string>();
  for (const name of readdirSync(skillsDir).sort()) {
    const skill = join(skillsDir, name, 'SKILL.md');
    if (existsSync(skill)) texts.set(name, readFileSync(skill, 'utf8'));
  }
  return texts;
}

function byteLines(repoRoot: string, names: string[]): string[] {
  const lines = names.flatMap((name) => {
    const size = statSync(join(repoRoot, 'dist', 'skills', name, 'SKILL.md')).size;
    return size >= LIMIT ? [`FALLA: dist/skills/${name}/SKILL.md ocupa ${size} bytes (límite: menos de ${LIMIT})`] : [];
  });
  return lines.length > 0 ? [...lines, 'Mueve a su references/ lo que la skill solo necesita a veces.'] : [`OK: todos los SKILL.md ocupan menos de ${LIMIT} bytes`];
}

function phaseLines(texts: Map<string, string>): string[] {
  const names = [...texts.keys()];
  const capped = (name: string): number => Math.min(texts.get(name)!.length, LIMIT);
  const phases = names.map((name) => {
    const invoked = invokedSkills(texts.get(name)!, name, names);
    return { name, invoked, total: invoked.reduce((sum, skill) => sum + capped(skill), capped(name)) };
  });
  const over = phases.filter((phase) => phase.total > PHASE_LIMIT);
  if (over.length > 0) return over.map((phase) => `FALLA: la fase de ${phase.name} (${phase.invoked.join(', ')}) suma ${phase.total} caracteres (límite: ${PHASE_LIMIT})`);
  if (phases.length === 0) return [];
  const largest = phases.reduce((max, phase) => (phase.total > max.total ? phase : max), phases[0]);
  return [`OK: ninguna fase pasa de ${PHASE_LIMIT} caracteres (la mayor, ${largest.name}: ${largest.total})`];
}

export function checkSkillSize(repoRoot: string): { code: number; lines: string[] } {
  const texts = skillTexts(repoRoot);
  const lines = [...byteLines(repoRoot, [...texts.keys()]), ...phaseLines(texts)];
  return { code: lines.some((line) => line.startsWith('FALLA')) ? 1 : 0, lines };
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) {
  const { code, lines } = checkSkillSize(REPO_ROOT);
  for (const line of lines) (code === 0 ? console.log : console.error)(line);
  process.exitCode = code;
}
