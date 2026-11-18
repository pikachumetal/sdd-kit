---
id: 20261118-215209-feature-0357-launch-prompt-open-items
feature: 0357
title: Walkthrough — El prompt de arranque no da por decidido lo que no decidió el dev-lead
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — El prompt de arranque no da por decidido lo que no decidió el dev-lead

## 1. Cambios realizados

- **Plantilla del prompt** (`skills/sdd-templates/templates/launch-prompt-template.md`, `89ff4e13c`): el bloque de ayuda dice qué es seguro (lo que dijo o aceptó el dev-lead, lo escrito en roadmap, propuesta, spec, ADR o constitution, y lo delegado), el origen entre paréntesis de cada línea de «Decisiones ya tomadas», la sección nueva `Abierto:` con la propuesta de quien escribe el prompt, que su valor no sale fuera, y la regla ante un choque. El ejemplo lleva el origen y un punto de `Abierto:`.
- **Baterías** (`d2f452cfb`, `89ff4e13c`): `m8` y fila M8 en `sdd-roadmap`; `e4` y fila E4 en `sdd-explore`; la procedencia de la regla en las dos. Evidencia: `tests/sdd-roadmap-0357-red.md`, `-green.md`, `tests/sdd-explore-0357-red.md`, `-green.md`.
- **Tope de palabras** de `sdd-templates` en `cli/test/kit/word-budget.test.ts`: 17460 → 18000 (enmienda aprobada).
- **Capacidades**: `planning` gana «El prompt de una fila separa lo decidido de lo abierto» y su «Regla ante conflicto»; `routing`, «El prompt de un config deja abierto lo que recomienda el agente».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,92 h — reloj de la sesión 1,72 h desde 2026-11-18T21:26Z, sin 48 min de espera al dev-lead (14 esperas)
- Desviación: −0,58h (−39 %)
- Causa de la desviación: la estimación sumaba spec y plan aparte (1,5h); la implementación fue texto y sujetos en segundo plano. Esperas y huecos: 48 min en 14 esperas (21:27Z 7 min; 22:30Z 9 min; 22:44Z 6 min; 21:55Z 6 min, las mayores)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 40.367.979 — claude-opus-5-5 40.367.979
- Tokens de subagentes: 6.022.626 en 7 despachos — Revisor dominio spec 0357 claude-opus-5-5 319.054 / 1 min; Revisar enmienda de e4 claude-sonnet-5-5 126.381 / 1 min; Segunda ronda review spec 0357 claude-sonnet-5-5 145.946 / 1 min; Revisor técnico spec 0357 claude-sonnet-5-5 412.218 / 1 min; Re-review final 0357 claude-opus-5-5 1.217.871 / 3 min; Final review — Spec axis claude-opus-5-5 3.081.506 / 5 min; Final review — Code axis claude-sonnet-5-5 719.650 / 2 min
- Coste de la sesión: 18,32 $ (hilo 13,66 $ + subagentes 4,67 $)
- Coste de sujetos: 2,77 $ en 23 sujetos sonnet — red 0,49 $; green 1,22 $; green2 0,17 $; ctl-develop 0,21 $; green3 0,27 $; red-e4b 0,26 $; fix 0,15 $
- Review de spec: 2 revisores (dominio opus, técnica sonnet) y segunda ronda sonnet · hallazgos 30, aceptados 25

## 3. Desviaciones del plan

- `subject.mjs` no se tocó: los moldes ya existían (decisión 3 del plan).
- Enmienda de `e4` (aprobada): con la petición original ningún sujeto llegaba a `sdd-explore`.
- Enmienda del tope de palabras de `sdd-templates` (aprobada): la spec no midió el tope.
- Enmiendas de las filas M8 y E4 (aprobadas): precisiones de la rúbrica pedidas por la revisión final.

### Decisiones tomadas sin el dev-lead

- La línea base de `kit:test-headless` sale roja (`molds.test.ts`, «el molde salas3-current de sdd-upgrade (r1) no queda por debajo de la última migración»); en `origin/develop` pasa 775/775: lo arregla el patch 0358, posterior a la base de la rama — si me equivoco, el gate del cierre lo vuelve a dar rojo.
- El RED de `e4` también sale rojo en la puerta (ningún sujeto llega a `sdd-explore`); la plantilla no cambia el enrutado — si me equivoco, E4 no se podía observar (lo resolvió la enmienda).
- La fila M8 excluye nombrar la 0008 — sin esa precisión daba falso rojo — si me equivoco, deja pasar un canal colado por la 0008.
- El tope de `sdd-templates` queda en 18000, la opción aprobada, y no en 17700 — deja 360 palabras de holgura.
- «Lo que consta en el roadmap» cuenta como seguro sin acotarlo — lo dijo el dev-lead — una idea del agente escrita en un brief sale como segura (decisión 6 de la spec).
- `m1-1` saca el canal «por correo» sin `Abierto:`: la regla sí debía saltar y el sujeto no la aplicó; va al ticket, sin medir `m1` con el kit de `develop` — si es una regresión, llega a campo.
- M8 deja pasar un origen vago («(proposal 0010, §Reglas de negocio)») — la rúbrica pide origen, no ruta exacta — un origen vago pasa.
- Los ejes Spec y Código de la revisión final salieron uno tras otro, no en paralelo — el CLAUDE.md pide confirmar antes de paralelizar — unos 10 min más de espera.
- sin revisar: el commit de las enmiendas M8 y E4 y los rulings, posterior a la re-revisión (23 líneas, solo docs) — juntado en el cierre.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build kit:skill-size kit:own` → verde tras cada cambio de la plantilla.
- Gate: corre una vez, sobre el merge de sincronización (la 0356 está abierta a la vez); su línea va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-19 · RED/GREEN de las baterías con ejecución real: `m8` RED 0/2 → GREEN 2/2 y 1/1 tras la pasada de arreglos; `e4` (petición enmendada) RED 0/2 → GREEN 2/2; controles `m1` y `m4` 2/2, `e2` 1/2 igual que con el kit de `develop` · revisión final Spec y Código sobre la Task 2, pasada de arreglos y re-revisión opus, 1 commit sin revisar (solo docs)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| planning: el prompt de la 0013 lleva las 8:00 con su origen | `m8` GREEN, ejecución real | 2/2 |
| planning: el canal propuesto va a `Abierto:` y no sale fuera | `m8` GREEN, ejecución real | 2/2 |
| planning: sin nada abierto no hay `Abierto:` | controles `m1`, `m4`, ejecución real | 2/2 cada uno |
| routing: `sdd-explore` termina con el prompt en la forma de la plantilla | `e4` GREEN (`green3`), ejecución real | 2/2 |
| routing: la versión recomendada va a `Abierto:` y no sale fuera | `e4` GREEN (`green3`), ejecución real | 2/2 |
| planning, Regla ante conflicto | sin escenario: leída en la revisión final | no probado |

### 4.3 Residuales / deuda generada

- Retirar los topes de palabras: pedido como fila a la sesión `develop`; el dev-lead lo descartó allí («ok, déjalo», 2026-11-18). Los topes siguen; la 0357 solo sube el de `sdd-templates` a 18000.
- `sdd-roadmap` mete la recomendación del agente en el brief de una fila nueva («Decisiones ya tomadas: 24 sobre 22», RED `e4-2`): fuera de alcance (spec, decisión 6); va al ticket.
- La puerta de `e2` falla 1 de 2 también con el kit de `develop` (un sujeto no carga ninguna skill): previo a la 0357; va al ticket.

## 5. Aprendizajes

- Lo que el prompt de arranque separa y cómo se mide → `capabilities/planning.md` y `capabilities/routing.md` (delta) y la procedencia de las baterías de `sdd-roadmap` y `sdd-explore`.
- Una petición que pide al agente «recomiéndame tú» sin preguntar nada no entra por `sdd-explore`; con «¿Rompe algo?» sí → la enmienda de `e4` en la spec y `tests/sdd-explore-0357-green.md`.
- La spec no midió el tope de palabras de `sdd-templates`, que cuenta la skill entera: la regla de «Topes de palabras» de la plantilla de spec existía y no la apliqué → ticket del kit.

Retro: error que cazaría un chequeo → ticket del kit: una spec que edita un fichero contado por `cli/test/kit/word-budget.test.ts` (aquí, una plantilla, que suma al total de su skill) sale sin «Topes de palabras»; ni el repaso de coherencia ni la review lo cazan, y salta el pre-commit después del GREEN

## 6. Adendas
