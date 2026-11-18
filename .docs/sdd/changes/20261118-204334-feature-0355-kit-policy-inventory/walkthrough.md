---
id: 20261118-204334-feature-0355-kit-policy-inventory
feature: 0355
title: Walkthrough — Spike: inventario del texto del kit que es política de cada proyecto
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Spike: inventario del texto del kit que es política de cada proyecto

## 1. Cambios realizados

- **Apertura** (`3d7bcc3`): spec del spike, con dos preguntas al dev-lead (alcance y reglas de reserva), y plan de dos tasks en Native.
- **Task 1** (`f10a241`): `measure.mjs sweep` barre los 100 ficheros de `dist/skills/` con 28 marcadores y escribe el manifiesto de lectura (`out/reading.tsv`); `pieces.tsv` clasifica 86 piezas (29 `queda`, 32 `skill-proyecto`, 25 `template`) y `terrains.tsv` seis terrenos fuera del alcance a fondo. Enmienda de la spec, aprobada: lectura por sección, `sdd-end-release` y el filtrado de la gate a fondo, lo del cliente fuera.
- **Task 2** (`c38a194`): `measure.mjs table` suma por skill y comprueba que cuadra; `research.md` con las tablas, la forma del enganche (un campo en `operations.md`) y los cortes por versiones.
- **Revisión final** (juntada en el commit de cierre): pasada de fix de siete Important y siete Minor del eje Spec (93 piezas, salen 6.434 palabras, corte 0 = la 0350 primero) y los dos Minor de la re-revisión.
- Sin ADR candidatas: la frontera enganche/política la escribe como ADR la feature que retire la primera pieza.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 0,73 h — reloj de la sesión 1,11 h desde 2026-11-18T20:42Z, sin 23 min de espera al dev-lead (10 esperas)
- Desviación: −1,27h (−64 %)
- Causa de la desviación: 20:44Z 1 min; 20:45Z 7 min; 20:53Z 1 min; 20:55Z 2 min; 21:03Z 2 min; 21:06Z 4 min; 21:11Z 3 min; 21:14Z 1 min; 21:15Z 1 min; 21:17Z 1 min
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 43.970.089 — claude-opus-5-5 43.970.089
- Tokens de subagentes: 8.965.142 en 3 despachos — Revisar enmienda spec 0355 claude-sonnet-5-5 121.901 / 1 min; Re-review final 0355 claude-opus-5-5 3.125.061 / 3 min; Final review — Spec axis claude-opus-5-5 5.718.180 / 8 min
- Coste de la sesión: 19,88 $ (hilo 15,25 $ + subagentes 4,63 $)
- Coste de sujetos: no aplica
- Review de spec: no (carril spike); 1 revisor (sonnet) de la enmienda · hallazgos 10, aceptados 9

## 3. Desviaciones del plan

- Enmienda de la spec en la Task 1 (decisión 8): leer enteros los 76 ficheros con acierto era leer el 94 % del kit, el enfoque que la spec descartaba; paré, un revisor Sonnet la revisó (9 aceptados, 1 rechazado) y el dev-lead la aprobó, ampliando el alcance con `sdd-end-release` y el filtrado de la gate y sacando lo del cliente.
- La lista de lectura de la Task 1 sale del manifiesto calculado por el script, no de la lista a mano del plan.

### Decisiones tomadas sin el dev-lead

- En 31 ficheros cuyos aciertos fuertes eran todos falsos positivos (la palabra genérica `validation`, `stress-test`, `Timeouts` de despacho) se leyó la línea del acierto, no la sección — leer esas secciones no aportaba piezas y costaba unas 30.000 palabras de contexto — una regla de proyecto sin marcador en esas secciones puede haber quedado fuera; `research.md` lo declara como límite.
- La granularidad de una pieza es la línea: una línea que mezcla lo que se queda y lo que sale lleva un solo destino (p. ej. el paso 1 de `sdd-end-release`, con `release.hasRecipient` dentro, cuenta como `queda`) — partir líneas exigía otro formato de rango — las palabras que salen quedan algo por debajo de lo real.
- Corte A como menor sin comprobar proyecto a proyecto si alguno vive de las notas de release — no tengo acceso a todos los consumidores — si alguno las usa, el corte es mayor.
- `out/tables.md` se regenera con LF sobre un fichero en CRLF — git normaliza con `core.autocrlf` y el contenido es idéntico — un `git status` con el fichero modificado tras regenerar sin cambios.
- `implementer-prompt.md:39` (las esperas E2E dentro del contrato de los RED) cuenta como `queda` — la línea es sobre todo el contrato de los RED — unas 45 palabras de menos en la cifra del corte C, declaradas en `research.md`.
- Declinados de la revisión final, sin cambio: el corte A como menor con `hasRecipient: true` (lo decide el dev-lead al abrir la fila), «Elegida: A» en la forma del enganche (es la recomendación de la plantilla), `e2e-suite.md` 1-8 a la skill del proyecto (procedimiento de la suite E2E; se queda la gate tal como se declara), los topes de `CLAUDE.md`/`AGENTS.md` (no hay topes numéricos en `dist/skills/`) y la coordinación con la 0350 (va como corte 0).
- La enmienda de la Task 1 y su manifiesto, y la lectura por la línea del acierto, están arriba y en `tasks.md` §Rulings.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → no corre: la rama solo toca `.docs/` (`closing-suite.md`, «What runs»); la línea base de `sdd-worktrees` dio `cli:typecheck` y `cli:test` 89/89 ficheros (2494 passed, 12 skipped) sin filtro, en 37 s, sobre `3d7bcc3`.
- `node measure.mjs table` → `piezas: 93 · sin destino: 0 · solapes: 0` y `cuadra: sí`, sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · smoke 4/4 objetivos con ejecución real (`node measure.mjs table`: 93 piezas, `cuadra: sí`; 6 terrenos; cuatro cortes en `research.md` §4) · revisión final Spec sobre c38a194 con arreglos, re-revisión limpia (c38a194..pasada de fix, juntada en el cierre), y el commit de los Minor de la re-revisión revisado en el hilo · sin suite: la rama solo toca `.docs/`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| O1 — una fila por pieza con destino, motivo, palabras y enganche; cero sin destino | ejecución real | `node measure.mjs table` → `piezas: 93 · sin destino: 0 · solapes: 0`; con un solape a mano, `solape en sdd-tdd/references/writing-e2e.md: filas 2 y 88` y código 1 |
| O1 bis — una fila por terreno del resto | ejecución real | 6 terrenos en «Otros terrenos» de `out/tables.md`, cada uno con «¿otro spike?: no» |
| O2 — por skill hoy, sale, entra y neto; sumas que cuadran | ejecución real | `cuadra: sí` (contra los topes de `word-budget.test.ts`); salen 6.434 de 102.745 palabras, entran ~220 |
| O3 — corte por versiones con lo que pide y su SemVer | ejecución real | `research.md` §4, cuatro cortes (0 = la 0350, A menor, B menor, C mayor) |

### 4.3 Residuales / deuda generada

- Tres filas por abrir, si el dev-lead decide retirar: corte A, corte B (con su contraparte en `sdd-project-template`: `validation-script`, `release` y la técnica E2E en su `e2e`) y corte C (mayor, tras B); el corte 0 es la 0350, ya en el roadmap.

## 5. Aprendizajes

- Un barrido por palabras clave da muchos falsos positivos con palabras de flujo del propio kit (`validation`), y leer solo la línea del acierto se saltó piezas reales en 6 ficheros: el manifiesto calculado por el script hizo visible el coste antes de leer, y la revisión final cazó el hueco → este walkthrough (método de un spike, sin documento de anclaje que lo pida; ningún aprendizaje cambia una convención, la estructura ni una herramienta del repo).

Retro: sin señales

## 6. Adendas
