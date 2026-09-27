---
id: 20260924-105352-task-0057-native-adapt
task: 0057
title: Walkthrough — Adaptar el kit a Native
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-24
date: 2026-09-24
---

# Walkthrough — Adaptar el kit a Native

## 1. Cambios realizados

- **Apertura** (`c8d2e34`): spec aprobada, plan en Native, `tasks.md` y RED previo de 10 sujetos, con el molde, los lanzadores y la sonda de `task-start` en Git Bash (`tests/native-adapt-red.md`).
- **Task 1, bucle Native** (`5c26769`): párrafo «En Native» en el paso 6 de `sdd-start-task`. Cubre `task-start` y `task-done` con el ledger, la base antes de cada task, los RED apartados y comparados con `git diff --no-index`, y el orden del cierre de la task. Además, las rutas de Windows cubren `task-start` en overrides y en `encargo-revision.md`.
- **Task 2, historia de commits** (`f6a283e`): la receta de `commit-milestones.md` vale también con un solo commit (el hilo escribe el mensaje del hito). La fila «Task N» dice cuándo se junta en Native. La apertura se junta antes de los RED, y un RED en el árbol se aparta para cualquier otro commit. Pasos 5 y 6.
- **Task 3, revisión final y cierre** (`b97c72a`):
  - techo del revisor final en el Art. IV y en `encargo-revision.md` (`sdd-kit:effort-high` + `opus`);
  - comprobación del tipo `sdd-kit:effort-*` antes del primer despacho;
  - paso 9 de `sdd-end-task` sin revisión duplicada, y paso 1 con los «Deferred minors».
- **Task 4, cambio tras compactar** (`75ba772`): la línea `Ejecución` de `plan-template.md` lleva la regla, y el paso 5 y la fila de `executing-plans` la citan.
- **Task 5, GREEN** (`5d7575b`): 22 sujetos. La tanda 1 dejó tres huecos y los cerró un REFACTOR:
  - la ubicación de los scripts y el orden de apertura en el párrafo Native;
  - la frase del cambio en imperativo y con la señal literal;
  - la apertura juntada en el paso 6 de SDD.
- **Pase de fix de la revisión final** (`257c79e`, juntado en el cierre):
  - la fila «Apertura» de `commit-milestones.md` y el paso 5 juntan antes de los RED (en Native, antes de `task-start`);
  - el paso 6 apunta la revisión final en `tasks.md` y el paso 9 la busca ahí;
  - la pregunta 5 de `control-profiles.md` describe `native` con la excepción de la compactación, por decisión del dev-lead;
  - `c1` se relanzó con un molde realista.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 2,7 h. Es el reloj del hilo, aproximado con las marcas de los commits:
  - de la apertura (13:24) al pase de fix (15:48), 2,4 h;
  - el cierre, ~0,3 h;
  - la espera a la respuesta del dev-lead (15:48–17:37) no cuenta;
  - spec, RED previo y plan, ~0,6 h antes de la apertura, quedan fuera del número.
- Desviación: +0,2 h (+8 %)
- Causa de la desviación: no aplica (por debajo del 30 %).
- Modelo del hilo: Opus 5.5 (1M context)
- Tokens del hilo: no medido
- Tokens de subagentes: 145993 en 1 despacho — revisor final `sdd-kit:effort-high` + Opus 146k / 4 min
- Coste de sujetos: 14,42 $ en 34 sujetos Sonnet — RED 3,63 $ (10 sujetos); GREEN 10,79 $ (24 sujetos, REFACTOR y `c1` realista incluidos)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 5 añadió un REFACTOR de tres textos tras la tanda 1 del GREEN. El plan lo preveía solo como riesgo.
- La frase del cambio de método de la plantilla cambió de forma. La spec (Approach) y el bloque «De código» del plan conservan la de antes.
- El pase de fix cambió el GIVEN del escenario «El cierre no repite la revisión final de Native»: donde decía «el ledger registra», ahora dice «`tasks.md` registra». Anotado como enmienda en la spec (ver «Decisiones tomadas sin el dev-lead»).
- `c1` se lanzó dos veces. El molde de la primera tanda medía un estado que superpowers no produce (`t1-c1`).

### Decisiones tomadas sin el dev-lead

- Estrechar el ancla del test de la 0055 `NativeDefault.Tests.ps1:130` a la celda `` | `executing-plans` (Native) | ``: casaba también con la fila de Windows, que ahora nombra `task-start`. No cambia ninguna aserción — coste si está mal: un ancla.
- La comprobación del tipo `sdd-kit:effort-*` va en un párrafo propio tras «En Native»: vale para SDD, y dentro del párrafo Native un lector de SDD la saltaría — coste si está mal: mover una frase.
- REFACTOR de tres textos tras la tanda 1 del GREEN, con el cambio de la forma literal de la línea `Ejecución` del Approach. No toca ningún requisito ni ningún THEN — coste si está mal: otra tanda de 7 sujetos (~3 $).
- **La campaña superó la previsión del Art. I y no se paró**: 34 sujetos frente a los ~20 declarados, con el coste en 14,42 $ frente a ~30 $. El Art. I pide parar al superar la previsión, y esa previsión también cuenta sujetos. La spec ya era incoherente: declaraba ~20 y sumaba 25 — coste si está mal: el dev-lead no decidió la tanda de REFACTOR.
- **Enmienda sin aprobar al GIVEN del escenario del paso 9** (ledger → `tasks.md`): la revisión final mostró que `executing-plans` borra el ledger cuando la revisión queda limpia. La prueba que buscaba el escenario no existe en el flujo real — coste si está mal: el paso 9 buscaría en el sitio equivocado.
- Minors diferidos de la revisión final (no se arreglan en esta task):
  - la fila de `executing-plans` en overrides dice «se adopta tal cual (… revisión final de rama)» y no remite al techo de «Revisor final»;
  - la fila de overrides excluye `pair` del cambio tras compactar, y la frase del plan no;
  - el campo «Tests RED» de `plan-template.md` dice «Native: TDD del propio hilo» sin «con copia apartada»;
  - la spec (Approach) y el bloque «De código» del plan conservan la frase de antes del REFACTOR;
  - la ayuda de `plan-template.md` dice que el método vale «para el plan entero» (la capacidad se ajusta en este cierre);
  - el GREEN de `n2` no midió el despacho con el tipo disponible; la revisión final de esta task (`effort-high` + `opus`) es la prueba en uso;
  - `tests/CommitMilestones.Tests.ps1:48` conserva el nombre «antes del primer despacho»;
  - `Get-SkillStep` no corta en «7. ⛔ **Validación», y el paso 6 incluye el 7 en los tests;
  - el Art. IV nombra solo el revisor final de Native, y `encargo-revision.md` lo aplica a los dos métodos;
  - las casillas de «Verificación por task» de `tasks.md` (corregidas en este cierre).

### Decisiones tomadas con el dev-lead tras la revisión final

- Con `execution: native` fijado también se cambia a subagentes tras una compactación — «Sí: compactar manda», 2026-09-24.

## 4. Verificación

### 4.1 Builds

- Sin build. `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` tras el pase de fix: 582 pasan, 0 fallan, 6 saltados.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-24 · «ya sabes prueba diferida al uso, feedback, commit merge y me avisas para cerrar» · disparador: la primera task que se ejecute en Native con el kit nuevo (la 0058), a cargo del dev-lead. El disparador lo concretó el agente, porque la frase no lo nombraba.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Native lleva el ledger, comprueba la base antes de cada task y aparta los RED (`n1`) | 0/2 → 1/2 → 2/2 tras el REFACTOR (verificado por el agente) |
| 2 | Tras compactar, con dos o más tasks pendientes, lo que queda va con SDD (`n4`) | 0/2 → 0/2 → 2/2 tras el REFACTOR; control sin compactación 1/1 en las dos tandas |
| 3 | Revisor final con Opus y aviso del tipo que falta (`n2`) | 0/2 → 2/2 |
| 4 | El paso 9 no repite la revisión final (`c1`, molde realista) | 2/2 |
| 5 | Los minors diferidos llegan al walkthrough (`t1-c1`) | 2/2 |
| 6 | Mensaje del hito reescrito con un solo commit (`s1`) | 0/2 → 2/2 |
| 7 | La apertura se junta antes de los RED (`s2`) | 1/2 → 1/2 → 2/2 tras el REFACTOR |
| 8 | En `delegate` no para por el método, sin el hueco de «libres» (`h1`, pendiente de la 0055) | 2/2 |
| 9 | Validación en uso de la 0055: esta task la eligió el handoff en Native y se ejecutó así (ledger, RED apartados, un commit por task y una revisión final Opus) | hecho por el agente |

### 4.3 Residuales / deuda generada

- Tras el cambio a SDD por compactación, los encargos salen sin la cabecera `## Restricciones de código` (2/2 en `n4`): la sesión compactada no relee el paso 6. Es la familia de E12 → fila de deuda técnica.
- T1 (en Native, la «Verificación» de la task frente a la suite entera): el RED no lo separa del efecto del `pre-commit` → fila de deuda técnica.
- Ticket 0053 §3 (los RED de varias tasks en un mismo fichero): no se reproduce (2/2 pasan en `s2`). La fila de deuda sigue abierta, con su disparador.
- Los diez minors diferidos de la revisión final, listados arriba → fila de deuda técnica.

## 5. Aprendizajes

- Tras una compactación, la sesión relee `plan.md` y el ledger, no las skills: 4 de 4 sujetos retomados no cargaron ninguna. Una regla que tiene que sobrevivir a la compactación va en el plan, y en imperativo con la señal literal: la condicional «Si retomas este plan…» dio 0/2 → `tech-stack.md`, «Sujetos headless».
- Un molde que imita el estado que deja una skill de superpowers tiene que calcar lo que esa skill escribe y lo que borra: el primer `c1` puso en el ledger una línea que `executing-plans` no escribe, y el ledger que la skill borra al terminar → `tech-stack.md`, «Sujetos headless».
- Las conductas de un sujeto se cuentan sobre los comandos completos del `.jsonl`, no sobre la primera línea de `tools.txt`. Un sujeto relanzado con la misma etiqueta sobrescribe su `.jsonl` en el scratchpad → `tech-stack.md`, «Sujetos headless».
- Un script de superpowers que el kit nombra lleva dicho de quién es: con «su `scripts/task-start`», un sujeto lo buscó en el kit y no lo encontró → `tech-stack.md`, «Aprendizajes por task» (0057).
- Una skill editada en la misma sesión se sirve con el texto del arranque, aunque su `Base directory` apunte al worktree: el cierre de esta task cargó el paso 9 viejo → `tech-stack.md`, «Aprendizajes por task» (0057).
- El comportamiento nuevo (bucle Native, revisor final, cierre, cambio tras compactar, historia de commits) → `capabilities/task-flow.md`, `control-profiles.md` y `commit-history.md`.

## 6. Adendas
