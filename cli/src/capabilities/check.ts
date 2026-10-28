import { existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { readLines } from '../cli/files.ts';
import { capabilitiesDir, capabilityFiles } from './files.ts';
import {
  declaredCapabilities, deltaEntries, equalsIgnoringCase, includesIgnoringCase, isPatch,
  requirementsOf, sectionLines, sectionTitle, sectionTitles, purposeOf, RULE_NAMES, type Declared,
} from './sections.ts';

const ALLOWED_SECTIONS = ['Propósito', 'Requisitos', 'Reglas de la capacidad'];
const SCENARIO_KEYWORDS = ['GIVEN', 'WHEN', 'THEN'];
const PURPOSE_MAX_LENGTH = 300;
const NOT_CAPABILITY_MARK = /^> .*No es una capacidad\..*/i;
const NONE_LINE = /^(?:-\s*)?Ninguna\b/i;
const POINTER_TITLE = /^# Capacidad — (.+) \(puntero\)\s*$/i;
const MARKDOWN_LINK = /\]\(([^)\s]+)\)/g;

export type Validation = { lines: string[]; code: number; validCount: number; foreign: string[] };

type Resolved = { name: string; lines: string[]; problems: string[]; skipped: boolean; label?: string };

function titleProblems(slug: string, lines: string[]): string[] {
  const title = lines.find((line) => line.trim());
  if (title !== undefined && equalsIgnoringCase(title, `# Capacidad — ${slug}`)) return [];
  return [`el título debe ser «# Capacidad — ${slug}»`];
}

function sectionProblems(lines: string[]): string[] {
  const sections = sectionTitles(lines);
  const problems = includesIgnoringCase(sections, 'Requisitos') ? [] : ['falta la sección «Requisitos»'];
  for (const section of sections.filter((title) => !includesIgnoringCase(ALLOWED_SECTIONS, title))) {
    problems.push(
      equalsIgnoringCase(section, 'Historial')
        ? 'sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0'
        : `sección «${section}» no admitida: solo «Propósito», «Requisitos» y «Reglas de la capacidad»`,
    );
  }
  return problems;
}

function purposeProblems(lines: string[]): string[] {
  const sections = sectionTitles(lines);
  if (!includesIgnoringCase(sections, 'Propósito')) return ['falta la sección «Propósito»'];
  const problems = equalsIgnoringCase(sections[0], 'Propósito') ? [] : ['«Propósito» debe ser la primera sección'];
  const purpose = purposeOf(lines);
  if (!purpose) return [...problems, '«Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad'];
  if (purpose.length > PURPOSE_MAX_LENGTH) {
    problems.push(`«Propósito» tiene ${purpose.length} caracteres; el máximo es ${PURPOSE_MAX_LENGTH} (una o dos frases)`);
  }
  return problems;
}

function scenarioProblems(lines: string[]): string[] {
  const requirements = sectionLines(lines, 'Requisitos');
  if (!requirements) return [];
  return requirementsOf(requirements).flatMap((requirement) => {
    const missing = SCENARIO_KEYWORDS.filter(
      (keyword) => !requirement.lines.some((line) => new RegExp(`^- ${keyword}\\b`, 'i').test(line)),
    );
    if (!missing.length) return [];
    return [`«${requirement.title}» no tiene escenario completo (falta ${missing.map((keyword) => `- ${keyword}`).join(', ')})`];
  });
}

function looseLineProblems(lines: string[]): string[] {
  const problems: string[] = [];
  let title: string | null = null;
  let inRequirements = false;
  for (const [index, line] of lines.entries()) {
    const heading = /^### (.+)$/.exec(line);
    if (line.startsWith('## ')) {
      inRequirements = equalsIgnoringCase(sectionTitle(line) ?? '\0', 'Requisitos');
      title = null;
    } else if (heading) title = heading[1].trim();
    else if (inRequirements && title && line.trim() && !/^(- |>|\s)/.test(line)) {
      problems.push(`línea suelta en «${title}» (línea ${index + 1}): «${line.trim()}»`);
    }
  }
  return problems;
}

function rulesMark(line: string): string | undefined {
  if (/^\*\*Reglas de la capacidad\*\*/i.test(line)) return '**Reglas de la capacidad**';
  if (/^####\s+Reglas de la capacidad\b/i.test(line)) return '#### Reglas de la capacidad';
  return undefined;
}

function deltaLeftoverProblems(lines: string[]): string[] {
  return lines.flatMap((line, index) => {
    const problems: string[] = [];
    const mark = /^(\*\*|####\s+)(ADDED|MODIFIED|REMOVED) —/i.exec(line);
    if (mark) problems.push(`resto de delta «${mark[1].startsWith('#') ? '#### ' : '**'}${mark[2]} —» en la línea ${index + 1}`);
    if (/^- Se valida en:/i.test(line)) problems.push(`resto de delta «Se valida en:» en la línea ${index + 1}`);
    const rules = rulesMark(line);
    if (rules) problems.push(`resto de delta «${rules}» en la línea ${index + 1}: sus entradas van en «## Reglas de la capacidad»`);
    return problems;
  });
}

function ruleProblems(lines: string[]): string[] {
  const rules = sectionLines(lines, 'Reglas de la capacidad');
  if (!rules) return [];
  return RULE_NAMES.filter((name) => !rules.some((line) => line.startsWith(`- **${name}**:`))).map(
    (name) => `a «Reglas de la capacidad» le falta «${name}»`,
  );
}

function scenarioLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter((line) => /^- (GIVEN|WHEN|THEN|AND)\b/i.test(line));
}

function isNotCapability(lines: string[]): boolean {
  const second = lines.filter((line) => line.trim())[1];
  return second !== undefined && NOT_CAPABILITY_MARK.test(second);
}

function fileProblems(fileName: string, lines: string[]): string[] {
  const slug = fileName.replace(/\.[^.]*$/, '');
  if (isNotCapability(lines)) {
    return scenarioLines(lines).length
      ? ['marcado «No es una capacidad.» y con escenarios: quita la marca o los escenarios']
      : [];
  }
  return [
    ...titleProblems(slug, lines), ...sectionProblems(lines), ...purposeProblems(lines), ...scenarioProblems(lines),
    ...looseLineProblems(lines), ...deltaLeftoverProblems(lines), ...ruleProblems(lines),
  ];
}

function isPointer(slug: string, lines: string[]): boolean {
  const title = POINTER_TITLE.exec(lines.find((line) => line.trim()) ?? '');
  return title !== null && equalsIgnoringCase(title[1].trim(), slug);
}

function pointerLink(slug: string, lines: string[]): string | undefined {
  const suffix = `capabilities/${slug}.md`.toLowerCase();
  return lines
    .filter((line) => line.startsWith('>'))
    .flatMap((line) => [...line.matchAll(MARKDOWN_LINK)].map((match) => match[1]))
    .find((link) => link.replace(/\\/g, '/').toLowerCase().endsWith(suffix));
}

function resolvePointer(path: string, name: string, slug: string, lines: string[]): Resolved {
  const own = (problem: string): Resolved => ({ name, lines, problems: [`${name}: ${problem}`], skipped: false });
  if (scenarioLines(lines).length) return own('un puntero no lleva escenarios: van en su destino');
  const link = pointerLink(slug, lines);
  if (link === undefined) return own(`el puntero no enlaza en una cita a <…>/capabilities/${slug}.md`);
  const target = resolve(dirname(path), link);
  if (!existsSync(target)) return own(`el destino del puntero no existe: ${link}`);
  const targetLines = readLines(target);
  const problems = fileProblems(name, targetLines).map((problem) => `${name} → ${link}: ${problem}`);
  return { name, lines: targetLines, problems, skipped: false, label: link };
}

function resolveFile(path: string): Resolved {
  const name = basename(path);
  const slug = name.replace(/\.[^.]*$/, '');
  const lines = readLines(path);
  if (isPointer(slug, lines) && !isNotCapability(lines)) return resolvePointer(path, name, slug, lines);
  const problems = fileProblems(name, lines).map((problem) => `${name}: ${problem}`);
  return { name, lines, problems, skipped: isNotCapability(lines) };
}

function noneLineProblems(block: string[], deltaNames: string[]): string[] {
  const none = block.find((line) => NONE_LINE.test(line));
  if (none === undefined) return [];
  const problems: string[] = [];
  if (!/^(?:-\s*)?Ninguna, porque\s+\S/i.test(none)) problems.push('«Ninguna» sin motivo: escribe «Ninguna, porque <motivo>»');
  if (deltaNames.length) problems.push('el bloque dice «Ninguna» y hay delta');
  return problems;
}

function emptyBlockProblems(block: string[], declared: Declared[]): string[] {
  if (declared.length || block.some((line) => NONE_LINE.test(line))) return [];
  return ['el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»'];
}

function blockAgainstDeltaProblems(declared: Declared[], deltaNames: string[], dir: string): string[] {
  const declaredNames = [...new Set(declared.map((item) => item.name))];
  return [
    ...declaredNames
      .filter((name) => !includesIgnoringCase(deltaNames, name))
      .map((name) => `«${name}» está en el bloque «Capacidades» y no tiene subsección en el delta`),
    ...deltaNames
      .filter((name) => !includesIgnoringCase(declaredNames, name))
      .map((name) => `el delta tiene «${name}» y el bloque «Capacidades» no la nombra`),
    ...declaredNames.filter((name) => !existsSync(join(dir, `${name}.md`))).map((name) => `«${name}» no tiene fichero en capabilities/`),
  ];
}

function deltaAppliedProblems(lines: string[], bySlug: Map<string, Resolved>): string[] {
  return deltaEntries(lines)
    .filter((delta) => delta.kind === 'ADDED' || delta.kind === 'MODIFIED')
    .flatMap((delta) => {
      const file = bySlug.get(`${delta.capability}.md`.toLowerCase());
      if (!file) return [];
      const where = file.label ?? `capabilities/${delta.capability}.md`;
      const requirement = requirementsOf(file.lines).find((item) => equalsIgnoringCase(item.title, delta.title));
      if (!requirement) return [`«${delta.title}» del delta no está en ${where}`];
      const same = equalsIgnoringCase(scenarioLines(delta.lines).join('\n'), scenarioLines(requirement.lines).join('\n'));
      return same ? [] : [`«${delta.title}» del delta no coincide con ${where}`];
    });
}

function deltaCapabilityNames(lines: string[]): string[] {
  return lines.flatMap((line) => /^### Capacidad: `([^`]+)`/.exec(line)?.[1] ?? []);
}

function artifactProblems(artifactPath: string, dir: string, bySlug: Map<string, Resolved>): string[] {
  const name = basename(artifactPath);
  const lines = readLines(artifactPath);
  const block = sectionLines(lines, 'Capacidades');
  if (!block) return [`${name}: falta el bloque «## Capacidades»`];
  const deltaNames = deltaCapabilityNames(lines);
  const declared = declaredCapabilities(block);
  const patchCreates = isPatch(name, lines) && declared.some((item) => item.kind === 'Nuevas');
  return [
    ...emptyBlockProblems(block, declared), ...noneLineProblems(block, deltaNames),
    ...blockAgainstDeltaProblems(declared, deltaNames, dir), ...deltaAppliedProblems(lines, bySlug),
    ...(patchCreates ? ['un patch no crea capacidades: quita «Nuevas»'] : []),
  ].map((problem) => `${name}: ${problem}`);
}

function summaryLine(count: number, skipped: string[]): string {
  const summary = `Capacidades válidas: ${count}`;
  return skipped.length ? `${summary} · omitidas por «No es una capacidad.»: ${skipped.join(', ')}` : summary;
}

export function validateCapabilities(sddPath: string, artifactPath?: string): Validation {
  const files = capabilityFiles(sddPath).map(resolveFile);
  const bySlug = new Map(files.map((file) => [file.name.toLowerCase(), file]));
  const artifact = artifactPath ? artifactProblems(artifactPath, capabilitiesDir(sddPath), bySlug) : [];
  const touched = artifactPath ? deltaCapabilityNames(readLines(artifactPath)).map((name) => `${name}.md`.toLowerCase()) : null;
  const isOwn = (file: Resolved) => touched === null || touched.includes(file.name.toLowerCase());
  const problems = [...files.filter(isOwn).flatMap((file) => file.problems), ...artifact];
  const foreign = files.filter((file) => !isOwn(file)).flatMap((file) => file.problems);
  const skipped = files.filter((file) => file.skipped).map((file) => file.name);
  const validCount = files.filter((file) => !file.problems.length && !file.skipped).length;
  if (problems.length) return { lines: problems, code: 1, validCount, foreign };
  if (!files.length && !artifactPath) return { lines: ['Sin capacidades que validar'], code: 0, validCount, foreign };
  return { lines: [summaryLine(validCount, skipped)], code: 0, validCount, foreign };
}
