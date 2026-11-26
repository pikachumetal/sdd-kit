---
id: 20261126-161357-feature-0371-spike-close-writes-rows
feature: 0371
title: Walkthrough — El cierre de un spike escribe las filas que su research.md §5 propone, y su fila las nombra
spec: ./spec.md
status: done
created: 2026-11-26
---

# Walkthrough — El cierre de un spike escribe las filas que su research.md §5 propone, y su fila las nombra

## 1. Cambios realizados

- **Regla del cierre**: `skills/sdd-archive/references/records.md` §Roadmap gana la viñeta de `mode: spike`: cada línea `→` de `research.md` §5 abre su fila `⏳` en Now con su brief, con ids según «Ids» de `sdd-roadmap`, en el commit de cierre; el «Externo» del spike pasa a cada una de esas filas y su «Estado» queda `✅ → <ids>` (o `🧪 … → <ids>`). La primera viñeta de §Roadmap pasa de 55 a 30 palabras, porque repetía lo que dice `SKILL.md`, y la del `roadmap check` pierde su «After editing and before the closing commit», que ya dice el paso 4.
- **`sdd-archive/SKILL.md`**: «the change's own row only changes its «Estado» cell» admite «(a spike's, also «Externo»)».
- **Plantilla**: `research-template.md` §5 pierde la línea de ayuda «Un arreglo que la medida deja a la vista va aquí, con su fila…»; el hueco `<cambio> → <fila del roadmap por abrir> | nada` se queda.
- **Batería** de `sdd-archive`: escenario `sp1`, molde `reservas-spike-rows` (función `spikeRows0030` en `subject.mjs`, sobre el spike 0030 que ya montaba `reservas-spike`), rúbrica SP1-SP4 y su fila de procedencia. Evidencia en `tests/sdd-archive-0371.md`.
- Palabras de `dist/skills/sdd-archive/` + `dist/skills/sdd-templates/`: 25.794 → 25.793.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,16 h — reloj de la sesión 4,72 h desde 2026-11-26T15:56Z, sin 214 min de espera al dev-lead (5 esperas)
- Desviación: −1,84 h (−61 %)
- Causa de la desviación: las esperas descontadas (15:59Z 1 min; 16:00Z 13 min; 16:26Z 1 min; 17:09Z 31 min; 17:45Z 168 min) incluyen las tandas de sujetos, que corrieron mientras el hilo esperaba; el texto de la regla fue una viñeta
- Compactación: sí, tras la pasada de fix (ningún task pendiente: siguió Native)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 47.337.635 — claude-opus-5-5 47.337.635
- Tokens de subagentes: 2.797.071 en 5 despachos — Segunda ronda de review de la 0371 claude-sonnet-5-5 246.498 / 1 min; Re-revisión 0371 fix pass claude-opus-5-5 558.559 / 1 min; Final review — Code axis claude-sonnet-5-5 484.025 / 1 min; Final review — Spec axis claude-opus-5-5 1.262.153 / 3 min; Review adversarial de la spec 0371 claude-sonnet-5-5 245.836 / 1 min
- Coste de la sesión: 19,05 $ (hilo 16,19 $ + subagentes 2,86 $)
- Coste de sujetos: 5,15 $ en 12 sujetos sonnet — red 0,81 $; controls 0,95 $; green 0,84 $; refactor 0,92 $; fix 0,83 $; fix2 0,79 $
- Review de spec: 1 revisor (técnica) y segunda ronda · hallazgos 20, aceptados 15

## 3. Desviaciones del plan

- Enmienda del 2026-11-26, aprobada por el dev-lead («1»): la previsión de coste pasa de 10 a 12 sujetos y de 4,35 $ a 5,22 $, por una tanda extra de `sp1` tras la pasada de fix.
- Cierre con SP3 en 1/2 tras la tanda extra, decidido por el dev-lead («1»): un sujeto copia «Externo» en vez de moverlo; va a deuda.
- La viñeta cambió de redacción en el REFACTOR y en la pasada de fix (rulings abajo).

### Decisiones tomadas sin el dev-lead

- GREEN 1: los dos sujetos ponían `→ 0031, 0032` en «Tarea» y uno dejaba `#412` en la 0030; la viñeta nombra la celda y su valor literal («its «Estado» cell becomes `✅ → <ids>`») y el movimiento de «Externo» — fallo de forma (Art. II) de «the spike's row ends in» — coste si está mal: otra tanda de REFACTOR.
- Gate: `molds.test.ts` > `vf6` rojo una vez bajo carga («no es su propio repo git … `C:/Program Files/MacType`»); solo pasa 3/3 y la repetición entera 817/817; la rama no toca ese molde — intermitente, a «Por triar» — coste si está mal: un rojo real que vería la CI de la rama.
- Revisión final, eje Spec I2: `✅ → <ids>` no está en el «conjunto cerrado» de estados de `control-profiles` ni de `now-next-later-template.md`; se queda: el estado sigue siendo `✅` con un puntero, como `🧪 validación diferida a <disparador>` lleva el suyo, y `roadmap check` compara por prefijo; cambiarlo es un `MODIFIED` que la spec aprobada no lleva — coste si está mal: un agente de `sdd-roadmap` «normaliza» la fila y borra los ids.
- Revisión final, eje Código M4: la ayuda de §5 de `research-template.md` sale, como dice la decisión 8; el hueco `→ <fila del roadmap por abrir>` sigue — coste si está mal: un spike que olvida nombrar sus arreglos en §5.
- Revisión final, eje Código I1 bajado a Minor (`- X → nada`): la plantilla da la línea o `nada`, no las dos, y la viñeta dice «each `→` line» — coste si está mal: una fila vacía en un §5 mal escrito.
- Revisión final, eje Spec: la decisión 9 ya no es literal tras los rulings; los recoge este walkthrough, sin enmienda — coste si está mal: ninguno.
- Declinados de la revisión final (comentario del molde, falso positivo de citas; `**Toca:** —` y «Tamaño» a juicio, decisión 3; validar más tarde un `🧪 … → ids`, otra skill; reentrada y fila ya existente, «No entra») — coste si está mal: un caso de campo los reabre.
- Pasada de fix: la primera redacción («… the spike's «Externo» becomes `—`») hizo perder `#412` a los dos sujetos (SP3 0/2); vuelve «moves to each of those rows» — coste si está mal: el SP3 1/2 que queda en deuda.
- Re-revisión, M3: «Externo» de la fila del spike no queda en `—` en 1 de 2; lo decidió el dev-lead («1») y va a «Por triar» — coste si está mal: el ticket del tracker sigue colgado de una fila `✅`, ahora junto a las nuevas.
- Re-revisión, M5: las líneas de tanda de la evidencia no se podían contrastar; se reescriben con las de cada fase que imprime el lanzador (`green: 2 sujetos · 0.84 $`, `refactor: 2 sujetos · 0.92 $`…) — coste si está mal: ninguno en la conducta.
- Re-revisión, Minor nuevo: la viñeta del `roadmap check` de `records.md` pierde «After editing and before the closing commit»; se queda, porque el paso 4 de `SKILL.md` ya dice «`sdd roadmap check` before the closing commit» y el saldo lo pide; `a9` y `a1` corrieron antes del recorte — coste si está mal: un cierre que corre el check tarde y lo ve la CI.
- Las filas nuevas de los sujetos llevan `**Toca:** —`: §5 del molde no nombra ningún fichero, y SP1 lo da por bueno — coste si está mal: un `**Toca:**` vacío en las filas que abre un spike real.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → cli:test: corrió 2614/2629 (15 skipped) · cli:typecheck: corrió · kit:test-headless: 816/817, `molds.test.ts` > `vf6` rojo · 272 s · sobre 21369fe. Tras el rojo en 21369fe, sin arreglo (intermitente): `vitest run test/kit/headless/molds.test.ts -t vf6` → 3/3 y `moon run kit:test-headless` → 817/817 · 233 s.
- Línea base (worktree desanclado en `c399c9fe9`): `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless 813/813 · 203 s.
- Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (lite, sin señales), sobre 21369fe
- Pasada de fix: juntada en el cierre, 6 hallazgos, medidos con `sp1` N=2 dos veces (fix y fix2)
- Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 abiertos adjudicados (la copia de «Externo» y las líneas de tanda) y 1 Minor nuevo adjudicado
- Tanda: `SCENARIOS="sp1" N=2`, kit de la rama, `fix2: 2 sujetos · 0.79 $`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-26 · RED 0/2 → REFACTOR 2/2 → tras la pasada de fix SP1, SP2 y SP4 2/2, SP3 1/2 (`sp1`, ejecución real) · controles `a9` y `a1` limpios · gate 817/817 tras el intermitente · revisión final Spec y Código sobre 21369fe, con arreglos; re-revisión con sus abiertos adjudicados

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El commit de cierre lleva en Now dos filas `⏳`, una por arreglo y con su brief, con ids de una sola reserva | ejecución real (`sp1`, fix2, 2/2) | 0031 y 0032 en Now con brief, de `id next --reserve --count 2`, en el commit de cierre; `roadmap check` → «Roadmap válido» |
| La fila 0030 dice `✅ → 0031, 0032` | ejecución real (`sp1`, fix2, 2/2) | sí |
| `#412` pasa a las dos filas nuevas | ejecución real (`sp1`, fix2, 1/2) | las dos filas nuevas lo llevan en 2/2; en `sp1-1` la 0030 lo conserva (copia, no mueve) |
| Con la validación diferida, `🧪 … → 0031, 0032` | no probado | el repo valida en campo (`✅`); la viñeta nombra la forma |
| Controles: la fila `✅` en Now y la deuda saldada (`a9`), el cierre de feature entero (`a1`) | ejecución real (n = 1) | limpios |

### 4.3 Residuales / deuda generada

- Intermitente `molds.test.ts` > `vf6` («no es su propio repo git») → «Por triar» de `debt.md`.
- SP3 1/2: un sujeto copia el «Externo» del spike a las filas nuevas sin quitarlo de la suya → «Por triar» de `debt.md`.

## 5. Aprendizajes

- «La fila acaba en `→ <ids>`» se lee como el final de la fila, no de una celda: en una regla sobre una tabla, se nombra la celda y su valor literal → la viñeta de `records.md` (este cambio).
- «… and the spike's «Externo» becomes `—`» junto a «moves to those rows» hizo que los dos sujetos vaciaran la celda en todas las filas: dos órdenes sobre la misma celda en una frase se leen como una sola → la viñeta de `records.md` lleva solo «moves to each of those rows» (este cambio), y el resto, a la fila de deuda.

Retro: búsqueda a ciegas → ticket del kit: «Closing the review» de `sdd-verify` no pide guardar los informes de los ejes en el workspace; tras la compactación, los hallazgos que necesita el encargo de la re-revisión salieron del transcript de la sesión

## 6. Adendas
