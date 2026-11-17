---
id: 20261108-184209-feature-0313-tasks-superpowers-7
title: Tasks — cli/src/tasks al día con los scripts de superpowers 7.0.2
spec: ./spec.md
plan: ./plan.md
created: 2026-11-08
---

# Tasks — `cli/src/tasks` al día con los scripts de superpowers 7.0.2 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0313-tasks-superpowers-7`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Resolvedor del repo, `-C` y `.gitignore` | done | 8a0e68c | |
| 2 | Ids, sub-tasks, bloque sin cerrar, pista de plan traducido y registro a v7.0.2 | done | dc5edd4 | |

## Verificación por task

- [x] Task 1 — los comandos de su campo «Verificación» del plan
- [x] Task 2 — los comandos de su campo «Verificación» del plan

Revisión final: Spec opus+high, con arreglos (4 Minor), 5 sin verificar · Código sonnet+high, sí (8 Minor) · Arquitectura no (plan), sobre dc5edd4
Pasada de fix: juntada en el cierre, 9 hallazgos (F5 y la regresión de F5 en git() RED→GREEN, F6-F8 guardas, F1-F4 por la suite)
Re-revisión: dc5edd4..juntada en el cierre, sdd-kit:effort-high + opus, 9/9 resueltos, 1 Minor nuevo (ruling)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Ruling: la Verificación dice `npx vitest`, que en Git Bash de esta máquina resuelve mal (`Cannot find module …\vitest\vitest.mjs`); se ejecuta `pnpm exec vitest` con los mismos argumentos — el mismo vitest del lockfile — si falla, solo cambia el lanzador.
- Ruling: los RED de la Task 1 que ya pasan con el port de hoy (`task start and task done reject -C`, `task brief with OUTFILE needs no repo`, `in a repo without commits workspace and task brief work`) son AND de la spec que hoy se cumplen; se quedan como guarda — 9 de 12 fallan — si el criterio fuera «todo test falla hoy», sobran tres tests de guarda.
- Task 1: Ruling: dist/cli/src/tasks reconstruido con kit:build dentro del commit de la task — dist.test.ts lo exige y el plan ya regenera dist — si no, el pre-commit rechaza el commit.
- Task 1: Ruling: Minor «=await» de verbs.ts (taskStartVerb) lo corrige la Task 2, que reescribe esa línea y entra en su revisión — un commit suelto pediría su propia re-review por un espacio — si no, queda un espacio de menos.
- Task 1: Ruling: Minor de orden (repo antes de «no such plan file» en start; workspace creado antes del error de tasks.md) — es el orden que fijan la decisión 11 de la spec y el plan — sin cambio.
- Task 2: Ruling: 4 RED de la Task 2 ya pasan hoy (sub-task 7a/12, mayúsculas, ids inválidos, lite entera) — AND que el port de hoy cumple, guardas — 7 de 19 fallan, incluido el cambio 15 (6 se lleva 6b).
- Task 2: minor (deferred): brief.ts duplica el patrón del id (isTaskId y ID_PREFIX) y el test de dígito /[0-9]/ — un ID_PATTERN y un hasDigit.
- Task 2: minor (deferred): brief.ts:137 parámetro «number» vago — lineNumber.
- Task 2: minor (deferred): brief.ts:138 línea de 107 caracteres en el toggle del bloque.
- Final: Ruling: el paquete de la revisión final se hizo con «sdd workspace -C <worktree de la feature>» en lugar del «sdd workspace» de la receta — es el arreglo de esta rama y deja el paquete en el workspace del plan, no en review-0313-dc5edd43 (comprobado: sin .temp allí) — si fallara, el paquete quedaría en el worktree de revisión, como hoy.
- Final: Ruling: capability check avisa de 5 requisitos nuevos de cli.md de más de 500 caracteres (aviso, rc 0) — es el delta aprobado; partirlo cambia la spec — al ticket: la prueba del delta en copia no corrió capability check.
- Final: Ruling: workspace creado antes del error de tasks.md (Código 1) — es el orden de la fuente y de la decisión 11, y la siguiente llamada lo reutiliza — si es errónea, una carpeta ignorada de más.
- Final: Ruling: un bloque sin cerrar con «## Task Overview» dentro bloquea el brief (Código 4) — es lo que hace el awk de v7.0.2 (hidden con /^#+[ \t]+Task[ \t]/), y el bloque hay que cerrarlo igual — si es errónea, un error que nombra encabezados de task por uno que no lo es.
- Final: Ruling: --help sigue con TASK_NUMBER (Código 5) — la restricción fija los usage existentes; cambiar positionals cambia el uso — si es errónea, la ayuda no dice que valen letras.
- Final: Ruling: requireRepo(need) con argumento de modo (Código 6) — es la interfaz del plan y la del sdd-repo --with-commit de la fuente — si es errónea, una rama en stop.
- Final: Ruling: -C cambia cómo se resuelven PLAN_FILE y OUTFILE sin decirlo en --help (Código 8) — la spec lo pide así (como git -C) y el test relativo lo fija — si es errónea, un usuario que espere lo contrario.
- Final: Ruling: phases.ts TASK_COMMAND (\d+) no cuenta «task start … 6b» (Spec, declinado) — mide tiempos, como timing.ts, fuera de alcance — al ticket.
- Final: Ruling: orden «no such plan file» frente al repo distinto entre brief y start (Spec, declinado) — es el de cada script de la fuente — ninguno.
- Final: Ruling: task-a1 y task-A1 en un FS sin mayúsculas (Spec, declinado) — exige un plan con las dos; no realista — un brief pisado.
- Final: Ruling: aviso del bloque en task start sin test con el binario (Spec, declinado) — mismo código que brief, ningún THEN lo pide para start — ninguno.
- Final: Ruling: declinados del eje Código (mensajes y -C de la spec, arquitectura, upstream, ledger rulings sin -C, dist/) — los cubre el eje Spec, el plan o el build — ninguno.
- Final: no verificados del eje Spec: kit:upstream, idempotencia de kit:build/kit:notices y la suite lenta de tasks → los corre el hilo tras la pasada; cli:test-min → Ruling: es de la release (CLAUDE.md, regla 5) — si es errónea, un rojo con Node 22.18.0 sale en la CI de la rama.
- Final: Ruling: git.ts:36 «notStarted» también es true con ERR_CHILD_PROCESS_STDIO_MAXBUFFER (git arrancó) — el mensaje que sale («maxBuffer length exceeded») informa, el tope es 64 MB y renombrar abre un commit de código sin revisar por un nombre — si es errónea, un nombre que engaña en un caso raro.
- Final: Ruling: repo.slow.test.ts:179 /^git dijo: \S/m no exige ENOENT (fuera de alcance) — con PATH vacío el texto solo puede venir del arreglo — si es errónea, un test algo laxo.
