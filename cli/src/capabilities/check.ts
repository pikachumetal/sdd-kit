import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
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

export type Validation = { lines: string[]; code: number; validCount: number };

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

function deltaLeftoverProblems(lines: string[]): string[] {
  return lines.flatMap((line, index) => {
    const problems: string[] = [];
    const mark = /^\*\*(ADDED|MODIFIED|REMOVED) —/i.exec(line);
    if (mark) problems.push(`resto de delta «**${mark[1]} —» en la línea ${index + 1}`);
    if (/^- Se valida en:/i.test(line)) problems.push(`resto de delta «Se valida en:» en la línea ${index + 1}`);
    if (/^\*\*Reglas de la capacidad\*\*/i.test(line)) {
      problems.push(`resto de delta «**Reglas de la capacidad**» en la línea ${index + 1}: sus entradas van en «## Reglas de la capacidad»`);
    }
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

function deltaAppliedProblems(lines: string[], dir: string): string[] {
  return deltaEntries(lines)
    .filter((delta) => delta.kind === 'ADDED' || delta.kind === 'MODIFIED')
    .flatMap((delta) => {
      const file = join(dir, `${delta.capability}.md`);
      if (!existsSync(file)) return [];
      const requirement = requirementsOf(readLines(file)).find((item) => equalsIgnoringCase(item.title, delta.title));
      if (!requirement) return [`«${delta.title}» del delta no está en capabilities/${delta.capability}.md`];
      const same = equalsIgnoringCase(scenarioLines(delta.lines).join('\n'), scenarioLines(requirement.lines).join('\n'));
      return same ? [] : [`«${delta.title}» del delta no coincide con capabilities/${delta.capability}.md`];
    });
}

function artifactProblems(artifactPath: string, dir: string): string[] {
  const name = basename(artifactPath);
  const lines = readLines(artifactPath);
  const block = sectionLines(lines, 'Capacidades');
  if (!block) return [`${name}: falta el bloque «## Capacidades»`];
  const deltaNames = lines.flatMap((line) => /^### Capacidad: `([^`]+)`/.exec(line)?.[1] ?? []);
  const declared = declaredCapabilities(block);
  const patchCreates = isPatch(name, lines) && declared.some((item) => item.kind === 'Nuevas');
  return [
    ...emptyBlockProblems(block, declared), ...noneLineProblems(block, deltaNames),
    ...blockAgainstDeltaProblems(declared, deltaNames, dir), ...deltaAppliedProblems(lines, dir),
    ...(patchCreates ? ['un patch no crea capacidades: quita «Nuevas»'] : []),
  ].map((problem) => `${name}: ${problem}`);
}

function summaryLine(count: number, skipped: string[]): string {
  const summary = `Capacidades válidas: ${count}`;
  return skipped.length ? `${summary} · omitidas por «No es una capacidad.»: ${skipped.join(', ')}` : summary;
}

export function validateCapabilities(sddPath: string, artifactPath?: string): Validation {
  const files = capabilityFiles(sddPath).map((path) => ({ name: basename(path), lines: readLines(path) }));
  const perFile = files.map((file) => fileProblems(file.name, file.lines).map((problem) => `${file.name}: ${problem}`));
  const problems = [...perFile.flat(), ...(artifactPath ? artifactProblems(artifactPath, capabilitiesDir(sddPath)) : [])];
  const skipped = files.filter((file) => isNotCapability(file.lines)).map((file) => file.name);
  const validCount = files.filter((file, index) => !perFile[index].length && !skipped.includes(file.name)).length;
  if (problems.length) return { lines: problems, code: 1, validCount };
  if (!files.length && !artifactPath) return { lines: ['Sin capacidades que validar'], code: 0, validCount };
  return { lines: [summaryLine(files.length - skipped.length, skipped)], code: 0, validCount };
}
