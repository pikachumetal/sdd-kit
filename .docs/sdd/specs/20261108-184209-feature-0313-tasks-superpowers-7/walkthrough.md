---
id: 20261108-184209-feature-0313-tasks-superpowers-7
feature: 0313
title: Walkthrough — cli/src/tasks al día con los scripts de superpowers 7.0.2
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-08
---

# Walkthrough — `cli/src/tasks` al día con los scripts de superpowers 7.0.2

## 1. Cambios realizados

- **Resolvedor del repo, `-C` y `.gitignore`** (`8a0e68cd`): `cli/src/tasks/repo.ts` da `requireRepo('repo' | 'commit')`, el `sdd-repo` de la fuente, y `enterDirectory`, que hace `process.chdir` con `-C`/`--directory` en `sdd workspace`, `sdd task brief` y `sdd review package`. Fuera de un repo, o sin commits en los verbos que piden BASE o HEAD, los cinco verbos paran con 2, el mensaje en castellano y `git dijo:`. Antes daban `fatal: not a git repository`, `bad BASE: HEAD` o, en `task start` sin commits, `base: HEAD` con 0. El `.gitignore` de `.temp/sdd/` se escribe solo si falta.
- **Ids, bloque sin cerrar, plan traducido y registro** (`dc5edd43`): el escaneo de `brief.ts` es un port del awk de `task-brief` v7.0.2. Admite ids `A1`, `6b` y `2.1` comparados como texto entero, y mantiene en el brief una sub-task más profunda que extiende el id. Un bloque sin cerrar que oculta encabezados `Task` se para con su línea; uno que no oculta ninguno da el brief con aviso en stderr. Un plan sin encabezados `Task` lista hasta cinco con forma de task. `task start|brief|done` validan el id con la misma gramática. La entrada de `cli/src/tasks/` en `upstream.json` pasa a `v7.0.2` y suma `sdd-repo`; `THIRD_PARTY_NOTICES.md` y `dist/` se regeneran.
- **Capacidad `cli`**: seis requisitos nuevos y las reglas Límites, Avisos y Regla ante conflicto sustituidas, fusionados con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 1,43 h — reloj de la sesión 3,90 h desde 2026-11-08T18:37Z, sin 148 min de espera al dev-lead (2 esperas)
- Desviación: -0,07 h (-5 %)
- Causa de la desviación: Esperas y huecos: 18:45Z 12 min; 19:00Z 137 min. Los implementadores y revisores corrieron en segundo plano mientras el hilo preparaba los RED y los borradores: su duración no suma al reloj.
- Compactación: sí, antes del plan, en la parada de la spec → SDD (la regla de Native lo mandaba a subagentes con dos tasks pendientes)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 37.942.379 — claude-opus-5-5 37.942.379
- Tokens de subagentes: 9.421.698 en 10 despachos — Implement Task 2: ids, fence, hint, registry claude-sonnet-5-5 1.728.522 / 15 min; Re-review final 0313 claude-opus-5-5 664.217 / 2 min; Review Task 2 (spec + quality) claude-sonnet-5-5 300.914 / 1 min; Implement Task 1: repo, -C y .gitignore claude-sonnet-5-5 976.198 / 3 min; Revisor de spec, lente técnica claude-sonnet-5-5 194.372 / 1 min; Final review — Code axis claude-sonnet-5-5 452.066 / 2 min; Revisor de spec, lente dominio claude-sonnet-5-5 234.538 / 1 min; Final review fix pass 0313 claude-sonnet-5-5 1.795.643 / 15 min; Review Task 1 (spec + quality) claude-sonnet-5-5 126.228 / 0 min; Final review — Spec axis claude-opus-5-5 2.949.000 / 7 min
- Coste de la sesión: 21,12 $ (hilo 15,54 $ + subagentes 5,58 $)
- Review de spec: 2 revisores (dominio y técnica, sonnet) · hallazgos 20, aceptados 19

## 3. Desviaciones del plan

- Ninguna desviación de la spec.

### Decisiones tomadas sin el dev-lead

- `npx vitest` resuelve mal el binario en Git Bash de esta máquina (`Cannot find module …\vitest\vitest.mjs`); la verificación de las tasks corre con `pnpm exec vitest`, el mismo vitest del lockfile — si es errónea, ninguno: mismo binario
- 7 de los 23 RED ya pasaban con el port de hoy: son AND de la spec que hoy se cumplen (`-C` rechazado en `start` y `done`, OUTFILE sin repo, `workspace` y `brief` sin commits, sub-task `7a`/`12`, mayúsculas, ids inválidos, spec lite entera) y quedan como guarda; cada cambio «se trae» tiene al menos un test que fallaba — si es errónea, sobran guardas
- `dist/cli/src/tasks` se reconstruye dentro del commit de cada task, porque `dist.test.ts` lo exige en el pre-commit — si es errónea, ninguno: `dist/` sale del build (ADR 0023)
- El Minor de la Task 1 (`=await`) lo corrige la Task 2, que reescribe esa línea y entra en su revisión — si es errónea, un espacio de menos
- El paquete de la revisión final se hizo con `sdd workspace -C <worktree de la feature>` y no con el `sdd workspace` de la receta: es el arreglo de esta rama, y el worktree de revisión quedó sin `.temp` — si es errónea, el paquete queda en el worktree de revisión, como antes
- `sdd capability check` avisa de que 5 de los 6 requisitos nuevos de `cli.md` pasan de 500 caracteres (aviso, rc 0); es el delta aprobado y no se parte — si es errónea, requisitos largos en la capacidad
- Revisión final: los 12 Minor de los dos ejes entraron en la pasada de fix (`review.minors: fix`) salvo cinco del eje Código que se quedan: el workspace se crea antes del error de `tasks.md` (orden de la fuente y de la decisión 11), un bloque sin cerrar con `## Task Overview` dentro también bloquea el brief (lo hace el awk de v7.0.2), `--help` sigue con `TASK_NUMBER` (los `usage` existentes no cambian), `requireRepo(need)` con argumento de modo (interfaz del plan y de `sdd-repo --with-commit`) y `-C` cambia cómo se resuelven `PLAN_FILE` y `OUTFILE` sin decirlo en `--help` (lo pide la spec, como `git -C`) — si alguna es errónea, un aviso o una ayuda menos claros
- El primer arreglo de F5 metía `error.message` en `stderr` con cualquier fallo de git sin stderr, y `runGit` perdía el stdout de git; lo arreglé en el hilo (test RED→GREEN, juntado en el cierre) antes de la re-revisión, que lo cubre — si es errónea, ninguno: revisado
- La re-revisión deja un Minor: `notStarted` en `git.ts` también es cierto con `maxBuffer`, donde git sí arrancó; el mensaje que sale informa y renombrarlo abriría un commit de código sin revisar — si es errónea, un nombre que engaña en un caso raro
- Declinados del eje Spec: `cli/src/session/phases.ts` (`TASK_COMMAND`, `(\d+)`) no cuenta `task start … 6b` en los tiempos, fuera de alcance como `timing.ts`; el orden «no such plan file» frente al repo difiere entre `brief` y `start`, como en cada script de la fuente; `task-a1` y `task-A1` en un FS sin mayúsculas exigen un plan con las dos — si es errónea, tiempos sin contar o un brief pisado
- `cli:test-min` (Node 22.18.0) no corre en el cierre: es de la release (`CLAUDE.md`, regla 5) — si es errónea, el rojo sale en la CI de la rama

## 4. Verificación

### 4.1 Builds

- Por task: `pnpm exec vitest run` de sus ficheros (Task 1: 5 ficheros, 59 tests; Task 2: 6 ficheros) y `tsc --noEmit` en verde; pasada de fix: `test/tasks` entero y `git-env` 98/98; pre-commit `cli:test` y `cli:typecheck` en cada commit. `moon run kit:upstream` sobre `dc5edd43`: ninguna línea de `cli/src/tasks/` (quedan las de `skills/sdd-grilling/SKILL.md`, de la 0314). `kit:notices` y `kit:build` sobre el código del cierre, sin diff. `sdd capability check`: 23 válidas, avisos de longitud (§3).
- Gate: corre una vez tras `sdd merge --sync`, porque hay otras ramas abiertas (0308, 0309, 0314); su línea y su sha van en el mensaje final del cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-08 · smoke con el binario (`cli/bin/sdd.js` con el código del cierre), una fila por THEN, en repos de prueba, todos como dice la spec · revisión final Spec (opus) y Código (sonnet) sobre `dc5edd43`, pasada de fix y re-revisión única (opus) de `dc5edd43` al código del cierre: 9/9 resueltos, 1 Minor con ruling · gate tras la sync, en el mensaje final

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `-C`: `sdd workspace -C <feature> plan.md` desde `review-0300-abc1234` | ejecución real | `<feature>\.temp\sdd\plan`, exit 0, el worktree de revisión sin `.temp/sdd` |
| `-C`, AND: `task brief -C` y `review package -C` en el mismo workspace | ejecución real | los dos escriben en `<feature>\.temp\sdd\plan` |
| `-C`, AND: `--directory` y `--help` | ejecución real | misma ruta; las tres ayudas dicen `[--directory <valor>]` |
| `-C`, AND: directorio que no existe | ejecución real | `directorio de -C no válido: <dir>` y el uso, exit 2 |
| `-C`, AND: `task start -C` y `task done -C` | ejecución real | `opción desconocida: «-C»`, exit 2 |
| Parada: `review package`, `task done` y `task start` fuera de un repo | ejecución real | mensaje con «al menos un commit», `git dijo: fatal: not a git repository …`, el uso, exit 2, nada escrito |
| Parada, AND: `workspace` y `task brief` fuera de un repo | ejecución real | mensaje sin «commit», `git dijo:`, exit 2, nada escrito |
| Parada, AND: `task brief` con OUTFILE fuera de un repo | ejecución real | `wrote brief.md: 3 lines`, exit 0 |
| Parada, AND: `start`, `done` y `package` en un repo sin commits | ejecución real | «al menos un commit», `git dijo: fatal: Needed a single revision`, exit 2, sin brief |
| Parada, AND: `workspace` y `task brief` sin commits | ejecución real | exit 0 los dos |
| Ids: `task brief plan.md 6b` | ejecución real | solo `## Task 6b` |
| Ids, AND: `6`, `2`, `A1` | ejecución real | `6` sin `6b`, `2` sin `2.1`, `A1` con `## Task Overview` |
| Ids, AND: `7` con `7a`, `1` sin `12` | ejecución real | como dice la spec |
| Ids, AND: `start`, `brief` y `done` aceptan y rechazan | ejecución real (`brief` con `Overview`, `6*` y `6.`: exit 2 y el uso) · suite (`start` y `done` con `6b`: `task-ids.slow.test.ts`) | como dice la spec |
| Bloque: Task 1 con bloque sin cerrar en la línea 7 | ejecución real | el mensaje con «línea 7 de plan.md», exit 1, sin brief |
| Bloque, AND: Task 2 oculta | ejecución real | esa línea y después `task 2 not found …`, exit 1 |
| Bloque, AND: bloque suelto al final de la Task 2 | ejecución real | brief, aviso con «línea 12», exit 0 |
| Bloque, AND: la Task 1 de ese plan | ejecución real | brief sin aviso, exit 0 |
| Sin `Task`: `## Tarea 1: Login` y `## Tarea 2: Logout` | ejecución real | la pista, las dos líneas con dos espacios, el «not found», exit 1 |
| Sin `Task`, AND: seis encabezados | ejecución real | lista los cinco primeros |
| Sin `Task`, AND: spec lite con `## Fase 1` | ejecución real | brief igual a la spec, sin la pista |
| `.gitignore`: con `*` y `!*/progress.md` | ejecución real | conserva las dos líneas |
| `.gitignore`, AND: sin fichero | ejecución real | lo crea con `*` |

### 4.3 Residuales / deuda generada

- Intermitentes: en el gate de cierre, `session-start-missing.test.ts` («injects without a session id») y `notices.test.ts` («every skill text is free of source versions») fallaron con `Error: Test timed out in 5000ms.` con la máquina cargada; solos pasan en la rama y en `origin/develop` (24/24 cada uno). Fila de deuda «Intermitente: …» en el roadmap.
- La receta del paquete de la revisión final (`encargo-revision.md`) sigue sin `-C` (decisión 3 de la spec): el menor de la 0300 se repite en campo hasta que la use. Va al ticket.

## 5. Aprendizajes

- La receta del paquete de la revisión final (`encargo-revision.md`) sigue con `sdd workspace "<plan>"` dentro del worktree de revisión: con la 0313 el arreglo existe en la CLI (`-C`), pero en campo el menor de la 0300 sigue hasta que la receta lo use (decisión 3 de la spec). → ticket del kit.
- La prueba del delta en una copia (`sdd capability merge`) no pasa `sdd capability check`, que avisa de requisitos de más de 500 caracteres; el aviso salió al cerrar, con la spec ya aprobada. → ticket del kit.
- `npx` desde `cli/` en Git Bash da `MODULE_NOT_FOUND` (segundo caso tras la 0297), y `tech-stack.md` §Testing daba `npx vitest` como verificación de una task: corregido en `tech-stack.md`.
- El primer arreglo de un Minor (F5) cambió el contrato de `git()`, compartido por los verbos de merge y de roadmap, y ni su implementador ni su test lo vieron: lo cazó el hilo al leer el diff antes de la re-revisión. → ticket del kit.
- Retro: documento o skill desmentido → `npx vitest` no arranca en Git Bash; la verificación de una task nombra `pnpm exec` para ese shell (`.docs/sdd/tech-stack.md`)
- Retro: documento o skill desmentido → ticket del kit: el paso «el delta en una copia» de la pasada de coherencia de `sdd-propose` corre `sdd capability merge` sin `sdd capability check`, y los avisos de requisitos de más de 500 caracteres salen en el cierre, con la spec ya aprobada
