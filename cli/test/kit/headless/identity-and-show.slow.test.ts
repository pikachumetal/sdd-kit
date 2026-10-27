import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanGitEnv } from '../process.ts';
import { newCampaign, readText, runCampaign, runLib, slashed, subjects, testRoot, write } from './campaign.ts';

const LEAK_LAUNCH = 'subject_launch "x"; echo "aprobada por Alice Liddell" | subject_save; exit 0';

const machineConfig = (root: string): string => write(join(root, 'machine.gitconfig'), '[user]\n\tname = Alice Liddell\n');

function projectFolders(config: string): string[] {
  const projects = join(config, 'projects');
  return existsSync(projects) ? readdirSync(projects, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name) : [];
}

describe('Lanzador de referencia de sujetos headless (tests/headless/run.sh)', () => {
  it('subject_save no deja el estado si la salida lleva la identidad de git de la máquina (ticket de la feature 0160)', () => {
    const root = testRoot('identity-leak');
    const campaign = newCampaign(root, { launch: LEAK_LAUNCH });

    const result = runCampaign(campaign, { SCENARIOS: 'a', GIT_CONFIG_GLOBAL: machineConfig(root) });

    expect(result.output).toMatch(/el stream sigue en/i);
    expect(result.output).not.toMatch(/Alice Liddell/i);
    expect(existsSync(join(campaign.out, 'a-1.state.txt'))).toBe(false);
    expect(existsSync(join(campaign.out, 'a-1.tools.txt')), 'sin tools.txt, run.sh no cuenta el coste del sujeto').toBe(true);
    expect(readdirSync(campaign.out).filter((name) => name.endsWith('.tmp'))).toEqual([]);
  });

  it('un sujeto con la identidad de git de la máquina en su salida sale con error', () => {
    const root = testRoot('identity-exit');
    const campaign = newCampaign(root, { launch: LEAK_LAUNCH });
    const subject = join(campaign.spec, 'red/subject.sh');
    const wrapper = write(join(campaign.spec, 'red/wrapper.sh'), `bash '${slashed(subject)}' "$@"; echo "salida del sujeto: $?" >&2`);

    const result = runCampaign(campaign, { SCENARIOS: 'a', GIT_CONFIG_GLOBAL: machineConfig(root), SUBJECT_SH: wrapper });

    expect(result.output).toMatch(/salida del sujeto: 1/i);
  });

  it.each([{ folder: '.docs' }, { folder: 'tests' }])('aborta si la copia del kit lleva $folder/ (walkthrough de la feature 0150 §4.3)', ({ folder }) => {
    const campaign = newCampaign(testRoot(`kit-${folder}`));
    mkdirSync(join(campaign.kit, folder), { recursive: true });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/la copia del kit lleva \.docs\/ o tests\/: sácala con git archive <commit> skills \.claude-plugin/i);
    expect(subjects(campaign)).toHaveLength(0);
  });

  it('subject_show vuelca un fichero de otra rama (ticket del patch 0075 §3)', () => {
    const launch = 'g checkout -q -b feature/0013; put .docs/sdd/roadmap.md <<< "fila 0013"; commit "docs: fila"; g checkout -q main; subject_launch "x"; subject_show feature/0013:.docs/sdd/roadmap.md roadmap.md';
    const campaign = newCampaign(testRoot('show'), { launch });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    expect(readText(join(campaign.out, 'a-1/roadmap.md')), result.output).toMatch(/fila 0013/i);
  });

  it('seed_transcript siembra en la carpeta del molde y la borra al acabar (ticket de la feature 0188 §2)', () => {
    const root = testRoot('seed');
    const config = join(root, 'seed-config');
    const launch = 'seed_transcript feature/0042 < <(printf "%s\\n" "2026-10-14T09:00:00Z user el total no redondea" "2026-10-14T09:02:00Z assistant mirando"); cp "$SEED_DIR"/seed-1.jsonl "$OUT/seed.jsonl"; subject_launch "x"';
    const campaign = newCampaign(root, { launch });

    const result = runCampaign(campaign, { SCENARIOS: 'a', CLAUDE_CONFIG_DIR: config, KEEP_MOLD: '1' });

    expect(result.code, result.output).toBe(0);
    const seed = readText(join(campaign.out, 'seed.jsonl')).split(/\r?\n/).filter((line) => line !== '').map((line) => JSON.parse(line));
    expect(seed, result.output).toHaveLength(2);
    expect(seed[0].gitBranch).toBe('feature/0042');
    expect(seed[0].message.content).toBe('el total no redondea');
    expect(seed[1].message.model).toBe('claude-sonnet-5');
    expect(seed[1].message.usage.output_tokens).toBe(1);
    expect(projectFolders(config)).toHaveLength(0);
  });

  it('seed_transcript en una tubería también borra la carpeta al acabar', () => {
    const root = testRoot('seed-pipe');
    const config = join(root, 'seed-pipe-config');
    const campaign = newCampaign(root, { launch: 'printf "%s\\n" "2026-10-14T09:00:00Z user hola" | seed_transcript feature/0042; subject_launch "x"' });

    const result = runCampaign(campaign, { SCENARIOS: 'a', CLAUDE_CONFIG_DIR: config });

    expect(result.code, result.output).toBe(0);
    expect(existsSync(join(config, 'projects')), 'seed_transcript la crea').toBe(true);
    expect(projectFolders(config)).toHaveLength(0);
  });

  it('seed_transcript sin molde muere sin tocar los transcripts', () => {
    const config = join(testRoot('seed-nomold'), 'config');
    mkdirSync(join(config, 'projects/otra-sesion'), { recursive: true });

    const out = runLib("seed_transcript feature/0042 <<< '2026-10-14T09:00:00Z user hola'; subject_cleanup", { ...cleanGitEnv, CLAUDE_CONFIG_DIR: config }).output;

    expect(out).toMatch(/seed_transcript antes de subject_init/i);
    expect(existsSync(join(config, 'projects/otra-sesion'))).toBe(true);
  });

  it('subject_show con una copia con carpetas da el aviso de copia plana', () => {
    const campaign = newCampaign(testRoot('show-flat'), { launch: 'subject_launch "x"; subject_show main:README.md docs/readme.md' });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.output).toMatch(/docs\/readme\.md: solo copia plana/i);
  });

  it('g pasa core.longpaths (ticket de la feature 0089 §2)', () => {
    const campaign = newCampaign(testRoot('longpaths'), { launch: 'subject_launch "x"; g config --get core.longpaths > "$OUT/longpaths.txt"' });

    const result = runCampaign(campaign, { SCENARIOS: 'a' });

    expect(result.code, result.output).toBe(0);
    expect(readText(join(campaign.out, 'longpaths.txt')).trim()).toBe('true');
  });
});

