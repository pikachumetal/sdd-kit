---
id: 20261101-150956-feature-0116-session-start-and-resume
feature: 0116
title: Walkthrough — Arranque de sesión sin el kit y puerta para retomar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Arranque de sesión sin el kit y puerta para retomar

## 1. Cambios realizados

- **Aviso** (0f3f8509): el hook del plugin escribe una marca por sesión, también al reanudar, sin inyectar nada en ese caso; `hooks/project/sdd-kit-loaded.mjs` la mira en `UserPromptSubmit` y, sin ella, avisa una vez con la ruta de la versión declarada.
- **Instalación** (8f6a9969): `sdd init --finish` y `sdd upgrade --project-hook`, este desde la migración v3.0.0.
- **Puerta de retomar** (3a111ffa): fila de `using-sdd`, `description` de `sdd-implement` y `sdd-propose`, reglas de entrada en `sdd-implement` y `patch-flow.md`, y escenarios `rf1`, `rf2`, `rp1` y `rf3`.
- **Fuera de alcance**: el recorte con A/B de `using-sdd`: 524 palabras contra 570, la fila caducó.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,02 h — reloj de la sesión 1,54 h desde 2026-11-01T15:06Z, sin 32 min de espera al dev-lead (3 esperas)
- Desviación: -1,98 h (-66 %)
- Causa de la desviación: la estimación contaba las baterías como trabajo del hilo, y corren solas en segundo plano; el sondeo previo a la spec ya había fijado el diseño. El recuento es del tramo hasta la re-revisión; el cierre añade poco.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 27.243.125 — claude-opus-5-5 27.243.125
- Tokens de subagentes: 3.137.229 en 4 despachos — Final review — Code axis claude-sonnet-5-5 596.977 / 1 min; Final review — Spec axis claude-opus-5-5 1.060.808 / 5 min; Final review — Architecture axis claude-opus-5-5 810.901 / 4 min; Re-review final fix range claude-opus-5-5 668.543 / 3 min
- Coste de la sesión: 16,54 $ (hilo 12,19 $ + subagentes 4,34 $)
- Coste de sujetos: 10,69 $ en 50 sujetos Sonnet — red 2,04 $; red2 0,83 $; green 2,06 $; green-entera 5,39 $; fix 0,37 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Enmienda aprobada por el dev-lead (2026-11-01): delta de `cli`, línea de la migración en «Dónde se prueba» y uid en la ruta de la marca.
- `installProjectHook(root)` sin `pluginRoot`, y `--finish` integra el hook en sus escrituras en lugar de llamar a la función: el marcador tiene que ir el último.
- `cli/src/init/json-file.ts` no estaba en el plan: sale de la revisión final, por duplicación.
- `sdd-init` y `architecture.md` no estaban en el Scope: los pide la revisión final para que no queden falsos; el saldo de `sdd-init` no sube.

### Decisiones tomadas sin el dev-lead

- Test existente «exits 0 and writes nothing…» con entrada inyectada — `readFileSync(0)` bloquea el worker de Vitest — lanzar el verbo a mano en una terminal espera EOF.
- Tests del hook en proceso, y uno con spawn en `*.slow` — `tech-stack.md` manda ahí lo que lanza procesos — ninguno.
- Sin plugin no corre `session-end`, y queda un `.warned` vacío en el temporal — limpiarlo pediría otro hook de proyecto — ficheros de 0 bytes.
- `rp1` pasa al paso `retomar-patch` para relanzar solo ese escenario — ninguno.
- Salen la fila «No Playwright MCP…» de `sdd-implement`, la de `.docs/sdd/patches/` de `patch-flow.md` y «Pressure doesn't change the process.» de `sdd-propose` — repiten texto vivo, y el saldo no podía subir; sin sujeto propio — reponerlas.
- Al reanudar se sale antes de reparar el tmp de Git Bash — el matcher anterior tampoco corría ahí — la reparación espera a la siguiente sesión nueva.
- «No se cuelga sin stdin» solo se prueba con entrada ilegible — Claude Code siempre da stdin con EOF — ver la primera.
- Un plugin anterior a esta feature en un proyecto migrado dice que no hay skills sin ser cierto — transitorio, y el remedio vale — un aviso impreciso.
- `upgrade` importa de `init` — `init` es dueña de settings — un acoplamiento leve.
- El hook arranca node en cada mensaje, ~66 ms en Windows — es el coste de detectar en `UserPromptSubmit` — 66 ms por mensaje.
- `--project-hook` no exige `.docs/sdd/` y pisa una copia editada — la copia es del kit — un fichero de más.
- Una purga del temporal con la sesión viva, o una reanudación en dos terminales, pueden dar un aviso de más — muy raro — un aviso falso.
- `sdd-init` editada sin sujeto — solo nombra un fichero más — ninguno de conducta.
- Seis fixes sin RED (`existsSync`, ruta literal, duplicación, `try` de `session-end`, documentos, mediciones) — la conducta no cambia o se mide con sujetos — los miró la re-revisión.
- sin revisar: el commit tras la re-revisión, juntado en el cierre — script antes que la entrada, escritura compartida entre `init` y `upgrade`, tests de la salida de `--project-hook` y del sufijo `.warned`, «without asking» de vuelta en `sdd-init`.

## 4. Verificación

### 4.1 Builds

- Tests de las superficies: `npx vitest run test/hook test/init test/upgrade test/kit --test-timeout 120000` → 609 pasan, 11 saltados; `moon run cli:typecheck` → verde.
- Línea base en worktree desanclado: `moon run kit:test-headless cli:typecheck cli:test` → tres tareas completadas, `kit:test-headless` 285/285.
- Gate: corre una vez en el merge de sincronización del paso 6, porque la base va por delante y hay otras ramas abiertas; su línea y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · tests de superficie 609 pasan · smoke real del hook: sin plugin avisa con ruta; con plugin, sin aviso en inicio, `--resume` y `--continue` · batería `using-sdd` 27 escenarios en verde, `d1` leído a mano · revisión final Spec, Código y Arquitectura sobre 3a111ffa, con fixes, y re-revisión con 3 abiertos, arreglados después · 1 sin revisar (el commit tras la re-revisión)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Sin plugin, aviso con la ruta de 3.0.0 | ejecución real | sale |
| Segundo mensaje sin aviso | suite | `warns once per session` |
| Carpeta ausente: «no está en la caché» | suite | pasa |
| Sin `version`, sin ruta; sin `.docs/sdd/`, nada | suite | pasan |
| Con plugin, `--plugin-dir` o al reanudar, nada | ejecución real | 3/3 sin aviso; `/clear`, no probado |
| Si falla, sale con 0 y no escribe | ejecución real | `project-hook.slow.test.ts`, proceso real |
| «Retoma la feature.» / «Sigue con la Task 2.» por `sdd-implement` | ejecución real | `rf1` y `rf2`, 4/4 |
| No crea carpeta ni rama, no repite, mira la base | ejecución real | leído a mano, 4/4 |
| Patch: primer paso sin salida, sin otro `patch.md` | ejecución real | `rp1`, 2/2 |
| Sin spec ni `patch.md`, a `sdd-propose` | ejecución real | `rf3` 2/2: paran y lo recomiendan, sin invocarla |
| Init deja el hook, una vez, sin tocar otras entradas | suite | `installs…`, `keeps…`, `does not duplicate…` |
| Migración deja el hook | suite | `--project-hook`; el paso de la migración, leído, sin ejecutar |
| `--project-hook`: salida, repetición y `--mark` | suite | `prints one line per file`, `rejects…` |

### 4.3 Residuales / deuda generada

- `/clear` sin medir: su SessionStart marca igual.
- Comportamiento del hook en Linux y macOS sin ejecutar en real; lo cubre la CI en lo que corre la suite.
- Causa del ticket 6300 sin reproducir: si fue un retraso de carga con el hook ya ejecutado, el aviso no saltaría.

## 5. Aprendizajes

- Un hook de plugin no ve las skills ni corre sin el plugin; solo un hook del proyecto puede avisar → `tech-stack.md`, «Hook de sesión».
- Un kit por `--plugin-dir` sin superpowers no carga, y los hooks no corren → `tech-stack.md`, smoke de un cambio del hook.
- `readFileSync(0)` en proceso bloquea el worker de Vitest: la entrada se inyecta → `tech-stack.md`, «Un hook de sesión no se cae…».
- La ruta de la marca es un contrato con copias congeladas → `architecture.md` y ADR.
- ADR: el aviso de kit no cargado vive en un hook copiado al proyecto → decisions/0021-project-hook-for-unloaded-kit.md
- Revisión de skills: abierto `.claude/` del repo; no hay skills de proyecto y nada que actualizar allí.

## 6. Adendas
