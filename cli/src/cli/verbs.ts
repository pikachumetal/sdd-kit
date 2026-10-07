import type { ParseArgsOptionsConfig } from 'node:util';
import { capabilityCheckVerb, capabilityIndexVerb, capabilityMergeVerb } from '../capabilities/verbs.ts';
import { idNextVerb } from '../ids/verbs.ts';
import { roadmapCheckVerb } from '../roadmap/verbs.ts';
import type { Io } from './io.ts';

export type VerbArgs = { values: Record<string, unknown>; positionals: string[] };

export interface Verb {
  noun: string;
  verb?: string;
  summary: string;
  options: ParseArgsOptionsConfig;
  positionals?: string[];
  run(args: VerbArgs, io: Io): Promise<number>;
}

export const VERBS: Verb[] = [capabilityIndexVerb, capabilityCheckVerb, capabilityMergeVerb, roadmapCheckVerb, idNextVerb];
