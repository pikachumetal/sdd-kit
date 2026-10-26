import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { RunResult } from '../process.ts';
import {
  freePort,
  isListening,
  newCampaign,
  readText,
  runCampaign,
  runLib,
  serverLaunch,
  serverScript,
  sleep,
  slashed,
  startServer,
  stopPort,
  testRoot,
  waitListening,
  write,
} from './campaign.ts';

interface SharedPort {
  run: RunResult;
  port: number;
  runs: string;
  err: string;
}

const errOf = (runs: string): string => readText(join(runs, 'red/a-1.err'));

// Otro sujeto, b-1, nombra el mismo puerto en su stream y deja su marca en live/ con `other` como PID.
async function invokeSharedPort(name: string, otherPid: string): Promise<SharedPort> {
  const root = testRoot(name);
  const port = await freePort();
  const other = `${otherPid} echo "$other" > "$RUNS_DIR/live/red.b-1"; echo 'localhost:${port}' > "$RUNS_DIR/red/b-1.jsonl"; `;
  const campaign = newCampaign(root, { launch: `${serverLaunch(serverScript(root, name), port)}${other}subject_launch "x"` });
  const run = runCampaign(campaign, { SCENARIOS: 'a' });
  return { run, port, runs: campaign.runs, err: errOf(campaign.runs) };
}

describe('Lanzador de referencia de sujetos headless (tests/headless/run.sh)', () => {
  it('para al acabar lo que escucha en los puertos del sujeto (ticket de la feature 0036 §3)', async () => {
    const root = testRoot('ports');
    const port = await freePort();
    const campaign = newCampaign(root, { launch: `${serverLaunch(serverScript(root, 'server'), port)}subject_launch "x"` });

    try {
      const result = runCampaign(campaign, { SCENARIOS: 'a' });

      expect(result.code, result.output).toBe(0);
      expect(await isListening(port)).toBe(false);
      expect(errOf(campaign.runs), result.output).toMatch(new RegExp(`puertos del sujeto: ${port} · escuchando al acabar: ${port}`, 'i'));
    } finally {
      stopPort(port);
    }
  });

  it('no para lo que ya escuchaba en un puerto del stream antes del sujeto (revisión final de la feature 0214)', async () => {
    const listener = createServer();
    await new Promise<void>((resolve) => listener.listen(0, '127.0.0.1', resolve));
    const port = (listener.address() as { port: number }).port;
    const campaign = newCampaign(testRoot('foreign-port'), { launch: `PORT=${port}; subject_launch "x"` });

    try {
      const result = runCampaign(campaign, { SCENARIOS: 'a' });

      expect(result.code, result.output).toBe(0);
      expect(await isListening(port)).toBe(true);
      expect(errOf(campaign.runs), result.output).toMatch(new RegExp(`puertos del sujeto: ${port} · escuchando al acabar: ninguno`, 'i'));
    } finally {
      listener.close();
    }
  });

  describe('un puerto que nombra otro sujeto (feature 0215)', () => {
    it('deja su arranque al último en acabar cuando salta un puerto compartido', async () => {
      const shared = await invokeSharedPort('handoff', 'other=$$;');
      try {
        expect(readText(join(shared.runs, `ports/${shared.port}`)), shared.run.output).toMatch(/^\d+\s*$/);
        expect(shared.err, shared.run.output).toMatch(/escuchando al acabar: sin consultar · compartidos/i);
      } finally {
        stopPort(shared.port);
      }
    });

    it('el último en acabar para el servidor compartido que arrancó antes que él', async () => {
      const root = testRoot('earlier');
      const port = await freePort();
      const script = serverScript(root, 'earlier');
      const campaign = newCampaign(root, { launch: `PORT=${port}; subject_launch "x"` });
      write(join(campaign.runs, `ports/${port}`), String(Math.floor(Date.now() / 1000) - 60));

      try {
        startServer(script, port);
        await waitListening(port);
        // SUBJECT_STARTED va en segundos: sin la espera, el servidor podía caer en el mismo segundo y contar como del sujeto.
        await sleep(2000);
        const result = runCampaign(campaign, { SCENARIOS: 'a' });

        expect(result.code, result.output).toBe(0);
        const err = errOf(campaign.runs);
        expect(await isListening(port), err).toBe(false);
        expect(err, result.output).toMatch(new RegExp(`escuchando al acabar: ${port}`, 'i'));
        expect(existsSync(join(campaign.runs, `ports/${port}`))).toBe(false);
      } finally {
        stopPort(port);
      }
    });

    it('trata como en curso la marca a medio escribir de otro sujeto', async () => {
      const shared = await invokeSharedPort('half-written', 'other=;');
      try {
        expect(shared.err, shared.run.output).toMatch(new RegExp(`compartidos con otro sujeto en curso, sin parar: ${shared.port}`, 'i'));
      } finally {
        stopPort(shared.port);
      }
    });

    it('no para un puerto que nombra otro sujeto en curso', async () => {
      // El propio bash del sujeto: sigue vivo mientras su limpieza mira los puertos.
      const shared = await invokeSharedPort('shared-live', 'other=$$;');
      try {
        expect(shared.run.code, shared.run.output).toBe(0);
        expect(await isListening(shared.port)).toBe(true);
        expect(shared.err, shared.run.output).toMatch(new RegExp(`compartidos con otro sujeto en curso, sin parar: ${shared.port}`, 'i'));
      } finally {
        stopPort(shared.port);
      }
    });

    it('para un puerto de otro sujeto que ya no corre', async () => {
      const shared = await invokeSharedPort('shared-dead', '( : ) & other=$!; wait $other;');
      try {
        expect(shared.run.code, shared.run.output).toBe(0);
        expect(await isListening(shared.port)).toBe(false);
        expect(shared.err, shared.run.output).toMatch(new RegExp(`escuchando al acabar: ${shared.port}`, 'i'));
        expect(shared.err).not.toMatch(/compartidos/i);
      } finally {
        stopPort(shared.port);
      }
    });
  });

  it('subject_ports junta PORT y los puertos del stream', () => {
    const stream = write(join(testRoot('ports-stream'), 'ports.jsonl'), '{"text":"abre http://localhost:4567 y PORT=5173 npm start; otra vez localhost:4567"}\n');

    expect(runLib(`JSONL='${slashed(stream)}'; PORT=4300; subject_ports`).output).toBe('4300,4567,5173');
  });

  it('subject_ports descarta puertos fuera de rango (feature 0215)', () => {
    const stream = write(join(testRoot('ports-range'), 'ports-range.jsonl'), '{"text":"abre http://localhost:70000 y http://localhost:4567"}\n');

    expect(runLib(`JSONL='${slashed(stream)}'; PORT=99999; subject_ports`).output).toBe('4567');
  });
});

