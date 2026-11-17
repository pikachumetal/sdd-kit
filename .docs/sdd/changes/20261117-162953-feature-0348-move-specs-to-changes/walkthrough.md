---
id: 20261117-162953-feature-0348-move-specs-to-changes
feature: 0348
title: Walkthrough — La 3.0.1 mueve specs/ a changes/
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-17
---

# Walkthrough — La 3.0.1 mueve `specs/` a `changes/`

## 1. Cambios realizados

- **CLI** (`b2adb3a56`): `addedCommits` de `cli/src/estimation/releases.ts` lee `changes` y `specs` en un solo `git log` y gana el commit más viejo, así una carpeta movida sigue en la release en que nació. Test nuevo en `releases.slow.test.ts`.
- **Migración y textos del kit** (`313d70b01`):
  - `skills/sdd-upgrade/references/migrations/v3.0.1.md`, con los dos comandos `node -e`: mover (para sin mover nada ante algo sin versionar, una carpeta vacía o un nombre repetido) y reescribir rutas fuera de la evidencia.
  - `sdd-upgrade`, `add-to-changelog`, `coherence-pass.md` y `sdd-templates` dejan de nombrar `specs/` como carpeta viva.
  - `path-length.test.ts` sube a 142 y `skills-3x-paths.test.ts` pierde dos entradas de `ALLOWED`.
  - `CLAUDE.md`, la constitution, la arquitectura, `operations.md` y las guías de `.docs/workflow/` (marcador «kit v3.0.1»).
  - `plugin.json` en 3.0.1.
- **Este repo, migrado**:
  - `27bd1acce`: 35.573 renombrados R100 de las 319 carpetas, los lectores del repo (`statistics.test.ts`, `battery.mjs`, `upstream.json`, `THIRD_PARTY_NOTICES.md`) y las rutas de los `.md` que no se mueven.
  - `875ba6e35`: los `.md` de primer nivel de las carpetas movidas, `estimation-log.md` regenerado y `sdd-kit.json` en 3.0.1.
- **Changelog** (`0a02c27e3`): la entrada de la 0348 en `[Unreleased]`.
- **Pasada de fix de la revisión final** (juntada en el commit de cierre):
  - `migration-v3-0-1.slow.test.ts` ejecuta los dos comandos de `v3.0.1.md` contra un repo de prueba.
  - El comando 1 para ante una entrada sin nada versionado, y su mensaje es «No se mueve nada; <grupo>: …», como pide el THEN.
  - El comando 2 salta un `.md` que no es UTF-8.
  - La «Verification» busca `../specs/` solo dentro de `.docs/sdd/` y comprueba que una segunda pasada no reescribe nada.
  - 19 rutas de proyectos de campo y de moldes vuelven a `specs/`.
  - `battery.mjs:30` vuelve a `specs`: `scenarioPrices` ya juntaba `changes/` (la decisión 9 partía de una premisa equivocada).
  - La rúbrica de la batería de `sdd-upgrade` acepta la 3.0.1.
- ADR: la 0036 (decisión 13) → `decisions/0036-documents-by-reader-single-changes.md`; la 0034 pasa a `superseded by 0036`.

- **Tras la re-revisión, sin revisar** (van a ✋):
  - el arreglo de los comandos en ASCII: los dos comandos en ASCII (`\ufffd`, `\u00ed`, con su test), la «Verification» admite los `.md` que no son UTF-8, y cinco rutas de fixtures y moldes en `.md` de primer nivel vuelven a `specs/`.
  - el arreglo del molde salas3-current: el molde `salas3-current` de la batería de `sdd-upgrade` va en 3.0.1; lo exige `molds.test.ts`, que dio el rojo del gate de cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: migration
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 1,66 h — reloj de la sesión 2,03 h desde 2026-11-17T15:25Z, sin 22 min de espera al dev-lead (2 esperas)
- Desviación: −0,84h (−34 %)
- Causa de la desviación: Esperas y huecos: 15:34Z 9 min; 15:56Z 13 min
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 83.425.958 — claude-opus-5-5 83.425.958
- Tokens de subagentes: 15.850.604 en 6 despachos — Revisor técnico de la spec 0348 claude-sonnet-5-5 900.046 / 2 min; Revisor de dominio de la spec 0348 claude-sonnet-5-5 232.031 / 1 min; Segunda ronda de revisión 0348 claude-sonnet-5-5 906.745 / 2 min; Final review — Code axis claude-sonnet-5-5 1.764.489 / 4 min; Final review — Spec axis claude-opus-5-5 8.008.040 / 12 min; Re-review final fix 0348 claude-opus-5-5 4.039.253 / 6 min
- Coste de la sesión: 33,02 $ (hilo 24,75 $ + subagentes 8,27 $)
- Coste de sujetos: no aplica
- Review de spec: 2 revisores y una segunda ronda · hallazgos 30, aceptados 28

## 3. Desviaciones del plan

- El commit de mover de este repo no es solo de renombrados: lleva también la reescritura de los `.md` que no se mueven, porque `root-docs-links.test.ts` del pre-commit rechaza los enlaces rotos de la raíz y de `steering/`. Las carpetas movidas siguen en R100 y `git log --follow` cruza el movimiento (`patch-0023-rutas-largas/patch.md`, 3 commits). La migración publicada no cambia: un proyecto sin ese test hace el commit solo de renombrados.

### Decisiones tomadas sin el dev-lead

- El rojo de la línea base, `molds.test.ts > … reservas-e2e-stale (e1)` («el entorno no responde en http://localhost:59084/health»), pasa solo (`Tests  4 passed`): es intermitente bajo carga y ajeno a la rama. Seguí — coste si está mal: el gate de cierre lo repite.
- El RED de la Task 1 pasaba sin el arreglo: `git mv` deja `specs/` vacía en disco y `changeFolders` la seguía leyendo. El test borra `specs/`, como hace la migración — coste si está mal: ninguno, sin esa línea el test no prueba nada.
- El primer `git mv` del repo falló a mitad con «bad source» en `r3-ver/out/rm3-1/void.test.js` de la 0152, un fichero presente y versionado. Fue un bloqueo transitorio de Windows: repetí el comando 1, que siguió con las 3 entradas restantes — coste si está mal: el retroceso del paso 2 de la migración.
- El commit de mover lleva la reescritura de lo que no se mueve (§3) — coste si está mal: `--follow` de un fichero no movido, que no aplica.
- Las formas como `../sdd/specs/`, desde otra carpeta, no se reescriben: la «Verification» las busca y el informe las lista, porque la decisión 4 aprobada fija qué se reescribe — coste si está mal: el dev-lead de un proyecto con docs en `.docs/<otra>/` arregla a mano lo que el informe le lista.
- `../specs/` se reescribe a cualquier profundidad dentro de `.docs/sdd/` (decisión 4), aunque en teoría apunte a un `specs/` de la raíz — coste si está mal: un enlace así pasa a `changes/` y se ve en el diff.
- La entrada de `CHANGELOG.md` va antes del corte, frente a la ADR 0020, porque el prompt de arranque la pide; el corte no la duplica — coste si está mal: el corte la reescribe.
- La batería de `sdd-upgrade` no se lanza aquí ni gana un escenario 3.0.0→3.0.1: sus filas aceptan la 3.0.1 y la corre entera el corte de la release — coste si está mal: un rojo en el corte.
- La revisión de reglas (paso 6) se queda: el «no gate» del THEN es el del movimiento — coste si está mal: una pregunta de más.
- Un fichero sin versionar suelto en `specs/` sale en dos grupos del mensaje — coste si está mal: una línea repetida en el informe.
- El U+FFFD literal que trajo la pasada de fix lo subí de Minor a Important: pegado en una consola con otra página de códigos, el comando saltaría ficheros sanos. Arreglado en el arreglo de los comandos en ASCII, sin revisar.

## 4. Verificación

### 4.1 Builds

- Línea base, sin `--affected` en un worktree separado: `kit:test-headless` dio 1 rojo intermitente (`reservas-e2e-stale (e1)`), que pasa solo.
- Gate: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 762/763 (sin filtro: cambia el build) · cli:typecheck: corrió (sin filtro: cambia el build) · cli:test: corrió 2504/2516, 12 saltados (sin filtro: cambia el build) · ~2 min · sobre el arreglo de los comandos en ASCII · tras el rojo en el arreglo de los comandos en ASCII (`el molde salas3-current de sdd-upgrade (r1) no queda por debajo de la última migración`), arreglo el arreglo del molde salas3-current: kit:test-headless: corrió 763/763; cli:typecheck y cli:test, en el pre-commit de el arreglo del molde salas3-current: 2504/2516. Sin filtro porque la rama renombra `package.json` de la evidencia.
- Lentos tocados: `migration-v3-0-1.slow.test.ts` 9/9 y `releases.slow.test.ts` 2/2.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-17 · gate de cierre en verde tras el arreglo del molde salas3-current (763/763 y 2504/2516) · comandos de `v3.0.1.md` con su test lento 9/9 y pegados en Git Bash y pwsh · migración aplicada a este repo · revisión final Spec y Código sobre `0a02c27e3`, pasada de fix, re-revisión con Spec I2 a medias, arreglado en el arreglo de los comandos en ASCII · 2 sin revisar: el arreglo de los comandos en ASCII, el arreglo del molde salas3-current

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `specs/` no existe y `changes/` tiene las carpetas | ejecución real: `test -e .docs/sdd/specs` en este repo; repo sintético | ✓ |
| commit de mover solo de renombrados y `--follow` | ejecución real: `git diff --name-status` del repo sintético; en este repo, 35.573 R100 y `--follow` de `patch-0023` (3 commits) | ✓ (en este repo, con la desviación de §3) |
| `ROADMAP.md` y `debt.md` reescritos | ejecución real: repo sintético y `git grep` en este repo, vacío fuera de las zonas de la decisión 8 | ✓ |
| la evidencia no cambia | ejecución real: `notas.md` del repo sintético con su enlace a `specs/` | ✓ |
| `docs/guia.md` fuera de `.docs/sdd/` no cambia | ejecución real: repo sintético | ✓ |
| sin gate | texto de `v3.0.1.md` («no gate» en los pasos 2 y 3) | ✓ |
| informe de lo que no es `.md` | ejecución real: `git grep` del paso 4 en este repo (todo son tests de 2.x o lectores de las dos carpetas) | ✓ |
| `sdd-kit.json` en 3.0.1 y commit `chore(sdd): migrar al kit v3.0.1` | ejecución real: `875ba6e35` | ✓ |
| carpeta repetida: no mueve nada, mensaje y sin marcador | suite: `con una carpeta repetida en changes/ no mueve nada y la nombra` («No se mueve nada; ya existen en changes/: …», exit 1, `git status` vacío) | ✓ |
| árbol sucio o algo ignorado: no mueve nada | suite: `con un fichero ignorado en specs/…` y `con una entrada sin nada versionado…`; el árbol sucio lo para el paso 1, texto | ✓ |
| sin `specs/`, solo el marcador | texto de `v3.0.1.md` (predicado); no probado en un proyecto real | no probado |
| `estimation`: carpeta movida en su release | suite: `a folder moved from specs/ to changes/ after a tag keeps its release`; ejecución real: la tabla de releases de este repo, igual antes y después | ✓ |

### 4.3 Residuales / deuda generada

- Intermitente: `molds.test.ts > sdd-archive construye en seco el molde reservas-e2e-stale (e1)` bajo la carga de `kit:test-headless` (8 workers): no responde `/health` en 15 s. Va al ticket.

## 5. Aprendizajes

- `git mv` de todas las entradas deja la carpeta origen vacía en disco, y la CLI, que mira `existsSync`, la sigue leyendo → la migración borra `specs/` vacía (`v3.0.1.md`, paso 2), y el test de `releases.slow.test.ts` lo reproduce.
- En este repo, un commit solo de renombrados no pasa el pre-commit si la raíz enlaza lo movido → `steering/operations.md` (§Testing, junto al pre-commit); la migración publicada lo deja como está, porque un proyecto no lleva ese test.
- Una reescritura de rutas por cadena falsea las rutas citadas de otros proyectos y de moldes (19 en `field-reports/` y `tests/*.md`, y 5 en `.md` de carpetas movidas) → la migración publicada no cambia: en un proyecto consumidor todas sus rutas sí se mueven; en este repo se devolvieron a mano.

Retro: error que cazaría un chequeo → ticket del kit: el marcador fijo `3.0.0` del molde `salas3-current` (`tests/batteries/sdd-upgrade/subject.mjs`) se queda atrás en cada subida de versión, y solo lo caza `kit:test-headless`, que no corre en el pre-commit: dio el rojo del gate de cierre
