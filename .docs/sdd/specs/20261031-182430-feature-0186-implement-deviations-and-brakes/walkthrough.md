---
id: 20261031-182430-feature-0186-implement-deviations-and-brakes
feature: 0186
title: Walkthrough — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta

## 1. Cambios realizados

- **Freno por regiones** (`aa878b32`): `skills/sdd-implement/SKILL.md` y `control-profiles.md` comparan `git diff -U0` de la base con las líneas de la task; otra región o un solape declarado es un ruling con los dos tramos.
- **`tasks.md`** (`4dcb5598`, `7542081c`): la regla pasa de Setup al paso 1 del bucle y `sdd task start` y `sdd task brief` fallan con más de una task y sin el fichero (`cli/src/tasks/brief.ts`).
- **Oferta de gama media** (`802cc9d5`): los pasos 4 y 5 de `sdd-propose` dicen cuántas tasks y no la ofrecen con una sola.
- **Baterías**: escenarios `g1`, `g2`, `d1`, `a1`, `a2`, `b1`-`b3`, `n1`, `e1` en `sdd-implement`; `g1b` y la oferta en `sdd-propose`. Evidencia en `tests/implement-brakes-0186-red.md` y `-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 3,83 h — reloj de la sesión 5,27 h desde 2026-10-31T18:19Z, sin 87 min de espera al dev-lead (5 esperas)
- Desviación: +1,33 h (+53 %)
- Causa de la desviación: `tasks.md` no entró con texto y hubo dos enmiendas más, con sus tandas de sujetos.
- Compactación: sí, en la spec → SDD desde la Task 1
- Modelo del hilo: Opus 5.5
- Tokens del hilo: 33.147.203 — claude-opus-5-5 33.147.203
- Tokens de subagentes: 11.676.387 en 15 despachos
- Coste de la sesión: 20,40 $ (hilo 14,67 $ + subagentes 5,73 $)
- Coste de sujetos: 44,71 $ en 43 sujetos Opus y Sonnet — RED 10,19 $; GREEN 14,58 $; REFACTOR 5,20 $; enmiendas, controles y re-medida 14,74 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Método**: SDD, por la compactación durante la spec.
- **Task 2 insuficiente**: `n1` 0/4 con texto, en tres sitios. Enmienda aprobada (opción «1»): Task 4, la comprobación en la CLI; la ronda fallida se retiró.
- **Task 5 retirada**: el control `g1-2` falló, la frase no mejoró `g1` (1/3), y `g2` sin la orden no lo reproduce (2/2). Sale por lo acordado (opción «1»).
- **Techo de sujetos**: de 35 $ a 40 $ y a 45 $, aprobados por el dev-lead.
- **Saldos**: `sdd-implement` −6, `sdd-start-feature` −1, `sdd-propose` −10; la spec preveía −16, −7 y −9.

### Decisiones tomadas sin el dev-lead

- El delta de `cli` lleva un THEN con valores (código 1, mensaje) que la enmienda no fijaba — documenta el fallo aprobado — si está mal, se cambia el mensaje.
- El `git diff -U0` también contra `origin/<integración>`, añadido en la pasada de fix — hacía falta para que el freno pare de verdad — si está mal, una frase de más.
- Implementador firmó `Co-Authored-By` con su propio modelo — atribución fiel — sin coste.
- Los sujetos corrieron en Opus y en serie; Haiku en las tasks literales — coste — si está mal, un revisor más caro.
- Consumidor con feature a medias sin `tasks.md`: su siguiente `task start` falla con mensaje claro — no destruye nada — si molesta, un paso de migración.
- El resto, en «Rulings» de `tasks.md`.

## 4. Verificación

### 4.1 Builds

- Gate: lo corre el paso 6 de `sdd-archive` sobre el merge de sincronización, con la base por delante; su línea va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · smoke por THEN abajo · revisión final Spec y Código, y una re-revisión sin Critical ni Important, juntadas en el cierre.

| THEN | Evidencia | Fila |
| --- | --- | --- |
| Cruza `--name-only` con los ficheros de la task | ejecución real | `b1`, `b2`, `b3` |
| Compara `git diff -U0` | ejecución real | `b1-2` |
| Otra región: ruling con dos tramos, sigue | ejecución real | `b1-1` |
| Solape declarado: ruling, sigue | ejecución real | `b3` |
| Solape sin declarar: nombra tramos y para | ejecución real | `b2` |
| El plan no deja saber las líneas | no probado | lectura del eje Spec |
| `unattended` | no probado | texto sin cambio |
| `tasks.md` antes del primer `task start` con éxito | ejecución real | `n1` 2/2, `e1-1` |
| En SDD, antes del primer despacho | no probado | lectura del eje Spec; `task brief` lo exige por CLI |
| Va en la apertura o en la Task 1 | ejecución real | `n1` |
| Una sola task no lo exige | suite | `brief.test.ts` |
| `task start` falla con código 1 y mensaje | ejecución real | `executing.slow.test.ts`, `n1-1` |
| Oferta del gate de spec con su número | ejecución real | `g1` 2/2 de propose |
| Una sola task: sin oferta | ejecución real | `g1b` 2/2 |
| Gate del plan en `pair` con número | no probado | sin `pair` en el molde; misma forma |

### 4.3 Sin resolver

- **El criterio de hecho de la petición no queda demostrado.** `g1`, con la orden en la petición, falla en 3 de 6 sujetos; `g2`, sin ella, no reproduce. La fila sigue abierta.
- `e1` sigue sin medir las esperas y `n1` no llega al aviso de fase.

## 5. Aprendizajes

- **Un olvido de orden no se arregla con texto.** `n1` 0/4 con la regla en tres sitios, 2/2 con la CLI. Va a la evidencia y a la capacidad `cli`.
- **Un RED limpio con n = 1 puede ser suerte**: `g1` salió limpio y su control falló. Cuando el RED es limpio, la tanda de control dice más que el primer sujeto.
- **Una petición de sujeto que trae la orden mide obediencia, no el fallo de campo.**
- **Los topes de `SUBJECT_CAP` y `COST_CAP` son de campaña**, no de tanda.
- Revisión de skills: `.claude/skills/` mirada; sin cambios.

## 6. Adendas
