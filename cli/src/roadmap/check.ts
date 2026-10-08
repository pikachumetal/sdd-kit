import { readLines } from '../cli/files.ts';
import { basename, dirname } from 'node:path';
import { resolveDocument, shadowWarning } from '../cli/layout.ts';
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

export function checkRoadmap(sddPath: string): RoadmapResult {
  const { file, shadowed } = resolveDocument(sddPath, 'roadmap');
  if (file === null) return { errors: [], warnings: [], lines: ['Sin roadmap que validar'], code: 0 };
  const prefix = `${basename(file)}:`;
  const lines = readLines(file);
  const errors = roadmapProblems(lines, dirname(file)).map((problem) => `${prefix} ${problem}`);
  const blocks = tableBlocks(lines, parseSections(lines));
  const shadow = shadowed === null ? [] : [shadowWarning(sddPath, shadowed)];
  const warnings = [...shadow, ...roadmapWarnings(lines, blocks).map((warning) => `aviso: ${warning}`)].map((warning) => `${prefix} ${warning}`);
  if (errors.length) return { errors, warnings, lines: [...errors, ...warnings], code: 1 };
  return { errors, warnings, lines: [...warnings, 'Roadmap válido'], code: 0 };
}
