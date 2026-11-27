---
id: 20261127-130616-feature-0372-gate-once-on-moving-base
feature: 0372
title: Walkthrough — Tras una gate de cierre verde, un manifiesto de la base no repite la gate entera
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-27
---

# Walkthrough — Tras una gate de cierre verde, un manifiesto de la base no repite la gate entera

## 1. Cambios realizados

- **Skills** (`ef255ccf5`): el paso 6 de `sdd-archive` cambia su última frase por la regla en forma de predicado: «A file of «Sin filtro» from the base (`package.json`, a lockfile) runs only a task whose inputs hold it and that the branch touches; «it changes the build» isn't a reason.». El literal `Gate:` del paso 9 pierde `(sin filtro: cambia el build) |`. «After the sync merge» de `closing-suite.md` quita la excepción de la base. El punto 2 de «Running a gate» de `sdd-verify` deja de nombrar la base, reescrito para que `kit:own` no lo vea repetido con `closing-suite.md`. La línea «Sin filtro» de `operations-template.md` pasa a decir «si la rama toca uno, el gate de cierre corre sin filtro». Saldo: −9 palabras (`sdd-archive` +1, `sdd-verify` −9, `sdd-templates` −1).
- **Batería** (`389ff4b05`): g8 reescrito, con el molde `reservas-gate-lock` sobre `developManifest` (un `package.json` raíz en `develop`, input de ninguna tarea) y la rúbrica G8a, G8b y G8c; el molde de av2 gana `developAppTest` (un test en `test/app.test.js`, input de `bookings:test`), y la rúbrica gana AV2b. Cambian la descripción de los dos moldes y la procedencia.
- **Capacidades**: `closing-suite` («El cierre integra la base tras su commit…»), `verification` («La línea `Gate:` nombra cada tarea…») y la regla «Límites» de `archive`.
- **CLI**: ninguno; `sdd merge --verify` ya cruzaba sin leer «Sin filtro».

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,33 h — reloj de la sesión 1,50 h desde 2026-11-27T11:57Z, sin 10 min de espera al dev-lead (5 esperas)
- Desviación: −0,17 h (−11 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 51.942.880 — claude-opus-5-5 51.942.880
- Tokens de subagentes: 5.475.729 en 6 despachos — Re-revisión de la pasada de fix claude-opus-5-5 1.032.938 / 2 min; Revisión final: eje Spec claude-opus-5-5 2.299.863 / 4 min; Revisión final: eje Código claude-sonnet-5-5 995.713 / 2 min; Revisor de spec: dominio claude-opus-5-5 381.102 / 1 min; Revisor de spec: técnica claude-sonnet-5-5 444.449 / 2 min; Segunda ronda de revisión claude-sonnet-5-5 321.664 / 1 min
- Coste de la sesión: 20,41 $ (hilo 16,20 $ + subagentes 4,21 $)
- Coste de sujetos: 4,65 $ en 10 sujetos sonnet — red 1,34 $; green 1,36 $; green2 1,42 $; fix 0,53 $
- Review de spec: 2 revisores (opus, sonnet) y segunda ronda (sonnet) · hallazgos 28, aceptados 18

## 3. Desviaciones del plan

### Decisiones tomadas sin el dev-lead

- RED de av2 1/1: el sujeto encontró el rojo de la rama antes de la sincronización, así que AV2b no distingue la regla vieja; av2 queda como control y AV2b se quedó en la rúbrica para el GREEN.
- RED de g8 0/2 por la rúbrica, pero solo g8-2 exhibe la regla vieja (la gate entera); g8-1 ya saltaba las tareas y cayó por la forma de la línea `Gate:`.
- La inspección del molde en seco usó `DRY_RUN=1 KEEP_MOLD=1` y un merge a mano en el molde conservado, porque `battery.mjs` no tiene un verbo `dry-run`.
- Primer GREEN 0/2 (g8) y 0/1 (av2): los sujetos decidieron con el paso 6, sin leer `closing-suite.md`, y tomaron «es un manifiesto, cambia el build» como motivo para correrlo todo. La frase del paso 6 se reescribió como predicado con ese contraejemplo (Art. II, excepción sin contraejemplo), sin cambiar ningún THEN; la segunda tanda dio g8 2/2 y av2 1/1, dentro de la contingencia de la spec (decisión 13).
- G8b de g8-1 (segunda tanda) pasa con los nombres de tarea entre backticks: el porqué de cada tarea es el literal.
- g8-1 (segunda tanda) repitió la gate de cierre antes del commit de cierre; tras `--sync` no corrió nada. Esa repetición previa no es de esta feature.
- La frase del paso 6 es la de la segunda tanda, no la del plan, más «, from the base or the branch» de la pasada de fix; saldo final −5.
- Revisión final (Spec opus, Código sonnet, sobre `ef255cc`) con arreglos; la pasada de fix (juntada en el cierre) versiona `dist/` (ADR 0023), extiende el predicado del paso 6 al «Sin filtro» de la rama tras `--sync`, pone al día los comentarios de los moldes con el helper `onDevelop`, acepta los nombres de tarea entre backticks en G8b y corrige un ruling falso (g8-1 de la segunda tanda sí hizo `--sync`). Con ruling: el literal del paso 9 sin la marca de build, el lockfile como input de una tarea de la base sin escenario propio (lo mide g5), AV2b sin RED que discrimine.
- Re-revisión opus (`ef255cc..` juntada en el cierre) aprobada; su Minor (el predicado no nombra la base para un «Sin filtro» de la rama) queda con ruling: lo acotan la frase anterior del paso 6 y `closing-suite.md`.
- El caso de un «Sin filtro» de la rama tras `--sync` no tiene sujeto: **no probado**.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 817/817 · cli:typecheck: corrió · cli:test: corrió 2613/2613 (15 skipped) · sobre ef255cc; tras la pasada de fix, `moon run cli:test kit:test-headless` y `kit:skill-size kit:own kit:copies cli:typecheck` sin filtro → cli:test: corrió 2614/2614 (15 skipped) · kit:test-headless: corrió 817/817 · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-27 · gate verde sobre el commit de cierre · RED con `develop`: g8 0/2, av2 1/1 (control) · GREEN: primera tanda g8 0/2 y av2 0/1, segunda tanda g8 2/2 y av2 1/1, medición tras la pasada de fix g8 1/1 · revisión final Spec opus y Código sonnet sobre ef255cc, pasada de fix juntada en el cierre, re-revisión opus aprobada · no probado: el «Sin filtro» de la rama tras `--sync`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La base trae `package.json` (y el lockfile) tras una gate verde: la gate no corre entera | ejecución real | g8 (green2 2/2, fix 1/1): tras `--sync` no corre ninguna tarea |
| La línea `Gate:` nombra cada tarea saltada con su porqué, sin `(sin filtro: cambia el build)` | ejecución real | g8: `bookings:test: saltada (la base no toca sus inputs) · rooms:test: saltada (solo la toca la base)` |
| Con todas saltadas, `--verified-at` es el sha de la gate de cierre | ejecución real | g8: `--verified-at` del commit de cierre o de la gate (`9048f4f`, `2ac7c73`, `da96d9b`); fusionada |
| Lo que cruza corre: un rojo de la rama sale en la pasada filtrada tras `--sync` | ejecución real | av2 (green2 1/1): `gate.mjs run … --affected` tras `--sync`, rojo devuelto a `sdd-implement`, sin merge |
| Un «Sin filtro» de la rama tras `--sync` no repite la gate entera | no probado | sin sujeto; el texto del paso 6 lo dice |
| La marca `(sin filtro: cambia el build)` solo por la rama en la gate de cierre | suite | g7, sin cambios |
| Saldo de palabras ≤ 0 | ejecución real | −5 (`sdd-archive` +5, `sdd-verify` −9, `sdd-templates` −1); `word-budget.test.ts` 95/95 |

### 4.3 Residuales / deuda generada

- El «Sin filtro» de la rama tras `--sync` queda sin sujeto en la batería (no probado).
- El Minor de la re-revisión (el predicado del paso 6 no nombra la base para un «Sin filtro» de la rama), con ruling.

## 5. Aprendizajes

- Una regla dicha en negativo sobre «Sin filtro» («doesn't run the gate whole») no la siguieron los sujetos (GREEN 0/2): el nombre del campo invita a correrlo todo, y solo como predicado con su contraejemplo («it changes the build» isn't a reason) dio 2/2 → procedencia de la regla en `tests/batteries/sdd-archive/battery.md`.

Retro: error que cazaría un chequeo → ticket del kit: `cli/test/kit/dist.test.ts` compara el `dist/` del árbol de trabajo con el build, no el del índice, así que el pre-commit de la Task 2 dejó pasar un commit de `skills/` sin su `dist/` (lo cazó la revisión final, Important de ADR 0023)
