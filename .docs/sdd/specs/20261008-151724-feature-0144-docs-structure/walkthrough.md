---
id: 20261008-151724-feature-0144-docs-structure
feature: 0144
title: Walkthrough — Documentos de la 3.0.0: estructura nueva, plantillas y rutas de la CLI
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Documentos de la 3.0.0: estructura nueva, plantillas y rutas de la CLI

## 1. Cambios realizados

- **Reparto** (`598c976`): la 0144 se partió al arrancarla en tres features con fila propia (0144, 0156 `sdd-init`, 0157 `sdd-upgrade` y migración v3.0.0), con su enmienda en la propuesta 0131.
- **Rutas de la CLI** (`a8e9d61`): `cli/src/cli/layout.ts` resuelve cada documento (roadmap, changelog, estimation) en su ruta 3.0.0 y, si no existe, en la 2.x, con aviso si están las dos; las carpetas de cambios se leen las dos (`changes/` y `specs/`). Lo usan `id next` (working tree, ramas y worktrees, con el máximo de los dos roadmaps), `roadmap check` (prefijo del fichero leído, corte por enlaces a `changes/`), `roadmap publish` (acepta `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` de la raíz), `estimation log` (log junto a `estimation.md`, releases desde `CHANGELOG.md`) y `sdd merge`.
- **`sdd decision check|index`** (`815153f`): `cli/src/decisions/` valida la forma de las ADR (nombre, `status`, sustitución a una ADR existente, `date`, `rutas` en bloque o en línea, globs admitidos, secciones en orden, números sin repetir) y las indexa; con `--files`, solo las `accepted` y `proposed` cuyas `rutas` casan. Globs con una función propia. Las 11 ADR del repo pasan sin cambios.
- **Plantillas** (`4523e14`): `PRODUCT-template.md` (encabezados de impeccable y `## Terminology` con el glosario de Matt), `operations-template.md` (Comandos, Testing con lo de la 0097, Frontend, Entornos), `adr-template.md` y `constitution-template.md` corta. `sdd-templates` con destinos 3.0.0, marcas 2.x, regla de rutas y verbos `decision`. Humo de `sdd-templates` 2/2. Topes de palabras de `sdd-templates` y del kit suspendidos por decisión del dev-lead (los restaura la 0157).
- **Constitution** (`750d9cb`): Art. IV fija la estructura 3.0.0 y Art. XI tipa los documentos de la raíz; ADR 0012 con el porqué.
- **Pasada de fix** (`9902fa0`): `decision index` acepta `--files a b` (la forma de la spec), `rutas` en bloque sin sangría, y el test de `id next` sobre otra rama detecta un fallo al leer `changes/`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5h
- Esfuerzo real: 0,7h — reloj del hilo aproximado con las marcas de los commits: de la apertura (17:54) al cierre (~18:40), implementación, revisión final, pasada de fix y cierre. Contexto, spec, review de spec y plan, ~0,9h más (desde ~16:55), fuera de este ratio.
- Desviación: −4,3h (−86 %)
- Causa de la desviación: el plan fijaba firmas, tests y mensajes literales, y los módulos de la CLI que se tocaban eran pequeños; la estimación contó como incertidumbre los tests lentos de ramas y el tope de palabras, y los tests pasaron a la primera y el tope se resolvió con una pregunta.
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución Native)
- Tokens del hilo: 62.706.292 — claude-opus-5-5 62.706.292 (incluye el contexto y la spec, anteriores al primer commit de la rama)
- Tokens de subagentes: 3.664.972 en 3 despachos — Review spec 0144 dominio claude-opus-5-5 1.121.727 / 3 min; Review spec 0144 técnica claude-sonnet-5-5 375.049 / 1 min; Revisión final 0144 claude-opus-5-5 2.168.196 / 4 min
- Coste de la sesión: 23,19 $ (hilo 20,28 $ + subagentes 2,91 $)
- Coste de sujetos: 0,41 $ en 2 sujetos sonnet — humo de `sdd-templates` 0,41 $
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet) · hallazgos 20, aceptados 18

## 3. Desviaciones del plan

- La evidencia del humo va en `humo/` y no en `green/`.
- El README pasa a contar 24 plantillas (lo comprueba `Skills.Tests.ps1`).
- `architecture.md` no nombra `layout.ts` en el árbol: no cabía en su tope de palabras; lo documenta la ADR 0012.
- Desvío aprobado por el dev-lead: topes de palabras de `sdd-templates` y del kit suspendidos (enmienda de la spec); los restaura la 0157.

### Decisiones tomadas sin el dev-lead

- Dos aserciones de `layout.test.ts` con un regex de separador mal escapado pasan a ruta exacta — fallo del propio test — coste si mal: ninguno.
- `fixtures.test.ts` espera el mensaje nuevo «No se encuentra changes/ ni specs/…» — lo pide el MODIFIED de `estimation` — coste si mal: un mensaje.
- La ayuda y el error de ruta de `roadmap publish` nombran los documentos de la raíz — consecuencia del MODIFIED de `release-flow` — coste si mal: texto.
- La fixture de `adr-template.md` de la Task 2 se borra y el test lee la plantilla real — coste si mal: ninguno.
- `Get-Section` de `AnchorTemplates.Tests.ps1` usaba `$(…)` entre comillas dobles; arreglado en fase RED — coste si mal: ninguno.
- La suspensión de topes se acotó a `sdd-templates` y al kit, no a todos los topes que pedía la frase del dev-lead — coste si mal: crecimiento sin vigilar de `sdd-templates` hasta la 0157.
- La evidencia del humo va en `humo/` y no en `green/` — coste si mal: una ruta.
- El README cuenta 24 plantillas — coste si mal: ninguno.
- «Reglas de la capacidad» de `estimation` completadas con las cuatro entradas que exige `capability check`, sacadas de sus requisitos vivos (enmienda sin comportamiento nuevo) — coste si mal: texto de reglas.
- Con los dos roadmaps, el aviso de `roadmap check` sale por stdout como el resto de sus avisos, no por stderr como decía la decisión 3 — coste si mal: un consumidor que separe stderr no lo ve.
- Lo que el revisor final dejó fuera (log 2.x tras migrar, carpetas iguales en `changes/` y `specs/`, `--files` con `./`, comillas y comentarios YAML, forma de `ROADMAP.md`, rutas 2.x en skills) queda fuera por la spec — coste si mal: un caso raro de ADR mal leído.
- Minors diferidos de la revisión final: `layout.test` no prueba una ruta relativa al cwd; la tabla de verbos de `sdd-templates` no nombra aún los documentos de la raíz en `roadmap publish` y `roadmap check`; `architecture.md` sin `layout.ts`; `adr-template.md` no dice que `./` no se admite; `decision index` escribe `.docs/sdd/decisions/` a mano (falso con `--path docs/sdd`); el BOM invisible en `check.test.ts`; código inalcanzable en `WordBudget.Tests.ps1` hasta la 0157.

## 4. Verificación

### 4.1 Builds

- Gate de cierre sobre `750d9cb`: `moon run cli:typecheck cli:test cli:test-slow kit:test kit:roadmap` → 700 Vitest, 156 lentos y 999 Pester en verde (13 saltados: los 3 topes suspendidos y 10 previos) · 244 s.
- Tras la pasada de fix (`9902fa0`): pre-commit (`cli:typecheck`, `cli:test` 708/708, `kit:test-fast` 944/944, `kit:roadmap`) y `cli:test-slow` 156/156.
- Revisión final: `sdd-kit:effort-high` + opus sobre `750d9cb`, With fixes (0 Critical, 3 Important, 8 Minor); la pasada de fix cierra los 3 Important con test RED→GREEN (el tercero, un test reforzado que se comprobó rompiendo el código a propósito). En Native la pasada la verifica su TDD, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-08 · suite 708 + 156 Vitest y 999 Pester · smoke por THEN con ejecución real de la CLI sobre un proyecto de prueba (abajo) · humo de `sdd-templates` 2/2 · revisión final opus sobre `750d9cb` con su pasada de fix `9902fa0`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `decisions` · ADR válida → `Decisiones válidas`, 0 | ejecución real | `decision check` sobre una ADR del smoke y sobre las 12 del repo: `Decisiones válidas`, rc 0 |
| `decisions` · status, date, rutas y secciones rotos → mensajes literales, 1 | ejecución real | ADR con `status: aceptada`, `date: 8/10/2026`, sin `rutas` ni secciones: las líneas literales de la spec, rc 1 |
| `decisions` · `superseded by` inexistente, número repetido, nombre sin `NNNN-`, glob no soportado, CRLF y BOM, sin carpeta | suite | `check.test.ts` |
| `decisions` · plantilla rellenada pasa; sin rellenar falla solo por `date` | suite | `check.test.ts` con `adr-template.md` real |
| `decisions` · `index --files` da las vigentes que casan, también con barras de Windows; sin coincidencias, nada y 0 | ejecución real | `--files src\db\a.ts --files README.md` → la `0001`; `--files README.md` → vacío, rc 0; sobre el repo, `--files cli/src/cli/layout.ts README.md` → 0011 y 0012, rc 0 |
| `decisions` · estados que no salen, `(sin título)`, globs `*` y `**` | suite | `index.test.ts`, `glob.test.ts` |
| `decisions` · el agente calca `adr-template.md` en `decisions/` | ejecución real | humo h2: `decisions/0001-reservations-json-file-storage.md`, `decision check` rc 0 |
| `cli` · `--help` lista `decision check|index` | suite | `cli.test.ts` |
| `roadmap` · `ROADMAP.md` validado con prefijo `ROADMAP.md:` | ejecución real | roadmap roto en la raíz → fallos con `ROADMAP.md:`, rc 1 |
| `roadmap` · con los dos, aviso y `Roadmap válido`, 0 | ejecución real | `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee` · `Roadmap válido`, rc 0 |
| `roadmap` · solo `roadmap.md` 2.x como hoy | ejecución real | `kit:roadmap` del pre-commit sobre este repo (2.x): `Roadmap válido` |
| `roadmap` · fila saldada y patch con enlace a `changes/` y `.docs/sdd/changes/` deciden por el tag | suite | `cut.slow.test.ts` |
| `release-flow` · `roadmap publish ROADMAP.md` publica en `develop` | ejecución real | commit `docs(roadmap): reservar 0099` en `develop` con solo `ROADMAP.md`, en worktree temporal, rc 0 |
| `release-flow` · `docs/ROADMAP.md` sale con 2 | ejecución real | `el fichero 'docs/ROADMAP.md' no está bajo .docs/sdd/ ni es PRODUCT.md, ROADMAP.md, CHANGELOG.md de la raíz`, rc 2 |
| `release-flow` · `./ROADMAP.md`, cerrojo, base cambiada, destino sucio | suite | `publish.slow.test.ts` |
| `estimation` · log junto a `steering/estimation.md` con filas de `specs/` y `changes/`, aviso del otro `estimation.md` | ejecución real | `aviso: también existe .docs/sdd/estimation.md, que no se lee` · `steering/estimation-log.md` con 2 filas (0079 y 0081), rc 0 |
| `estimation` · `CHANGELOG.md` manda y avisa; sin carpetas, error que dice qué buscó; `sdd merge` regenera en la misma carpeta | suite | `estimation/layout.test.ts`, `fixtures.test.ts`; `registries.ts` usa `estimationLogPath` |
| `feature-ids` · `changes/` y los dos roadmaps → `0086` | ejecución real | `id next` sobre el proyecto de prueba (sin repo propio: omite ramas y lo avisa) → `0086` |
| `feature-ids` · otra rama con solo `ROADMAP.md` y `changes/`; duplicado entre `changes/` y `specs/` | suite | `ids/layout.slow.test.ts` |
| `onboarding` · índice con destinos 3.0.0 y marcas 2.x; `PRODUCT.md` y `operations.md` con sus secciones | suite | `AnchorTemplates.Tests.ps1` |
| `onboarding` · el agente calca `operations-template.md` en `steering/` | ejecución real | humo h1: `.docs/sdd/steering/operations.md` con `## Testing` |

### 4.3 Residuales / deuda generada

- Topes de palabras de `sdd-templates` y del kit suspendidos: los restaura la 0157 (anotado en su fila).
- Los minors diferidos de 3 no pasan a deuda: los recogen la 0152 (coherencia de documentos), la 0156 (plantillas) y la 0157 (topes).

## 5. Aprendizajes

- Un script de Python en un heredoc de Git Bash rompe los escapes del código que escribe (pasó tres veces en esta feature) → `tech-stack.md`, junto al aviso de bash en Windows.
- Que una plantilla nueva conviva con la que sustituye choca con los topes de palabras; retirarla con su consumidor (decisión 11) tiene ese coste → fila de la 0157, que restaura los topes.
- Revisión de skills: abierto `.claude/skills/` (solo `skill-creator`, `writing-for-agents` y `writing-skills`, de desarrollo); esta feature no reveló un patrón nuevo ni desmintió una skill. La única skill del kit editada, `sdd-templates`, pasó su humo.

## 6. Adendas
