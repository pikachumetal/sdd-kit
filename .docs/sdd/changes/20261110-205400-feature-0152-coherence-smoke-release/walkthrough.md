---
id: 20261110-205400-feature-0152-coherence-smoke-release
feature: 0152
title: Walkthrough — Coherencia de todos los documentos, humo de todas las skills, batería de release y corte de la 3.0.0
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-13
---

# Walkthrough — Coherencia, humo, batería de release y corte de la 3.0.0

## 1. Cambios realizados

- **Coherencia de los documentos** (Task 1, a3cf177a, 94806cb4): cinco lectores sonnet contra `dist/skills/`. `PRODUCT.md`, `README.md`, `plugin.json`, la constitution (Art. I, III y IX con las siete fuentes de `upstream.json`), `steering/`, `capabilities/` y `.docs/workflow/` (marcadores en kit v3.0.0) quedan al día. Las ADR 0027 a 0033 sustituyen a la 0005, 0015, 0006, 0007, 0010, 0016 y 0018 con las rutas de la 3.0.0, y `decision-routes.test.ts` exige que cada glob de una ADR vigente case con algún fichero.
- **Las skills asumen la forma 3.0.0** (enmienda 7, 94806cb4): 82 menciones en 38 ficheros pasan a `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` y `steering/`. Los cambios nuevos nacen en `changes/`. Solo quedan ramas 2.x en `sdd-upgrade` y en las puertas de forma. El hook de inicio exige migrar a un proyecto 2.x con un kit que trae la v3.0.0. La ADR 0034 sustituye esa consecuencia de la 0012. Los moldes de las baterías pasan a la 3.0.0; `mold-salas-2x` queda para los escenarios que miden la 2.x.
- **Deuda de la fila** (Task 2):
  - la oferta de migración lee `sdd-kit.local.json` (13468e88);
  - `kit:upstream` falla si la versión vista sube sin revisar todo su ámbito (8a710893);
  - la receta del worktree de revisión en Windows (265ec1f4);
  - menores de la 0120 en el lanzador (fe69bf1a);
  - la `Tanda` y las excepciones E2E con escenario (eca4b9fb, 9aa7d4ec, 85905542).
- **Mediciones y rojos de `develop`** (Task 3, 47a91cc6, 86d510ee, d5dc6963, 0e7ccfc5, 9ea15191, fd5677d6): las mediciones de la fila, n ≥ 3, y los rojos de la 0311 se arreglan moviendo cada regla al paso donde se decide. `sdd workspace` imprime `· retomo en la Task <id>` (c95a2691). El lanzador para los nietos que deja vivos un sujeto (5d7ad733).
- **Batería de release, re-medida y medida final** (Task 4): son 1696 sujetos en `tests/release-3.0.0.md`, con un lector sonnet por batería que juzga cada fila de rúbrica. Commits: 1534bf7c, fcf1fcc1, 232bc35c, 17f7ffb2, 7ef969e6, 7a6b6027, bca0e00e, d030e7e4, 2e6a36e0, 436bdcdd, 9d54b57f, 080be564, 97694256, 36638dcf y 512d8c3d. Arreglos sin alargar ninguna skill: saldo de `skills/` e `includes/` de −872 palabras en la rama. Además, `sdd-implement-native` y `sdd-implement-subagent` vuelven a la lista del modelo: un «: » sin comillas rompía su `description` (080be564).
- **Cierre** (commit de cierre): la pasada de fix de la revisión final y los registros.
  - Fuera las citas a documentos en comentarios (Art. X).
  - El cerrojo, con `windowsHide` y tope de 5 s, y sus tests al conjunto lento.
  - `migrationOrder` en el hook.
  - Una fila de revisión de fuentes nombra su fichero en la primera celda.
  - `battery.mjs` y dos tests leen `changes/`.
  - Test del barrido de rutas 2.x.
  - Delta de `migration`, `planning`, `archive` y `cli`.
  - La enmienda del 2026-11-13.

ADR: la que sustituye a la 0005 → decisions/0027-artifact-and-branch-conventions-3.md
ADR: la que sustituye a la 0015 → decisions/0028-final-review-in-three-axes-3.md

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 20h
- Esfuerzo real: 0,53 h — reloj de 2 sesiones 0,53 h desde 2026-11-13T10:10Z, sin 0 min de espera al dev-lead (0 esperas). Solo cuenta las sesiones de este perfil de Claude Code; las del 2026-11-10 al 2026-11-13 no tienen transcripts aquí. Aproximado con las marcas de los commits: 99b7bb95 (2026-11-10 21:32) → cierre (2026-11-13), unos 2,6 días de calendario con las tandas en segundo plano.
- Desviación: sin medir (las horas de hilo de las sesiones anteriores no están medidas)
- Causa de la desviación: sin medir
- Compactación: no medido en las sesiones anteriores; `no` en la de cierre
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 25.275.182 — claude-opus-5-5 25.275.182 (sesiones de cierre)
- Tokens de subagentes: 17.623.002 en 4 despachos — Final review — Architecture axis claude-opus-5-5 4.092.818 / 6 min; Re-review of the final-review fix pass claude-opus-5-5 201.583 / 0 min, en curso; Final review — Spec axis claude-opus-5-5 11.331.675 / 10 min; Final review — Code axis claude-sonnet-5-5 1.996.926 / 3 min
- Coste de la sesión: 17,41 $ (hilo 9,43 $ + subagentes 7,98 $), solo las sesiones de cierre
- Coste de sujetos: 731,48 $ en 1696 sujetos sonnet (uno Opus en `sdd-implement:p4`) — campañas de la Task 3 y la Task 4, en `tests/release-3.0.0.md`
- Review de spec: 2 revisores · hallazgos 20, aceptados 20; enmiendas revisadas por opus (10 y 8 hallazgos, aceptados)

## 3. Desviaciones del plan

- **La Task 4 queda en parte y la Task 6 no se hace en esta rama** (enmienda 2026-11-13, dev-lead: «la podemos mergear y cerrar de momento, ponernos con grilling, y luego seguir»). Las filas de `develop` se reparten así:
  - 0341 y 0342: el entrevistador (`sdd-grilling`, 8 rojos de 19).
  - 0343: los rojos que fallan en los dos sujetos o vuelven tras arreglarlos, los de 1 de 2 como bugs, la batería entera sobre el kit final (cubre la re-ejecución por `dist/` de la decisión 6), el humo de `add-to-changelog` y de `sdd-templates`, y el corte.
- **Coste**: el techo pasó de 360 $ a 800 $ por cuatro enmiendas con la frase del dev-lead; se gastaron 731,48 $ en sujetos.

### Decisiones tomadas sin el dev-lead

- Fila K8 de `rc1` y `rc2` quitada — sin filas nuevas en Now no hay línea que añadir con `add-to-changelog` — el humo de `add-to-changelog` queda sin escenario hasta la 0343.
- Filas de rúbrica rehechas tras leer sus rojos: Xw quitada (Xw2 mide el destino), RM3h, PL2 con «sin observar» y motivo, Sp1 con medida propia, R7, O4 y DP6 — eran filas que no medían la conducta — una fila relajada de más esconde un rojo real.
- Molde `n5` con un template 3.0.0 — un 2.x migra antes de nada (ADR 0034) y el aviso no tenía hueco — `n5` no mide un template 2.x.
- Re-ejecución por `dist/` tras bca0e00e solo de los escenarios tocados; la batería entera, a la 0343 — es la (c) de la 0343 — un rojo de una skill tocada tras la medida final sale en la 0343, antes del corte.
- Humo de `add-to-changelog` y carga de `sdd-templates`, a la 0343 — la batería final de la 0343 lo corre — el corte saldría sin humo de una skill que solo corre en el corte.
- La regla de desvío repetida en «How you stop» de `sdd-implement` se queda — es el arreglo medido de `u1` (0e7ccfc5, U1 1/2 en `w-imp`); quitarla sin medir puede romper U1 — una frase duplicada hasta la 0343.
- `sdd-grilling` crece 15 palabras — la restricción es el saldo de las skills tocadas juntas (`CLAUDE.md`, regla 6), −9 en 17f7ffb2; la 0342 la reescribe — 15 palabras de más hasta la 0342.
- Sin escenario de batería para el WHEN «al retomar» — el sufijo lo fija `repo.slow.test.ts` sobre la CLI — ninguno observable.
- `resumeTask` no comprueba el plan del ledger; marcado `ponytail:` — el workspace es del plan por `plan-path` — un «retomo» falso con un workspace heredado.
- La ADR 0027 enlaza la 0012 sustituida — las ADR son inmutables y la 0012 dice `superseded by 0034` — un salto más al leer.
- `nowRow` en cuatro `subject.mjs` — cada molde lleva su forma de brief; unificarlo pide relanzar sujetos de cuatro baterías — deriva al cambiar el brief.
- Un vigilante de descendientes por sujeto — con `MAX_PARALLEL` ≤ 5, como mucho 5 consultas cada 15 s — algo de retraso en el reenvío de stdout con muchos sujetos.
- `lock.ts` usa `ps` y `real-deps.mjs`, `/proc` — `ps -o lstart` da la hora absoluta; sin `ps`, el cerrojo espera — ninguno.
- Listas `MOLDS_2X` y `MIGRATING` con nombre — un molde 2.x nuevo falla el test si no se apunta — editar la lista.
- `v3.0.0.md` crece 81 palabras — es una migración, no una regla de skill — ninguno.
- `sdd workspace` con un plan inexistente imprime la ruta y sale con error — un plan que no existe es un error — ninguno.
- La línea de stderr de `sdd workspace` es para la persona — `feature-flow` y la enmienda del 2026-11-11 lo dicen — ninguno.
- ADDED de `cli` («Un cerrojo cuyo PID reutilizó otro programa se rompe») `sin aprobar` — documenta el arreglo que pidió la decisión del dev-lead del 2026-11-12 («no deudas...») — un requisito que el dev-lead no leyó.

### ✋ Sin revisar

- sin revisar: commit de cierre — tras la re-revisión, devuelve a `capabilities/archive.md` el AND «Abiertas a la vez», que la pasada de fix había perdido en el MODIFIED; quita un import sin usar de `with-lock.slow.test.ts`; quita tres menciones a `sdd-end-patch` de `operations.md`.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build` → exit 0.
- Gate: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 729/729 · cli:typecheck: corrió · cli:test: corrió 2468/2480 (12 skipped) · 2 min 2 s · configuración: la del gate, sin `--affected` (la pasada toca `cli/`) · sobre el commit de cierre, sin las tres correcciones de la re-revisión. La pasada de la suite que vale para el merge corre tras el merge de sincronización y va en el mensaje final.
- Tras la re-revisión: `word-budget.test.ts` 77/77, `with-lock.slow.test.ts` 2/2.
- Slow de lo tocado: `upstream-watch.slow.test.ts` 28/28; `subject-output-privacy.slow.test.ts` y `no-shell-scripts.test.ts` 28/28.
- `sdd capability check` → `Capacidades válidas: 23`; `sdd decision check` → `Decisiones válidas`; `sdd roadmap check` → `Roadmap válido`; `kit:upstream` → `Fuentes al día: 46 entradas.`

### 4.2 Smoke / tests

- Validación en campo: 2026-11-13 · revisión final en tres ejes sobre 512d8c3d (Spec opus, Código sonnet, Arquitectura opus; con arreglos, 0 Críticos) y re-revisión opus de la pasada de fix (hallazgos resueltos; 1 Important nuevo y 1 Minor, arreglados en el hilo, 1 sin revisar) · gate de la pasada en verde · smoke con ejecución real de `sdd workspace` y del hook de inicio · la suite del merge, tras el merge de sincronización (mensaje final) · el uso real lo hacen los proyectos con los tickets de `sdd-feedback`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `feature-flow`: `sdd workspace` escribe en stderr `Workspace del plan: <ruta> — …` | ejecución real (plan de dos tasks en el scratchpad) | la línea, con la ruta absoluta |
| `feature-flow`: con `Task 1: complete` en el ledger, acaba en `· retomo en la Task 2`; sin ninguna o con las dos, sin sufijo | ejecución real | las tres variantes como dice el THEN |
| `migration`: aviso de migraciones pendientes al usuario y al agente | ejecución real (`systemMessage`) y suite (`session-start.test.ts` 21/21) | «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.3.4 … hasta la 3.0.0» |
| `migration`: con `unattended` en `sdd-kit.local.json`, «no ofrezcas ni migres»; con `pair` en local sobre un `unattended`, la oferta | suite | verde |
| `migration`: un 2.x con la v3.0.0 en el kit migra antes de nada; en `unattended`, no hace el trabajo | ejecución real (`sessionStartOutput` con un kit 3.0.0 y `pair`/`unattended` en `sdd-kit.local.json`) | las dos órdenes literales |
| `planning`: con la forma 2.x, `sdd-roadmap` no escribe y ofrece `sdd-upgrade` | batería `sdd-roadmap:m6` (`z-rmp`, kit bca0e00e) | verde con reparo, 2/2 |
| `planning`: los MODIFIED sin cláusula 2.x (propuesta, reunión, reordenar, enmienda, release, secciones, patch en Now, «qué sigue», triaje) | no probado: texto de la capacidad al día con la skill; la conducta la mide la batería de `sdd-roadmap`, entera en la 0343 | — |
| `archive`: borradores sin el changelog 2.x; el cierre no escribe el changelog; la deuda en `debt.md` | no probado: texto de la capacidad al día con la skill; la batería de `sdd-archive`, entera en la 0343 | — |
| `cli`: un cerrojo con PID reutilizado se rompe con «Cerrojo huérfano: …»; con el PID anterior al cerrojo, espera | suite (`with-lock.slow.test.ts` 2/2) | verde |

### 4.3 Residuales / deuda generada

- A la 0343, por la enmienda del 2026-11-13: lo que la fila de `develop` no nombraba se le añade tras el merge de sincronización: `u1` (U1r 0/2), `h2` (S 0/1) y el humo de `add-to-changelog` y `sdd-templates`.
- `sdd capability merge` pierde una línea de un MODIFIED sin avisar cuando el delta reescribe otra con su `REMOVED`: `lostLines` (`cli/src/capabilities/merge.ts:61`) compara cuántas líneas hay, no cuáles. Le pasó a este cierre con «Abiertas a la vez» de `archive`. Va al ticket del kit.

## 5. Aprendizajes

- El merge de capacidades no basta para saber que no se pierde nada: tras `sdd capability merge`, `git diff` de la capacidad y cada línea `-` con su `REMOVED` en el delta → ticket del kit (el arreglo es del CLI).
- El paquete de la revisión final de una rama con evidencia en `specs/` necesita excluir esa carpeta, `dist/` y el fichero de evidencia de la batería. La receta de `encargo-revision.md` nombra la carpeta en `changes/`. Sin las exclusiones, el paquete tenía 11.155 ficheros → ticket del kit.
- `sdd session tokens` lee un solo perfil de Claude Code: con sesiones repartidas entre dos `CLAUDE_CONFIG_DIR`, el tiempo real sale corto → ticket del kit.

Retro: documento o skill desmentido → ticket del kit: la plantilla de spec dice que `sdd capability merge` rechaza perder una línea del vivo que no esté en el MODIFIED, y perdió «Abiertas a la vez» de `archive` porque el delta reescribía otra con su `REMOVED` (`lostLines`, `cli/src/capabilities/merge.ts:61`)
Retro: documento o skill desmentido → ticket del kit: la receta del paquete de `encargo-revision.md` excluye la carpeta de la feature en `changes/`, y la de la 0152 vive en `specs/`; sin excluirla, ni `dist/` ni la evidencia de la batería, el paquete eran 11.155 ficheros
Retro: búsqueda a ciegas → ticket del kit: `sdd session tokens` busca los transcripts en un solo perfil de Claude Code (`CLAUDE_CONFIG_DIR`); las sesiones del otro perfil no salen, y hicieron falta cuatro búsquedas para saberlo
