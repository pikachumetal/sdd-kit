import type { ParseArgsOptionsConfig } from 'node:util';
import { capabilityCheckVerb, capabilityIndexVerb, capabilityMergeVerb } from '../capabilities/verbs.ts';
import { idNextVerb } from '../ids/verbs.ts';
import { estimationLogVerb } from '../estimation/verbs.ts';
import { roadmapCheckVerb, roadmapPublishVerb } from '../roadmap/verbs.ts';
import { mergeVerb } from '../merge/verbs.ts';
import { watchCommandVerb, watchSubagentVerb } from '../watch/verbs.ts';
import { sessionTokensVerb } from '../session/verbs.ts';
import { hookSessionStartVerb } from '../hook/verbs.ts';
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

export const VERBS: Verb[] = [capabilityIndexVerb, capabilityCheckVerb, capabilityMergeVerb, roadmapCheckVerb, roadmapPublishVerb, idNextVerb, estimationLogVerb, mergeVerb, sessionTokensVerb, watchSubagentVerb, watchCommandVerb, hookSessionStartVerb];
