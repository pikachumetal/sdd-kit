---
id: 20261030-140305-feature-0264-patch-predicate-and-row-files
feature: 0264
title: Walkthrough — El predicado de patch en el roadmap y la evidencia de una fila nacida de otro cambio
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-30
---

# Walkthrough — El predicado de patch en el roadmap y la evidencia de una fila nacida de otro cambio

## 1. Cambios realizados

- `skills/sdd-roadmap/SKILL.md`, «Something concrete»: cuenta los tests antes de «Patch:» o `**Carril:** patch`, y una fila nacida de otro cambio enlaza su artefacto, con las cifras añadidas antes en él. Salen una racionalización y tres red flags: 3.595 → 3.584 palabras (`7e6e2ca3`).
- `tests/batteries/sdd-roadmap/`: escenarios `rl1`, `re1` y `rf1`, moldes `salas-gate` y `salas-3-reexport`, rúbricas y procedencia (`7e6e2ca3`, y la pasada de fix, juntada en el cierre).
- `tests/batteries/sdd-propose/`: escenario `pw1` y molde `reservas-tope-justo`, sin regla, como control (`7e6e2ca3`).
- `.docs/sdd/capabilities/planning.md`: dos requisitos nuevos.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 0,5 h
- Esfuerzo real: 0,44 h — reloj de la sesión 0,89 h desde 2026-10-30T14:00Z, sin 27 min de espera al dev-lead (1 espera)
- Desviación: -0,06 h (-12 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 9.954.852 — claude-opus-5-5 9.954.852
- Tokens de subagentes: 948.682 en 2 despachos — Final review — Code axis claude-sonnet-5-5 478.107 / 1 min; Final review — Spec axis claude-opus-5-5 470.575 / 3 min
- Coste de la sesión: 7,08 $ (hilo 5,71 $ + subagentes 1,37 $)
- Coste de sujetos: 2,59 $ en 12 sujetos Sonnet — RED 1,38 $ (6, de ellos 2 sin medir, 0,51 $); GREEN 0,77 $ (4); GREEN 2 0,44 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- `rl1` y `re1` corrieron con n = 1 en dos tandas, `green/` y `green2/`, en vez de n = 2 en una: un fallo de escape dejó la tabla en n = 1 al lanzar. Mismo kit y misma petición; la tabla queda en n = 2.
- `m5` corrió una sola vez, como preveía la spec, aunque su fila dice n = 2: el techo de sujetos cortó el segundo.
- `sdd task done` registró un comando vacío en el ledger; la verificación real es la de abajo.

### Decisiones tomadas sin el dev-lead

- Las filas de deuda con «Actuar → 0264» que la spec no arregla pasan a `**Actuar**: sin fila` — para que no apunten a una fila cerrada — otra fila de triaje si se prefiere otro destino.
- En la pasada de fix, los hallazgos M4, M5 y M6 del eje Spec se resuelven por escrito: línea «Retirado» en la batería, la forma 3.0.0 sin medir y la verificación aquí — no cambian la skill — si `ROADMAP.md` se comporta distinto, una regresión sin escenario.

## 4. Verificación

### 4.1 Builds

- `npx vitest run test/kit/word-budget.test.ts` → `Tests  72 passed (72)`.
- Pre-commit en verde en los tres commits de la rama.
- Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre `7e6e2ca3`.
- Pasada de fix: juntada en el cierre, 9 líneas de batería y plan y un comentario, sin test que los reproduzca · revisado en el hilo: juntada en el cierre · `battery.md`, `subject.mjs`, `plan.md` · 11 líneas.
- Gate: el de la base integrada, en el mensaje final; corre una vez sobre el merge de sincronización, porque la base va por delante.

### 4.2 Smoke / tests

Validación en campo: 2026-10-30 · RED y GREEN con sujetos Sonnet (`rl1` 0/1 → 2/2, `re1` 0/1 → 2/2), controles `rf1` y `m5`, revisión final Spec y Código sobre `7e6e2ca3`, pasada de fix revisada en el hilo. No probado: la forma 3.0.0 del primer THEN.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La fila no empieza por «Patch:» | ejecución real: `roadmap.md` de `green/out/rl1-1` y `green2/out/rl1-1` | ✅ |
| Ni lleva `**Carril:** patch` en `ROADMAP.md` | no probado: `rl1` usa el molde 2.x | — |
| El prompt lleva `***Carril:***` lite o feature y `***Nombre:***` `feature/<id>-<slug>` | ejecución real: `texts.txt` de las dos tandas, `lite` y `feature/0008-…` | ✅ |
| La fila enlaza el `patch.md` de la 0007 con la sección de las medidas | ejecución real: `roadmap.md` de `re1`, «adenda 2026-10-30» | ✅ |
| Ese `patch.md` lleva las cifras en una adenda fechada | ejecución real: `patch-0007.md` de `re1`, solo líneas añadidas al final | ✅ |

### 4.3 Residuales / deuda generada

- La 0250 y la mitad de patch de los topes salen por RED limpio: pasan a esperar otro caso.
- 1 de 2 `re1` del GREEN escribió «Patch: bajar el tiempo del gate» sin solución fijada y sin tests que contar: la regla no dice nada de cero tests. Un caso; va al ticket.
- 3 de 3 sujetos del RED chocaron con `sdd roadmap publish`, «destino con cambios». Va al ticket.

## 5. Aprendizajes

- Un RED barato no es barato si el molde no se comprueba antes de lanzar: 0,51 $ de 1,38 $ se fueron en sujetos sobre un molde roto → ticket de la 0264.
- Un script en un heredoc de Git Bash perdió barras invertidas en esta sesión (`/\s+/` → `/s+/`) → ticket de la 0264; `tech-stack.md` ya avisa de los heredoc.

## 6. Adendas
