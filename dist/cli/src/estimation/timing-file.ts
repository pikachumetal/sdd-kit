export const TIMING_VERSION = 1;
export const PHASE_NAMES = ['apertura', 'implementacion', 'revision', 'cierre'] as const;
export type PhaseName = (typeof PHASE_NAMES)[number];

export interface TaskTimes {
  task: number;
  source: 'events' | 'commits';
  done: boolean;
  agentSeconds: number;
  execSeconds: number;
  waitSeconds: number;
}

export interface TimingPhase {
  name: PhaseName;
  ceremony: boolean;
  measured: boolean;
  reason?: string;
  agentSeconds: number | null;
  execSeconds: number | null;
  waitSeconds: number | null;
  idleSeconds: number | null;
  gateSeconds: number | null;
  estimateHours: number | null;
  tasks?: TaskTimes[];
}

export interface MeasuredTiming {
  version: number;
  branch: string;
  measured: true;
  clockSeconds: number;
  withinMargin: boolean;
  totals: { agentSeconds: number; execSeconds: number; waitSeconds: number; idleSeconds: number; gateSeconds: number | null };
  gateCommand: string | null;
  phases: TimingPhase[];
}

export type Timing = MeasuredTiming | { version: number; measured: false; reason: string };
