---
id: 20261017-143533-feature-0156-sdd-init
feature: 0156
title: Walkthrough — sdd-init, una sola init con lo determinista en `sdd init`
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-17
---

# Walkthrough — `sdd-init`: una sola init, con lo determinista en `sdd init`

## 1. Cambios realizados

- **Verbo `sdd init`** (Task 1, `642d2052`; pasada de fix juntada en el cierre): `cli/src/init/` con `--approved` y `--config`, que registran el progreso de una init en curso en la clave `init` de `sdd-kit.json`, y `--finish`, que escribe `.claude/settings.json` (bloque completo de la 0093, fusión por hoja sin pisar), `.gitignore` y el marcador, este el último, con la versión de `plugin.json`. Valida los tres ficheros antes de escribir ninguno. El README marca su bloque de settings con `<!-- sdd-init: settings -->` y un test lo compara con la constante.
- **Skill `sdd-init`** (Task 2, `2d738fbd`): en inglés, con predicados de entrada (template, init en curso, inicializado, 2.x sin marcador, nueva), dos modos por predicado observable (un template es sin código), una tabla única de entrevista con su columna «With code», §Testing de `operations.md`, los documentos de la 3.0.0 uno a uno tras su «sí», `CLAUDE.md` dentro del gate y la cosecha de cualquier fichero previo de la raíz. `references/structure.md` y `references/generation.md`. Las migraciones pasan a `skills/sdd-init/references/migrations/`, el hook las busca ahí y su aviso pide «ponme el proyecto al día con sdd-init». Batería nueva `tests/batteries/sdd-init/`.
- **Retirada** (Task 3, `bcd4db7b`): `sdd-init-greenfield`, `sdd-init-brownfield` y las plantillas `mission-template.md`, `tech-stack-template.md` y `environments-template.md`; `using-sdd` enruta a `sdd-init` sin `.docs/sdd/` o con una init en curso; README, `CLAUDE.md`, `.docs/workflow/`, `.docs/sdd/` (árbol, glosario, Art. V, tech-stack), `sdd-config`, `sdd-archive`, `sdd-end-release`, `capability-template.md`, las baterías de `using-sdd` y `sdd-grilling` y 16 Pester nombran `sdd-init`.
- **Pasada de fix de la revisión final** (juntada en el cierre): `--config` antes de la primera aprobación guarda en `init.config` (el Critical de los ejes Spec y Arquitectura), los JSON se leen sin BOM, un `sdd-kit.json` que no es objeto no se toca, `isRecord`/`Json` de `cli/src/cli/records.ts` en lugar de duplicados, y el test del hook con una init en curso.
- **Cierre**: delta fusionado en `onboarding`, `capabilities`, `migration`, `routing`, `cli`, `archive` y `feature-ids` (este por un literal viejo que encontró el cierre, enmienda sin cambio de comportamiento); los Propósitos de `onboarding` y `migration` puestos a mano porque `capability merge` no los toca; ADR 0017; changelog; roadmap.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 2,13 h — reloj de la sesión 3,42 h desde 2026-10-17T14:30Z, sin 77 min de espera al dev-lead (4 esperas)
- Desviación: −1,87h (−47 %)
- Causa de la desviación: el plan fijaba firmas, mensajes y tests de la CLI, y la Task 1 salió a la primera; los sujetos corrieron en segundo plano mientras se escribía la skill. Lo que la estimación contó como incertidumbre (el tope de palabras, la retirada en ~40 ficheros) costó menos de lo previsto; la revisión final y su pasada sí se llevaron el tiempo esperado.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan, ejecución Native y cierre)
- Tokens del hilo: 75.696.855 — claude-opus-5-5 75.696.855
- Tokens de subagentes: 11.736.093 en 6 despachos — Review spec 0156 técnica claude-sonnet-5-5 216.963 / 1 min; Revisión final 0156 Código claude-sonnet-5-5 2.189.995 / 5 min; Revisión final 0156 Arquitectura claude-opus-5-5 1.837.741 / 4 min; Revisión final 0156 Spec claude-opus-5-5 6.367.641 / 9 min; Re-revisión 0156 pasada de fix claude-opus-5-5 583.381 / 1 min; Review spec 0156 dominio claude-opus-5-5 540.372 / 2 min
- Coste de la sesión: 32,07 $ (hilo 24,03 $ + subagentes 8,05 $)
- Coste de sujetos: 2,31 $ en 15 sujetos sonnet — RED 0,62 $; GREEN 1,13 $; REFACTOR 0,30 $; enrutado 0,26 $
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet) · hallazgos 20, aceptados 19 y 1 en parte

## 3. Desviaciones del plan

- Las migraciones se movieron en la Task 2 como decía el plan, pero eso obligó a cambiar ya su ruta en 10 Pester, `sdd-archive`, `sdd-end-release`, la batería de `sdd-archive` y `tests/headless/lib.sh` (con la ruta vieja de reserva para los kits de RED), que el plan dejaba para la Task 3.
- El delta de la spec se ajustó al cerrar sin cambiar ningún THEN: REMOVED + ADDED para el requisito renombrado del volcado, `- REMOVED AND` para dos cláusulas reescritas, y un MODIFIED de `feature-ids` (dos líneas en «Enmiendas»).

### Decisiones tomadas sin el dev-lead

- Línea base: Ruling: kit:test 1326 verdes y 1 rojo de tiempo («Conjunto rápido del pre-commit tarda menos del umbral», 88 s) con la suite de la CLI y sujetos corriendo a la vez — carga de la máquina, no código: se repite sola en el gate de cierre — coste si es erróneo: un test lento sin marcar Slow que vería el pre-commit
- Task 1: Ruling: copia RED de verbs.test.ts cambia solo el import de fs (namespace → default) para poder espiar writeFileSync — sin cambio de asserts — coste si es erróneo: ninguno
- Task 1: Ruling: cli:test-slow con carga dio 2 rojos ajenos (merge/hotfix timeout 120 s, roadmap/publish cerrojo); aislados con init.slow, 29/29 verdes — coste si es erróneo: un lento inestable que verá el gate de cierre
- Task 2: Ruling: RED n3-1 no llega a §Testing (pregunta antes ids.mode): ni lo exhibe ni lo refuta; la guidance de §Testing se escribe por la evidencia de campo de la 0097 (cuatro tickets de document-manager) y la mide el GREEN — coste si es erróneo: una fila de la tabla de la entrevista sin RED propio
- Task 2: Ruling: el molde code-progress lleva en init.config todas las claves de sdd-config, para que el GREEN de n2/n3 llegue a operations.md sin las siete preguntas — coste si es erróneo: no se mide la recuperación de una config a medias (la cubre marker.test.ts)
- Task 2: Ruling: REFACTOR de forma en el bullet de CLAUDE.md («A previous CLAUDE.md follows step 2 even when resuming…») — n1 relanzado n=2: 2/2 a discrepancias, CLAUDE.md sin tocar — 13 sujetos, 2,05 $ — coste si es erróneo: ninguno
- Task 2: Ruling: el traslado de migrations/ obliga a cambiar ya su ruta en 10 Pester, sdd-archive, sdd-end-release, la batería de sdd-archive y lib.sh (con la ruta vieja de reserva para kits de RED); los textos de las viejas siguen hasta la Task 3 — coste si es erróneo: ninguno
- Task 3: Ruling: WordBudget tenía las filas viejas con otra sangría; el borrado por regex no las quitó en la Task 2 y la fila de sdd-init quedó con dos espacios: corregido aquí — coste si es erróneo: ninguno
- Task 3: Ruling: cli:test pasa de 968 a 965 por los tests que recorren las plantillas una a una (tres plantillas menos) — coste si es erróneo: ninguno
- Final: Ruling: el gate de cierre repite el rojo de tiempo de «Conjunto rápido del pre-commit» (62 s) como en la línea base, antes de cualquier cambio — no es de la feature — coste si es erróneo: un pre-commit lento que nadie mira
- Cierre: Ruling: los dos lentos ajenos (`merge/hotfix`, `roadmap/publish`) fallan en `cli:test-min` con la suite entera y pasan solos con Node 22.18 (28/28); la rama no toca `cli/src/merge` ni `cli/src/roadmap`: fila «Por triar» en la deuda y no bloquea — coste si es erróneo: un fallo real en el merge del hotfix que se tome por inestable
- Cierre: Ruling: los Propósitos de `onboarding` y `migration` se ponen a mano, porque `capability merge` solo fusiona requisitos y reglas — coste si es erróneo: ninguno

## 4. Verificación

### 4.1 Builds

- Revisión final sobre `bcd4db7b`: Spec opus+high, With fixes (1 Critical, 2 Important, 6 Minor) · Código sonnet+high, With fixes (0/1/9) · Arquitectura opus+high, With fixes (1/1/5); pasada de fix juntada en el cierre con sus tests RED→GREEN; re-revisión de la pasada de fix opus+high, limpia.
- Suite completa sobre la pasada de fix (código igual al del cierre): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `kit:test` 1289/1289 (16 saltados), `cli:typecheck` verde, `cli:test` 970/970, `cli:test-slow` sin cambios desde la pasada anterior (moon lo dio por cacheado), `cli:test-min` 1156/1158 con los dos lentos ajenos de la deuda; esos dos, solos con Node 22.18, 28/28 · ~25 min la pasada entera con la máquina cargada.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-17 · suite 1289 Pester + 970 Vitest + `cli:test-min` (2 ajenos inestables, verdes solos) · smoke por THEN con ejecución real de `sdd init` sobre un directorio temporal y 15 sujetos de batería · revisión final en tres ejes sobre `bcd4db7b` y re-revisión limpia de la pasada de fix

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `onboarding` · una sola init, modo en una línea (sin código / con código) | ejecución real | `n4-1`: «Modo: sin código…» y una pregunta; `n3-1`: «Modo: con código… Si es un template recién instanciado, dímelo» |
| `onboarding` · cada documento tras su aprobación; sin usuario, espera sin escribir | ejecución real | `n1`–`n5`: `git status` limpio en los 13 sujetos de conducta |
| `onboarding` · `CLAUDE.md` pasa por el gate, con la cosecha | ejecución real | GREEN `n1` 2/2 en el gate; REFACTOR `n1` 2/2 con «Las fechas van en UTC» a discrepancias y `CLAUDE.md` sin tocar |
| `onboarding` · init interrumpida se retoma por su registro, sin migrar ni repreguntar | ejecución real | `n2` 2/2: «Aprobados: `PRODUCT.md` y la constitution… No los vuelvo a presentar»; sigue por `operations.md` sin escribirlo |
| `onboarding` · un fichero de la raíz previo no decide | suite + ejecución real | predicado en la skill; `n1` cosecha el `CLAUDE.md` previo con diff |
| `onboarding` · §Testing de `operations.md` | ejecución real | `n2-1`/`n3-1`: suites `npm test` y `npm run e2e`, gates de cierre y merge, duraciones `pendiente` |
| `onboarding` · marcador al final, `channel: plugin`, versión de `plugin.json` | ejecución real | smoke: `--finish` deja `{"version":"2.3.4","channel":"plugin",…}` sin `init` |
| `onboarding` · template: sin código, no toca lo completo, conserva `version` | ejecución real + suite | `n5-1`: «Modo: sin código. Es un template recién instanciado… No tocaré `architecture.md`, `tech-stack.md` ni `environments.md`»; `finish keeps an existing version` |
| `onboarding` · memoria y temporales (bloque de settings completo, `.gitignore`) | ejecución real | smoke: settings con los dos marketplaces `autoUpdate: true` y los dos plugins; `.gitignore` con CRLF y `.auth/` |
| `onboarding` · `autoMemoryEnabled: true` se pregunta; `--memory-off` | suite | `memory-off turns autoMemoryEnabled false` |
| `onboarding` · log de estimación por el script | suite | `sdd estimation log` sin cambios; la skill lo nombra (`MigrationInitParity`) |
| `onboarding` · MODIFIED de entrevista, ramas, calco, claves, frontend, funcional, referencia | suite | Pester de `MigrationInitParity`, `CapabilitiesAtBirth`, `FrontendVerification`, `NativeDefault`, `TaskIds`, `AnchorTemplates` sobre `sdd-init` |
| `onboarding` · `sdd-templates` 3.0.0 sin las tres plantillas | suite | `AnchorTemplates`: «la plantilla que retira la 0156 ya no existe» ×3 |
| `capabilities` · ninguna init crea carpetas vacías; volcado a petición | suite | `CapabilitiesAtBirth` 15/15 |
| `migration` · ruta nueva, aviso del hook con `sdd-init`, sin aviso en curso | suite | `cli/test/hook/` (fixture `pending-migration` y `does not warn with an init in progress`) |
| `migration` · paridad con `cli/src/init/` | suite | `MigrationInitParity` (cazó `extraKnownMarketplaces.superpowers-marketplace` y `roadmap.md` antes de pasar) |
| `routing` · router nombra `sdd-init`; init en curso entra por `sdd-init` | ejecución real | `i1-1` y `i2-1`: primera skill `sdd-kit:sdd-init` |
| `cli` · `--help` lista `init` | suite | `--help lista init` |
| `cli` · registro del progreso, `version` ignorada | ejecución real | smoke: `--config` sin marcador → `{"init":{"config":{"ids":…}}}` y «version: la fija sdd init, se ignora» |
| `cli` · `--finish` escribe los tres, idempotente | ejecución real | smoke: `creado`/`actualizado` y, repetido, `sin cambios` ×3 |
| `cli` · fusión por hoja sin pisar | suite | `leaves a different leaf and notes it`, `notes autoUpdate false and plugin false` |
| `cli` · nada escrito con un fichero no fusionable; usos con 2 | ejecución real | smoke: settings roto → «.claude/settings.json no es JSON válido: no se toca», rc 1; sin acción → rc 2 |
| `archive` · el hotfix busca las migraciones en la ruta nueva | suite | `ArchiveSkill` |

### 4.3 Residuales / deuda generada

- Fila «Por triar»: dos lentos ajenos que fallan con la suite entera y pasan solos, y el rojo de tiempo del conjunto rápido.
- Fila de menores diferidos de la 0156 (tipos y un cast en `cli/src/init/`, `updated` en UTC, `--ignore` con espacio final, «ya está al día» frente al aviso del hook, BOM de `plugin.json`, `v2.0.0.md` con el nombre viejo), a la 0157 o la 0152.
- La skill puente del template del dev-lead (`sdd-project-template`, `/init-template`) pasa a `sdd-init` en su repo, no en el kit.

## 5. Aprendizajes

- **Un fichero escrito no dice si está aprobado** — el registro explícito en `sdd-kit.json` (ADR 0017) lo resuelve donde «escrito = aprobado» fallaba con ficheros previos. Va a la ADR 0017.
- **La paridad migración–init como texto caza huecos reales**: al pasar la fuente a la CLI, el test exigió que la skill nombre literal `extraKnownMarketplaces.superpowers-marketplace` y `roadmap.md`. Sin destino nuevo: ya lo dice `MigrationInitParity` y la regla de Art. V.
- **`-replace` de PowerShell trata `$_` del reemplazo como la entrada entera**, y `[IO.File]::WriteAllText` con `\r\n` mete CRLF en un `.sh`: en este repo, ediciones con `.Replace()` y LF en los scripts de bash. Va a `tech-stack.md`, junto a las notas de PowerShell.

ADR: El progreso de la init vive en `init` de `sdd-kit.json`, y `--finish` lo quita → decisions/0017-init-progress-in-the-marker.md

Revisión de skills: `.claude/skills/` de este repo no existe; las skills del kit tocadas son las de esta feature, ya medidas por su batería.
