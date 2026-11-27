---
id: 20261127-120333-feature-0374-estimation-report
feature: 0374
title: Walkthrough — sdd estimation report
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-27
---

# Walkthrough — sdd estimation report

## 1. Cambios realizados

- **Tablas y verbo** (`cef48c5`): `cli/src/estimation/report.ts` y `estimationReportVerb` en `cli/src/estimation/verbs.ts`. `sdd estimation report [--root|--project-root] [--release]` lee las mismas filas que el log (`readRows`, `resolveDocsPath`) y saca cuatro tablas en Markdown: persona, carril y versión marcada del kit (n, mediana del real, mediana del ratio, `Real > est`), y fase × persona, con la mediana de agente + ejecución y su ratio, desde los `timing.json` que admite «Tiempos por fase» (`readTiming`, exportada). Con n < 5, `*` y la nota de mediana orientativa.
- **Persona, versión y `--release`** (`03d1153`): `cli/src/estimation/authors.ts`. Un `git log --no-renames --diff-filter=AM` da el commit más antiguo de cada `<carpeta>/<fichero>`, en `specs/` o en `changes/`. Si es de migración (`chore(sdd): migrar al kit`), el cierre sale `sin atribuir`. La versión marcada sale de un solo `git cat-file --batch` sobre `sdd-kit.json` en ese commit. `releaseIndex` se extrae de `releaseTable` (`releases.ts`) sin cambiar la salida del log, y `--release` filtra con ella.
- **La retro pega el informe** (`b0c7880`): paso 4 de `sdd-retro` y «Estimación y action items» de `retro-template.md`. Sale la línea «Agregado de la release», que se calculaba a mano. Batería de `sdd-retro`: escenario `r7` (molde `corte-estimacion`) y fila `R10`.
- Sobre este mismo repo, el verbo atribuye los 335 cierres en ~2 s, y la tabla por versión marcada va de la 0.6.0 a la 3.0.5.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 1,14 h — reloj de la sesión 1,34 h desde 2026-11-27T11:55Z, sin 12 min de espera al dev-lead (6 esperas)
- Desviación: −1,36 h (−54 %)
- Causa de la desviación: «Esperas y huecos: 11:57Z 0 min; 11:58Z 0 min; 11:58Z 1 min; 11:59Z 4 min; 12:08Z 6 min; 12:25Z 1 min»: 12 min fuera. El resto es sobreestimación: los sujetos y los revisores corrieron en segundo plano y en paralelo, mientras el hilo escribía, como ya avisa `estimation.md` (tercer aviso).
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 61.310.290 — claude-opus-5-5 61.310.290
- Tokens de subagentes: 6.774.310 en 7 despachos — Final review — Code axis claude-sonnet-5-5 482.182 / 1 min; Final review — Architecture axis claude-opus-5-5 1.158.599 / 3 min; Final review — Spec axis claude-opus-5-5 2.586.867 / 4 min; Segunda ronda spec 0374 claude-sonnet-5-5 360.193 / 2 min; Review spec 0374 dominio claude-sonnet-5-5 166.332 / 2 min; Re-review final 0374 fix pass claude-opus-5-5 1.801.793 / 4 min; Review spec 0374 técnica claude-sonnet-5-5 218.344 / 1 min
- Coste de la sesión: 24,78 $ (hilo 19,33 $ + subagentes 5,45 $)
- Coste de sujetos: 1,58 $ en 7 sujetos sonnet — red-molde-roto 0,16 $; red2 0,25 $; green 0,48 $; green-control 0,44 $; final 0,24 $
- Review de spec: 2 revisores y segunda ronda de 1 · hallazgos 30, aceptados 25

## 3. Desviaciones del plan

- _Ninguna_ de la spec. Del plan:
  - La plantilla de la retro gana 9 palabras en vez de quedar igual: `sdd-templates` queda en 17722 de 18000.
  - La línea `Sin informe:` vive en el bloque de ayuda de la plantilla, como fijó la decisión 20 de la spec.
  - Pasada de la revisión final (juntada en el cierre):
    - Se cambió una aserción del RED: en `no closings` y `release without closings`, «Sin cierres» pasa de 3 a 4, y sin cierres la tabla de fases ya no dice «Sin datos». El RED contradecía la decisión 15 de la spec («cada tabla se sustituye por `Sin cierres.`»).
    - La fila R10 de la decisión 22 queda en dos filas: R10, de máquina, con la cabecera del informe, y R11, en prosa, con las cuentas a mano.
  - El recorrido de commits de `releases.ts` pasa de `--diff-filter=A` a `AM`, compartido con la atribución. El commit más antiguo de un fichero es siempre su `A`, así que la salida del log no cambia, y sus tests siguen sin editarse.

### Decisiones tomadas sin el dev-lead

- La nota `* n < 5` va tras una línea en blanco, y `tableOf` del test la incluye. En GFM, una línea pegada a la tabla es otra fila. Las aserciones no cambian. Coste si está mal: solo el render.
- Dos tests del Review Focus (`accepts a leading v in --release`, `missing marker in a commit is sin marcador`) pasaban ya en el RED porque aún no había filtro ni atribución. Se quedan como guardas del comportamiento nuevo. Coste si está mal: dos tests que no discriminan.
- El primer RED de `r7` se descartó por un molde roto: el walkthrough de la 0040 no decía «Exportar salas a CSV» y el sujeto paró por evidencia incoherente. Se corrigió el molde y se relanzó el RED (`red-molde-roto/`). Coste: 0,16 $.
- El paquete de la revisión final excluye `dist/**`, la copia del build que vigila `dist.test.ts`. Coste si está mal: un defecto solo de `dist/` sin revisar.
- Rulings de la revisión final, cada uno con su coste en el ledger y aceptados en la re-revisión:
  - `resolveDocsPath` sigue en `log.ts`.
  - No hay fila del verbo en la tabla CLI de `sdd-templates`, por la decisión 21.
  - La selección por release llama a git dentro de `report.ts`.
  - Con `--release` el historial se recorre dos veces.
  - La Review Focus 2 queda a medias: un walkthrough sin bloque de tiempo junto a un `patch.md`.
  - Los límites de squash, rebase, BOM, `\r\n`, `|` en nombres y cierre sin commitear.
- Dos Minor nuevos de la re-revisión quedan con ruling: el `describe` que nombra el proceso y el doble espacio del mensaje de `--release ""`.

## 4. Verificación

### 4.1 Builds

- Línea base, sin `--affected` en una rama recién abierta: `moon run cli:typecheck cli:test kit:test-headless` → cli:typecheck: corrió · cli:test: corrió 2614/2629 (15 skipped) · kit:test-headless: corrió 817/817 · 4 min 03 s · sobre `53abb5f`.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 820/820 · cli:typecheck: corrió (tsc sin errores) · cli:test: corrió 2624/2639 (15 skipped) · 2 min 38 s · sobre `b0c7880`.
- Tras la pasada de la revisión final: `moon run cli:typecheck cli:test kit:test-headless` → cli:typecheck: corrió · cli:test: corrió 2631/2646 (15 skipped) · kit:test-headless: corrió 820/820 · 3 min 52 s · sobre la pasada, juntada en el cierre. Los lentos de la feature: `pnpm exec vitest run test/estimation test/cli.test.ts test/kit/migration-subject.test.ts --test-timeout 120000` → 164/164.
- Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura opus+high, con arreglos, sobre `b0c7880`. Pasada de fix juntada en el cierre. Re-revisión `b0c7880..` el cierre, sdd-kit:effort-high + opus, limpia.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-27 · gate 820/820 + 2631/2646 · smoke 7/7 THEN, el de la retro con ejecución real de sujetos (r7 RED 0/1, GREEN 2/2, final 1/1; controles r4 y r6 1/1) · guion de la CLI recorrido con ejecución real sobre este repo · revisión final de Spec, Código y Arquitectura sobre `b0c7880`, re-revisión limpia, 0 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Atribuye cada cierre a quien lo escribió, no a quien migró | suite: `attributes 2.x closings to their writers, not to the migrator` | ok |
| Versión marcada del kit de cada cierre, por SemVer | suite: `marks the kit version…`, `sorts kit versions by SemVer`, `a commit without marker…`; ejecución real: 14 versiones de la 0.6.0 a la 3.0.5 sobre este repo | ok |
| Agrega por persona, carril y versión, con n < 5 y sin cierres | suite: `groups by lane…`, `five closings…`, `no closings`, `no git warns once` | ok |
| Fases por persona | suite: `phases by person` (0,17 / 1,25 / 1,75 y el aviso fuera de margen) | ok |
| `--release` filtra, avisa y falla con versión desconocida o sin changelog | suite: `--release keeps only…`, `unknown release and missing changelog fail`, `release without closings`, `warns about a shadowed changelog…`; ejecución real: `--release v3.0.4` (4 cierres, aviso de 1 fuera) y `--release 9.9.9` (código 1) | ok |
| `--help` lista `estimation log\|report`; `--project-root` vale y excluye `--root` | suite: `cli.test.ts`; ejecución real: `--help` y `--root` + `--project-root` (código 2) | ok |
| La retro pega el informe de la release | ejecución real: batería `sdd-retro` `r7`, GREEN 2/2 y final 1/1 (R10 y R11); RED con la skill vigente 0/1 | ok |

### 4.3 Residuales / deuda generada

- La campaña de sujetos costó 1,58 $ en 7 sujetos frente a los 1,32 $ previstos (+0,26 $): 0,16 $ del primer RED con el molde roto, y el resto, de sujetos algo más caros que la media de la batería. No quedaba ninguna tanda por lanzar.
- El tope de 700 palabras en «Reglas» de `project-retro` no cuadra con los 622 de `word-budget.test.ts`. Queda fuera de esta feature, como dice la spec.

## 5. Aprendizajes

- La persona de un cierre es el autor del commit más antiguo de su artefacto, con `--no-renames` y la clave `<carpeta>/<fichero>`; un commit de migración no atribuye → `capabilities/estimation.md` (delta fusionado) y `cli/test/kit/migration-subject.test.ts`, que ata el asunto a `sdd-upgrade`.
- Un molde de batería que reescribe un fichero del molde base parte del literal ya transformado del base, o el sujeto para por evidencia incoherente (primer RED de `r7`) → `tests/batteries/sdd-retro/subject.mjs` (`EXPORT_WALKTHROUGH` y `s.die` si falta el ancla).
- Una nota pegada a una tabla Markdown es otra fila en GFM: va tras una línea en blanco → código de `report.ts`.

Retro: error que cazaría un chequeo → ticket del kit: `heredoc-guard.mjs` solo mira heredocs y no ve un `node -e` entre comillas dobles de Git Bash, que perdió `\` y comillas invertidas dos veces en esta sesión pese a la regla de `operations.md:26` (tercer caso, tras la 0220 y la 0227)
