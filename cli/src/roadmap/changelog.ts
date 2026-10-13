import { escapeRegExp } from './releases.ts';

const RELEASE_HEADING = /^## \[\d+\.\d+\.0\] [-—] (\d{4}-\d{2}-\d{2})/;

export function releaseDates(changelogText: string): string[] {
  return changelogText.split(/\r?\n/).flatMap((line) => RELEASE_HEADING.exec(line)?.[1] ?? []);
}

export function namesId(changelogText: string, id: string): boolean {
  return new RegExp(String.raw`\b${escapeRegExp(id)}\b`).test(changelogText);
}
