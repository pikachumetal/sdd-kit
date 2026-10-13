import { existsSync } from 'node:fs';
import { readLines, readText } from '../cli/files.ts';
import { basename, dirname, join, resolve } from 'node:path';
import { resolveDocument, shadowWarning } from '../cli/layout.ts';
import { debtProblems, debtWarnings } from './debt.ts';
import { releaseDates } from './changelog.ts';
import { nowNextLaterProblems } from './now-next-later.ts';
import { lineAt, parseSections, tableBlocks } from './parse.ts';
import { closedReleases, cutCommit, publishedProblem, releasedPatchProblems, settledRowProblems } from './releases.ts';
import { closedTitleProblems, proseProblems, sectionSetProblems, subsectionProblems } from './structure.ts';
import { openRows, stateProblem, tableBlockProblems, tableHeaderProblems } from './tables.ts';
import { roadmapWarnings } from './warnings.ts';

export interface RoadmapResult {
  errors: string[];
  warnings: string[];
  lines: string[];
  code: number;
}

function roadmapProblems(lines: string[], roadmapDir: string): string[] {
  const sections = parseSections(lines);
  const blocks = tableBlocks(lines, sections);
  const releases = closedReleases(lines, sections);
  const rows = openRows(lines, blocks);
  const last = releases[0];
  const cut = cutCommit(roadmapDir, last);
  return [
    ...(/^# Roadmap\b/i.test(lineAt(lines, 0)) ? [] : ['línea 1: no empieza por «# Roadmap»']),
    ...sectionSetProblems(sections),
    ...subsectionProblems(lines, sections),
    ...closedTitleProblems(lines, sections),
    ...proseProblems(lines, sections),
    ...blocks.flatMap((block) => [...tableBlockProblems(lines, block), ...tableHeaderProblems(lines, block)]),
    ...rows.flatMap(stateProblem),
    ...settledRowProblems(lines, sections, last, cut),
    ...releasedPatchProblems(lines, sections, last, cut),
    ...rows.flatMap((row) => publishedProblem(row, releases)),
  ];
}

interface Report {
  errors: string[];
  warnings: string[];
}

function prefixed(file: string, messages: string[]): string[] {
  return messages.map((message) => `${basename(file)}: ${message}`);
}

function changelogText(sddPath: string): string {
  const { file } = resolveDocument(sddPath, 'changelog');
  return file === null ? '' : readText(file);
}

function twoPointRoadmapReport(lines: string[], file: string): Report {
  const blocks = tableBlocks(lines, parseSections(lines));
  return {
    errors: prefixed(file, roadmapProblems(lines, dirname(file))),
    warnings: prefixed(file, roadmapWarnings(lines, blocks).map((warning) => `aviso: ${warning}`)),
  };
}

function roadmapReport(sddPath: string, changelog: string): Report | null {
  const { file, shadowed } = resolveDocument(sddPath, 'roadmap');
  if (file === null) return null;
  const lines = readLines(file);
  const shadow = shadowed === null ? [] : prefixed(file, [shadowWarning(sddPath, shadowed)]);
  if (basename(file) !== 'ROADMAP.md') {
    const report = twoPointRoadmapReport(lines, file);
    return { errors: report.errors, warnings: [...shadow, ...report.warnings] };
  }
  return { errors: prefixed(file, nowNextLaterProblems(lines, changelog)), warnings: shadow };
}

function debtReport(sddPath: string, changelog: string): Report | null {
  const file = join(resolve(sddPath), 'steering', 'debt.md');
  if (!existsSync(file)) return null;
  const lines = readLines(file);
  return {
    errors: prefixed(file, debtProblems(lines)),
    warnings: prefixed(file, debtWarnings(lines, releaseDates(changelog)).map((warning) => `aviso: ${warning}`)),
  };
}

export function checkRoadmap(sddPath: string): RoadmapResult {
  const changelog = changelogText(sddPath);
  const reports = [roadmapReport(sddPath, changelog), debtReport(sddPath, changelog)].filter((report) => report !== null);
  if (reports.length === 0) return { errors: [], warnings: [], lines: ['Sin roadmap que validar'], code: 0 };
  const errors = reports.flatMap((report) => report.errors);
  const warnings = reports.flatMap((report) => report.warnings);
  if (errors.length) return { errors, warnings, lines: [...errors, ...warnings], code: 1 };
  return { errors, warnings, lines: [...warnings, 'Roadmap válido'], code: 0 };
}
