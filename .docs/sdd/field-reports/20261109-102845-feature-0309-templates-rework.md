---
kit_version: 2.3.4
lane: feature
id: 20261109-102845-feature-0309-templates-rework
task: 0309
mode: full
date: 2026-11-09
---

# Ticket para el kit — feature 0309: `sdd-templates` con una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del kit (plugin de Claude Code, skills en Markdown y una CLI en Node), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-opus-5-5 (eje Spec, re-revisión, dos revisiones pedidas por el dev-lead), claude-sonnet-5-5 (revisores de la spec, eje Código, sujetos)
- Coste en reloj: 2,27 h frente a 2,5 h estimadas
- Coste en tokens: hilo 74.870.437; subagentes 13.013.189 en 7 despachos; sesión 36,17 $; sujetos 13,69 $ en 16 (previsión enmendada: 14 $)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec aprobada pedía la misma regla en dos sitios, y el repaso de coherencia no lo vio

- **Qué pasó**: la decisión 2 y el AND de `delegate` del `MODIFIED` pedían el porqué del enfoque elegido en el Approach y otra vez en el ✋. El GREEN dio PB 0/2: los sujetos lo ponían en el Approach y en el ✋ solo nombraban el enfoque. Hizo falta una revisión en Opus del GREEN, una parada del dev-lead (enmienda: el porqué solo en el Approach), subir la previsión de 11,88 a 14 $ y una tanda de REFACTOR.
- **Fuente**: `spec.md` de la feature, «Enmiendas», línea del 2026-11-09 (decisión 2); `tests/sdd-templates-0309-green.md`, tablas GREEN y REFACTOR; `sdd session tokens` → «Revisión Opus del GREEN 0309 claude-opus-5-5 1.058.345».
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md` (el repaso antes de la review y del gate).
- **Por qué el kit no lo evitó**: el repaso compara literales, lo retirado y los casos reales con sus THEN, pero no contrasta un THEN o un AND nuevo con la ADR 0022 («una forma por regla, en un solo sitio»). Los dos revisores de la spec tampoco lo marcaron.
- **Coste**: REFACTOR 4,39 $ + revisión Opus ~1,06 M tokens + una parada (respaldo: `spec.md`, «Enmiendas»; `tests/sdd-templates-0309-green.md`).
- **Propuesta**: en el repaso de coherencia, un punto: «cada AND o THEN que manda escribir algo en dos secciones de un artefacto: ¿es la misma regla dicha dos veces? Si sí, una de las dos solo nombra».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec con un AND «el porqué va al Approach y al ✋» WHEN el agente hace el repaso de coherencia THEN lo señala antes del gate.

### 2. El Intent prometía «ninguna regla en dos formas» y nadie barrió la skill antes del gate

- **Qué pasó**: la tabla de hallazgos de la spec (P10-P20, de una auditoría previa) se tomó como el universo. En la revisión final, el eje Spec encontró la regla de reparto en tres formas más, P16 en otra plantilla y el slug kebab-case en una cuarta. La re-revisión encontró una forma más, y una revisión Opus que pidió el dev-lead, otra regla (`- REMOVED`). Fueron dos enmiendas y dos paradas del dev-lead (Tasks 3 y 4).
- **Fuente**: `spec.md`, «Enmiendas» (las dos de la revisión final); `tasks.md`, Tasks 3 y 4; `sdd session tokens` → «Revisión Opus de la enmienda 0309 claude-opus-5-5 4.395.348».
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md`; `skills/sdd-propose/references/spec-writing.md` (el Intent medible).
- **Por qué el kit no lo evitó**: ningún paso pide comprobar, antes del gate, una propiedad que el Intent afirma sobre un conjunto («ninguna regla de la skill…») contra el conjunto entero. Solo se comprueba contra la tabla que trae la spec.
- **Coste**: dos paradas, dos enmiendas y ~6,5 M tokens de revisiones (respaldo: `tasks.md`, «Revisión final», «Re-revisión» y las líneas siguientes).
- **Propuesta**: cuando el Intent afirma una propiedad sobre un conjunto (todas las plantillas, todos los comandos), el repaso de coherencia barre el conjunto (`git grep` de las palabras clave de cada regla) y deja en la spec qué barrió.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuyo Intent dice «ninguna regla de `<skill>` en dos formas» WHEN el agente hace el repaso THEN la spec lista el barrido y las formas que encontró fuera de su tabla, o «ninguna».

### 3. Un `String.replace` con `` $` `` corrompió la batería y una campaña corrió con ella

- **Qué pasó**: para editar una fila de `battery.md`, el hilo usó `node -e` con `s.replace(a, b)`. El reemplazo llevaba `` <x> $` de `` y JavaScript lo tomó como «el texto anterior al hallazgo»: metió una copia de la tabla de escenarios y de la rúbrica dentro de la fila CO4. El REFACTOR (4 sujetos) y los controles (2) corrieron con esa batería. Los sujetos no la leen, pero el veredicto dejó de listar la fila L. Lo detectó `kit:test-headless` (`battery.test.ts`, ws3: `Expected: "… sin leer: WS, L"`, `Received: "… sin leer: WS"`), después de las dos tandas.
- **Fuente**: ledger de la sesión copiado en `tasks.md`, «Rulings», «Task 1: Ruling: el node replace…»; salida de `moon run kit:test-headless` en Git Bash.
- **Dónde en el kit**: `tests/headless/battery.mjs` (`run` no valida la batería antes de lanzar).
- **Por qué el kit no lo evitó**: `battery.mjs run` lee la tabla y lanza sin mirar si hay ids de escenario o filas de rúbrica repetidas.
- **Coste**: L sin veredicto en 6 sujetos (2,7 $ de tandas que siguieron siendo válidas), su lectura a mano y el diagnóstico (~15 min); causa respaldada en `tasks.md`, «Rulings».
- **Propuesta**: `battery.mjs run` se niega a lanzar si la tabla de escenarios tiene ids repetidos o la rúbrica tiene filas con el mismo nombre, y dice cuáles.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un `battery.md` con el escenario `co4` dos veces WHEN corre `battery.mjs run` THEN sale con 1 y «escenario repetido: co4», sin lanzar ningún sujeto.

### 4. `COST_CAP` por tanda en vez de por campaña: dos tandas salieron con 0 y «sin evidencia»

- **Qué pasó**: con 5,43 $ ya gastados en la campaña, lancé el REFACTOR con `COST_CAP=5`: ningún sujeto corrió, y la salida fue `co4 · 0/2 · … · sin evidencia` con exit 0. Después, el humo con `COST_CAP=12.5` (11,20 $ gastados, 0,78 $ reservados por sujeto) corrió `a2` y no `t3`.
- **Fuente**: `.temp/sdd/watch/20261109-085151-65252.log` → «techo de 5 $ alcanzado (5.43 $ gastados…)»; `tech-stack.md:208` («`COST_CAP`, el de la previsión»).
- **Dónde en el kit**: `tests/headless/battery.mjs` (techo) y `tech-stack.md`, «Baterías por skill».
- **Por qué el kit no lo evitó**: la regla existía (`COST_CAP` es el de la previsión, la campaña entera) y no la apliqué; el lanzador sale con 0 en vez de negarse antes de lanzar.
- **Coste**: dos relanzamientos, sin coste de sujetos (~5 min).
- **Propuesta**: la que ya trae el patch 0321 del roadmap («el techo antes de la tanda»): negarse antes de lanzar y decir el techo que haría falta para la tanda pedida.
- **Verificada**: sí — contrastado con la fila 0321 de `.docs/sdd/roadmap.md`.
- **Criterio de aceptación**: GIVEN una campaña con 5,43 $ gastados WHEN corre `COST_CAP=5 battery.mjs run` con 4 sujetos THEN sale con 1 y «techo insuficiente: hacen falta ~8,6 $», sin sujetos.

### 5. Tras compactar con dos tasks pendientes en Native, seguí en Native

- **Qué pasó**: la sesión compactó durante la Task 1, con las dos tasks sin su línea `complete`. `sdd-implement` pide seguir con SDD (`sdd-implement-subagent`) y dejar `Task <N>: Ruling: compactación — sigo con SDD`. Seguí en Native sin la línea; lo vi al rellenar «Compactación» del walkthrough.
- **Fuente**: `skills/sdd-implement/SKILL.md`, «Method» («After a compaction in Native with two or more tasks without their `complete` line…»); `walkthrough.md` de la feature, «Compactación».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Method».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Tras compactar se relee el plan y el ledger, no la skill, y ninguno de los dos recuerda la regla.
- **Coste**: no medido (el contexto aguantó); el riesgo es el que la regla evita.
- **Propuesta**: que `sdd task start` (o el resumen de reanudación del ledger), con dos o más tasks sin `complete` y sin línea `Ruling: compactación`, imprima el recordatorio.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un ledger con dos tasks pendientes y una sesión compactada WHEN el hilo corre `sdd task start` THEN la salida recuerda la regla de compactación.

## Lo que hice por iniciativa propia

- Antes de gastar en el REFACTOR, releí los cuatro sujetos del GREEN guardados con las filas nuevas: confirmó qué fallaba y a qué apuntar, sin gastar en sujetos. Funcionó.
- Antes de endurecer la regex de CO4-T, la contrasté con los 7 `tools.txt` de `co4` guardados: ningún registro anterior cambió de color.

## Funcionó, no tocar

- Los ejes de la revisión final en paralelo: el eje Spec encontró lo que la spec prometía y no cumplía (hallazgo 2), y la re-revisión vio que una pasada de fix quitaba una frase medida de donde la lee el cierre.
- `sdd merge --sync` y `--verified-at` con otras dos ramas abiertas: la base entró sin conflicto y el gate corrió una sola vez.
- La validación en campo con una fila por THEN, cada una con su evidencia, incluidos los `no probado`.

## Menores

- La «Verificación» del plan nombraba `npx vitest`, que en Git Bash da `MODULE_NOT_FOUND`; corrí `pnpm exec vitest` desde `cli/` — `skills/sdd-propose/references/plan-writing.md`.
- La «Verificación» de la Task 1 incluía `kit:own` y `kit:copies`, que salen con 1 ya en la base, así que `sdd task done` no podía correrlos — `skills/sdd-propose/references/plan-writing.md`.
- El plan no nombraba `moon run kit:notices` tras cambiar `upstream.json`; lo paró el pre-commit (`notices.test.ts`) — no localizado.
- La fila Suma de la previsión («16 sujetos, ~50 min…») no la leía `campaign.mjs`; la plantilla de esta feature ya pide `<n> sujetos` — `skills/sdd-templates/templates/spec-template.md`.
- En la medición final, un sujeto escribió en inglés un aviso de fase («Ahora: dispatching the single spec reviewer…»), y la fila L falló 1/2 — no localizado.
- Timeouts pasajeros de tests `*.slow.test.ts` y un `unable to migrate temporary objects` de git en una pasada de `kit:test-headless`, que no se repitieron — no localizado.
