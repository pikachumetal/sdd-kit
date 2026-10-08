import { existsSync } from 'node:fs';
import { readLines } from '../cli/files.ts';
import { join } from 'node:path';
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

function roadmapProblems(lines: string[], sddPath: string): string[] {
  const sections = parseSections(lines);
  const blocks = tableBlocks(lines, sections);
  const releases = closedReleases(lines, sections);
  const rows = openRows(lines, blocks);
  const last = releases[0];
  const cut = cutCommit(sddPath, last);
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

export function checkRoadmap(sddPath: string): RoadmapResult {
  const file = join(sddPath, 'roadmap.md');
  if (!existsSync(file)) return { errors: [], warnings: [], lines: ['Sin roadmap que validar'], code: 0 };
  const lines = readLines(file);
  const errors = roadmapProblems(lines, sddPath).map((problem) => `roadmap.md: ${problem}`);
  const blocks = tableBlocks(lines, parseSections(lines));
  const warnings = roadmapWarnings(lines, blocks).map((warning) => `roadmap.md: aviso: ${warning}`);
  if (errors.length) return { errors, warnings, lines: [...errors, ...warnings], code: 1 };
  return { errors, warnings, lines: [...warnings, 'Roadmap válido'], code: 0 };
}
