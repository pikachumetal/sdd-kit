import { describe, it, expect, vi } from 'vitest';
import { join } from 'node:path';
import { git } from './helpers.ts';
import {
  BRANCH,
  ROADMAP,
  addRoadmapRow,
  claimFixture,
  counter,
  publishFromOther,
  read,
  rejectPushes,
  remoteRoadmap,
  runClaim,
  save,
  setDebtDestination,
  sha,
  write,
} from './claim-fixture.ts';

vi.setConfig({ testTimeout: 120_000 });

const OTHER_ROW = '| 0203 | La del otro clon | ⏳ |';
const RENAMED = 'feature/0205-single-id-sequence';
const NEXT_BRANCH = 'feature/0204-single-id-sequence';

describe('sdd id claim publica la reserva', () => {
  it('publishes the reservation', async () => {
    const fx = claimFixture();

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: 0203 es tuya; publicada en origin/develop');
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
    expect(sha(fx.wt, 'HEAD')).toBe(sha(fx.repo, 'develop'));
  });

  it('lists the other unpublished reservations', async () => {
    const fx = claimFixture({ rows: ['| 0203 | Ids | ⏳ |', '| 0204 | Otra | ⏳ |'] });
    const other = git(fx.repo, ['log', '-1', '--format=%h %s', 'develop']);

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    const header = result.text.indexOf("push: también publica 1 commit de 'develop' que no es de la 0203:");
    expect(header).toBeGreaterThan(-1);
    expect(result.text.indexOf(`- ${other}`)).toBeGreaterThan(header);
  });

  it('is idempotent', async () => {
    const fx = claimFixture();
    await runClaim(fx.wt);
    const published = sha(fx.remote, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(0);
    expect(result.text).toContain('id: 0203 ya estaba en origin/develop; nada que publicar');
    expect(sha(fx.remote, 'develop')).toBe(published);
  });

  it('refuses a dirty develop worktree', async () => {
    const fx = claimFixture();
    write(fx.repo, 'notas.txt', 'a medias');
    const before = sha(fx.repo, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain(`destino con cambios: ${fx.repo}; límpialo y relanza sdd id claim`);
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(sha(fx.remote, 'develop')).not.toBe(before);
  });

  it('requires an id when the branch has none', async () => {
    const fx = claimFixture({ branch: 'feature/fix-sala' });

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(2);
    expect(result.stderr).toContain("--id: la rama 'feature/fix-sala' no lleva id; pásalo con --id");
  });

  it('claims from a temporary worktree when develop is checked out nowhere', async () => {
    const fx = claimFixture();
    git(fx.repo, ['switch', '-q', '--detach']);

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: 0203 es tuya; publicada en origin/develop');
    expect(git(fx.repo, ['worktree', 'list']).split('\n')).toHaveLength(2);
  });
});

describe('sdd id claim renumera si otro publicó el id', () => {
  function renumberFixture() {
    const fx = claimFixture({ rows: ['| 0203 | Ids | ⏳ |', '| 0204 | Otra, tras 0203 y `parent: 0203`; en la 0203 se vio | ⏳ |'] });
    setDebtDestination(fx.repo, '**Actuar → 0203**');
    git(fx.wt, ['merge', '-q', '--ff-only', 'develop']);
    publishFromOther(fx, OTHER_ROW);
    return fx;
  }

  it('renumbers when another clone published the id', async () => {
    const fx = renumberFixture();

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: la 0203 ya la tiene otro en origin/develop; la 0203 pasa a 0205');
    expect(result.text).toContain(`rama: ${BRANCH} → ${RENAMED}`);
    expect(result.text).toContain(`worktree: la carpeta sigue en ${fx.wt}`);
    expect(git(fx.repo, ['log', '--format=%s', 'develop'])).toContain('chore(roadmap): la 0203 pasa a 0205');
    const roadmap = remoteRoadmap(fx);
    expect(roadmap).toContain(OTHER_ROW);
    expect(roadmap).toContain('| 0205 | Ids | ⏳ |');
    expect(roadmap).toContain('| 0204 | Otra, tras 0205 y `parent: 0205`; en la 0203 se vio | ⏳ |');
    expect(roadmap).toContain('**Actuar → 0205**');
    expect(counter(fx)).toBe('0205');
    expect(git(fx.repo, ['branch', '--list', BRANCH])).toBe('');
    expect(git(fx.wt, ['branch', '--show-current'])).toBe(RENAMED);
  });

  it('renumbers after develop already merged the remote', async () => {
    const fx = claimFixture({ rows: ['| 0203 | Ids | ⏳ |'] });
    git(fx.other, ['pull', '-q', 'origin', 'develop']);
    write(fx.other, ROADMAP, read(fx.other, ROADMAP).replace(/(\| --- \| --- \| --- \|\r?\n)/, `$1${OTHER_ROW}\n`));
    save(fx.other, 'docs(roadmap): reserva del otro clon');
    git(fx.other, ['push', '-q', 'origin', 'develop']);
    git(fx.repo, ['pull', '-q', '--no-rebase', '--no-edit', 'origin', 'develop']);
    expect(read(fx.repo, ROADMAP)).toContain(OTHER_ROW);

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('la 0203 pasa a 0204');
    const roadmap = remoteRoadmap(fx);
    expect(roadmap).toContain(OTHER_ROW);
    expect(roadmap).toContain('| 0204 | Ids | ⏳ |');
  });

  it('renumbers every taken reservation', async () => {
    const fx = claimFixture({ rows: ['| 0203 | Ids | ⏳ |', '| 0204 | Otra | ⏳ |'] });
    publishFromOther(fx, OTHER_ROW);
    publishFromOther(fx, '| 0204 | La 0204 del otro | ⏳ |');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: la 0203 ya la tiene otro en origin/develop; la 0203 pasa a 0205');
    expect(result.text).toContain('id: la 0204 ya la tiene otro en origin/develop; la 0204 pasa a 0206');
    expect(git(fx.repo, ['log', '--format=%s', 'develop'])).toContain('chore(roadmap): la 0203 pasa a 0205, la 0204 pasa a 0206');
  });

  it('keeps the branch with own commits', async () => {
    const fx = claimFixture();
    publishFromOther(fx, OTHER_ROW);
    write(fx.wt, 'nota.txt', 'trabajo');
    save(fx.wt, 'feat: trabajo propio');

    const result = await runClaim(fx.wt);

    expect(result.text).toContain(`rama: tiene commits propios; no se renombra: hazlo tú a ${NEXT_BRANCH}`);
    expect(git(fx.wt, ['branch', '--show-current'])).toBe(BRANCH);
  });


  it('does not fast-forward a dirty branch', async () => {
    const fx = claimFixture();
    publishFromOther(fx, OTHER_ROW);
    write(fx.wt, 'borrador.txt', 'sin commitear');

    const result = await runClaim(fx.wt);

    expect(result.text).toContain('rama: cambios sin commitear; no avanza a develop');
    expect(git(fx.wt, ['branch', '--show-current'])).toBe(NEXT_BRANCH);
  });
});

describe('sdd id claim con el push rechazado', () => {
  function queueRemoteCommits(fx: ReturnType<typeof claimFixture>, rows: string[]): string[] {
    const shas = rows.map((row) => {
      addRoadmapRow(fx.other, row, 'docs(roadmap): reserva del otro clon');
      return sha(fx.other, 'HEAD');
    });
    git(fx.other, ['push', '-q', 'origin', 'HEAD:refs/heads/queue']);
    return shas;
  }

  function moveRemoteOnEachPush(fx: ReturnType<typeof claimFixture>, shas: string[]): void {
    const marker = join(fx.root, 'moves').replace(/\\/g, '/');
    const cases = shas.map((target, index) => `  ${index}) target=${target} ;;`);
    rejectPushes(fx, [
      `n=$(cat "${marker}" 2>/dev/null || echo 0)`,
      'case "$n" in',
      ...cases,
      '  *) exit 0 ;;',
      'esac',
      `echo $((n + 1)) > "${marker}"`,
      'unset GIT_QUARANTINE_PATH',
      'git update-ref refs/heads/develop "$target"',
      'echo develop avanzó >&2',
      'exit 1',
    ].join('\n'));
  }

  it('rechecks when the remote moved before the push', async () => {
    const fx = claimFixture();
    moveRemoteOnEachPush(fx, queueRemoteCommits(fx, [OTHER_ROW]));

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('la 0203 pasa a 0204');
    expect(git(fx.repo, ['log', '--format=%s', 'develop']).split('\n').filter((s) => s.startsWith('chore(roadmap)'))).toHaveLength(1);
    expect(remoteRoadmap(fx)).toContain('| 0204 | Ids con una sola numeración | ⏳ |');
  });

  it('gives up after 3 attempts', async () => {
    const fx = claimFixture();
    const before = sha(fx.repo, 'develop');
    moveRemoteOnEachPush(fx, queueRemoteCommits(fx, ['| 0210 | a | ⏳ |', '| 0211 | b | ⏳ |', '| 0212 | c | ⏳ |']));

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza sdd id claim en un rato");
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('rolls back on a merge conflict', async () => {
    const fx = claimFixture();
    git(fx.other, ['pull', '-q', 'origin', 'develop']);
    write(fx.other, 'conflicto.txt', 'del otro');
    save(fx.other, 'feat: otro');
    git(fx.other, ['push', '-q', 'origin', 'develop']);
    write(fx.repo, 'conflicto.txt', 'mío');
    save(fx.repo, 'feat: mío');
    const before = sha(fx.repo, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(1);
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('fixes the id with a tag when develop is protected', async () => {
    const fx = claimFixture();
    rejectPushes(fx, ['while read old new ref; do case "$ref" in refs/heads/*) echo protegida >&2; exit 1 ;; esac; done', 'exit 0'].join('\n'));

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain("push: 'develop' no admite push directo; id fijado con la etiqueta sdd-id/0203");
    expect(git(fx.repo, ['ls-remote', '--tags', 'origin', 'refs/tags/sdd-id/0203'])).not.toBe('');
    const again = await runClaim(fx.wt);
    expect(again.text).toContain('id: 0203 ya fijada con la etiqueta sdd-id/0203');
  });

  it('renumbers when the tag belongs to another clone', async () => {
    const fx = claimFixture();
    addRoadmapRow(fx.other, OTHER_ROW, 'docs(roadmap): reserva del otro clon');
    git(fx.other, ['tag', 'sdd-id/0203']);
    git(fx.other, ['push', '-q', 'origin', 'refs/tags/sdd-id/0203']);
    rejectPushes(fx, ['while read old new ref; do case "$ref" in refs/heads/*) echo protegida >&2; exit 1 ;; esac; done', 'exit 0'].join('\n'));

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('la 0203 pasa a 0204');
    expect(result.text).toContain('id fijado con la etiqueta sdd-id/0204');
  });

  it('takes the moved path when protected and moved', async () => {
    const fx = claimFixture();
    moveRemoteOnEachPush(fx, queueRemoteCommits(fx, [OTHER_ROW]));

    const result = await runClaim(fx.wt);

    expect(result.text).not.toContain('etiqueta');
  });
});

describe('sdd id claim sin remoto, sin fila o en tracker', () => {
  it('keeps the local counter without a remote', async () => {
    const fx = claimFixture();
    git(fx.repo, ['remote', 'remove', 'origin']);

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(0);
    expect(result.text).toContain('sin remoto: la 0203 vale (contador local)');
    expect(counter(fx)).toBeNull();
  });

  it('skips the remote in a subfolder project', async () => {
    const fx = claimFixture();
    write(fx.wt, 'app/.docs/sdd/sdd-kit.json', JSON.stringify({ ids: { mode: 'sequence' } }));

    const result = await runClaim(join(fx.wt, 'app'), ['--id', '0203']);

    expect(result.code).toBe(0);
    expect(result.text).toContain('sin comprobar en el remoto: la raíz del proyecto no es la del repositorio; la 0203 vale (contador local)');
  });

  it('checks a branch id without a row', async () => {
    const fx = claimFixture({ rows: [], branch: 'patch/0176-fast-suite-budget' });
    write(fx.repo, '.git/sdd-ids', '0179\n');
    const published = sha(fx.remote, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: 0176 libre en origin/develop');
    expect(sha(fx.remote, 'develop')).toBe(published);
    expect(counter(fx)).toBe('0179');
  });

  it('renumbers a taken branch id without a row', async () => {
    const fx = claimFixture({ rows: [], branch: 'patch/0176-fast-suite-budget' });
    write(fx.repo, '.git/sdd-ids', '0179\n');
    git(fx.repo, ['branch', 'feature/0176-otra', 'develop']);
    const before = sha(fx.repo, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: la 0176 ya la tiene otro en origin/develop; la 0176 pasa a 0203');
    expect(git(fx.wt, ['branch', '--show-current'])).toBe('patch/0203-fast-suite-budget');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('takes a published row that the local develop lacks as yours', async () => {
    const fx = claimFixture({ rows: [], branch: 'patch/0176-fast-suite-budget' });
    publishFromOther(fx, '| 0176 | Validar la franja horaria | ⏳ |');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: 0176 ya estaba en origin/develop («Validar la franja horaria»); nada que publicar');
    expect(git(fx.wt, ['branch', '--show-current'])).toBe('patch/0176-fast-suite-budget');
  });

  it('is idempotent without a row once the folder exists', async () => {
    const fx = claimFixture({ rows: [], branch: 'patch/0176-fast-suite-budget' });
    await runClaim(fx.wt);
    write(fx.wt, '.docs/sdd/specs/20261020-100000-patch-0176-fast-suite-budget/patch.md', '# Patch\n');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('id: 0176 libre en origin/develop');
    expect(git(fx.wt, ['branch', '--show-current'])).toBe('patch/0176-fast-suite-budget');
  });

  it('rejects an --id that is not four digits', async () => {
    const fx = claimFixture();

    const result = await runClaim(fx.wt, ['--id', '12']);

    expect(result.code).toBe(2);
    expect(result.stderr).toContain("--id debe ser un id de cuatro cifras: '12'");
  });

  it('keeps the local counter when the remote lacks the integration branch', async () => {
    const fx = claimFixture();
    git(fx.repo, ['push', '-q', 'origin', 'develop:main']);
    git(fx.remote, ['symbolic-ref', 'HEAD', 'refs/heads/main']);
    git(fx.repo, ['push', '-q', 'origin', '--delete', 'develop']);
    expect(git(fx.repo, ['ls-remote', '--heads', 'origin', 'develop'])).toBe('');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain('sin remoto: la 0203 vale (contador local)');
  });

  it('renames a reserved folder with the id', async () => {
    const fx = claimFixture({ rows: [] });
    const folder = '.docs/sdd/specs/20261020-090000-proposal-0203-ids';
    write(fx.repo, `${folder}/proposal.md`, '# Propuesta\n');
    addRoadmapRow(fx.repo, `| 0203 | Ids, ver \`${folder}/proposal.md\` | ⏳ |`, 'docs(roadmap): reserva 0203 con propuesta');
    git(fx.wt, ['merge', '-q', '--ff-only', 'develop']);
    publishFromOther(fx, OTHER_ROW);

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    const tree = git(fx.repo, ['ls-tree', '-r', '--name-only', 'origin/develop', '.docs/sdd/specs']);
    expect(tree).toContain('.docs/sdd/specs/20261020-090000-proposal-0204-ids/proposal.md');
    expect(tree).not.toContain('proposal-0203-ids');
    expect(remoteRoadmap(fx)).toContain('| 0204 | Ids, ver `.docs/sdd/specs/20261020-090000-proposal-0204-ids/proposal.md` | ⏳ |');
  });

  it('fixes the id with a tag and does not publish develop without merge.push', async () => {
    const fx = claimFixture();
    write(fx.repo, '.docs/sdd/sdd-kit.json', JSON.stringify({ ids: { mode: 'sequence' }, merge: { into: 'develop', noFf: true } }));
    save(fx.repo, 'chore: sin merge.push');
    git(fx.wt, ['merge', '-q', '--ff-only', 'develop']);
    const published = sha(fx.remote, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain("push: 'develop' no se publica (sin merge.push); id fijado con la etiqueta sdd-id/0203");
    expect(sha(fx.remote, 'develop')).toBe(published);
  });

  it('fixes the id with a tag and does not publish develop with merge.push false', async () => {
    const fx = claimFixture();
    write(fx.repo, '.docs/sdd/sdd-kit.json', JSON.stringify({ ids: { mode: 'sequence' }, merge: { into: 'develop', noFf: true, push: false } }));
    save(fx.repo, 'chore: merge.push false');
    git(fx.wt, ['merge', '-q', '--ff-only', 'develop']);
    const published = sha(fx.remote, 'develop');

    const result = await runClaim(fx.wt);

    expect(result.code, result.text + result.stderr).toBe(0);
    expect(result.text).toContain("push: 'develop' no se publica (merge.push: false); id fijado con la etiqueta sdd-id/0203");
    expect(sha(fx.remote, 'develop')).toBe(published);
  });

  it('rejects tracker', async () => {
    const fx = claimFixture();
    write(fx.wt, '.docs/sdd/sdd-kit.json', JSON.stringify({ ids: { mode: 'tracker' } }));

    const result = await runClaim(fx.wt);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("no está en modo 'sequence'");
  });
});
