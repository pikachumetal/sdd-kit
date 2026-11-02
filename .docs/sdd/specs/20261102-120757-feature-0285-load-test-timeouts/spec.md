---
id: 20261102-120757-feature-0285-load-test-timeouts
feature: 0285
title: Los tests de cli:test no vencen a 5 s con varias suites a la vez
mode: lite
profile: delegate
status: done
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — Los tests de cli:test no vencen a 5 s con varias suites a la vez

🦆 Hoy, con ocho ramas guardando a la vez, tres de cada ocho guardados fallan por una prueba que pasa de 5 segundos, aunque nada esté roto. Después del cambio, las pruebas que se retrasan en ese caso tienen un margen de 20 segundos, y las demás siguen con 5. Una prueba, además, comprobaba demasiado pronto que un programa ya se había parado; ahora espera a que se pare. La medida mostró que la carga de procesador sola no da el fallo, ni al 98 %: hacen falta varias suites a la vez. La frase prevista para la skill no se escribe, porque los dos sujetos ya separan esos dos pasos sin ella.

Validación: agente — son tests y su medida; `validation.mode: field`, el uso real lo valida con los tickets.

## Capacidades

Ninguna, porque herramientas.

## ✋ Decisiones que he tomado yo — valida estas

1. **El Step 3 de `sdd-worktrees` no se edita, aunque tu «hecho cuando» lo pide.** El RED `w4` salió limpio: 0 de 2 sujetos juntaron el commit y la línea base. El Art. I dice que sin fallo en el baseline no se escribe la guía, y la constitution manda sobre la spec. Además, con los topes por fichero, ese solape ya no daría rojo. `w4` se queda en la batería como escenario. Límite: n = 2 en sesión recién arrancada, y `tech-stack.md` avisa de que eso puede no reproducir un fallo de sesión larga. Si vuelve en campo, el ticket nuevo es el segundo caso.
2. **El criterio de hecho cambia de carga.** Se mide tu `moon run cli:test` con la CPU cerca del 80 %, que ya pasa hoy (0 timeouts en cinco pasadas, con CPU media del 64 al 98 %), y además 8 suites a la vez, el único montaje que reproduce el fallo: 3 de 8 en rojo, con CPU media del 84 %.
3. **Ningún fichero pasa a `*.slow.test.ts`.** Solos, sus tests tardan como mucho 1.746 ms y la suite 9 s: no tardan de verdad.
4. **Los 7 ficheros de la decisión 5 suben su `testTimeout`, con tu regla tal cual**: esperan a procesos. `watch/loop` lanza `node`; `subject-output-privacy` y `temp-dir` llaman a `git`; `statistics`, `layout`, `roadmap/check` y `session/clock` llegan a `git` por los verbos que prueban (`gitSync` en `estimation/releases.ts`, `roadmap/releases.ts` y `session/`). Rastreado por los `import`, sin perfilar cada test.
5. **Entran los 7 ficheros con algún test de 4.000 ms o más en la medida de 12 suites a la vez** (80 % del tope), con estos máximos: `kit/subject-output-privacy` 8.724, `estimation/statistics` 8.096, `roadmap/check` 6.884, `watch/loop` 6.408, `session/clock` 5.842, `estimation/layout` 4.950, `temp-dir` 4.673.
6. **El tope por fichero es de 20 s**, algo más del doble del peor test medido (8,7 s), con `vi.setConfig` en cada fichero.
7. **Entra un arreglo que no pediste, en `watch/loop.test.ts`.** «con -- da SILENCIO…» falló 1 de 12 con el tope de 60 s (`expected true to be false`): tras 800 ms fijos, el proceso hijo aún escribe. Subir el tope no lo arregla y es el mismo rojo falso por carga. Pasa a reintentar con `vi.waitFor` hasta 10 s; un hijo que no se para sigue dando rojo.
8. **`tech-stack.md`, «Conjunto rápido», gana una frase**: la carga que da el fallo y dónde va el tope por fichero (Art. XI).
9. **Rama y carpeta**: `patch/0285-…` pasó a `feature/0285-load-test-timeouts`, porque el carril subió a lite.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según `sdd-verify` · sujetos Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Carril lite, con parada en la spec — opción «Lite, y me enseñas la spec» de la pregunta de carril (respuesta: «1»).
- Sin subir el timeout global — «Subir el timeout global: escondería tests realmente lentos».
- El gate de 5 min sigue valiendo — «El gate de 5 min de la 0233 sigue valiendo: mide que no sube».

## Intent

Con varias ramas a la vez, el pre-commit da `Test timed out in 5000ms` en tests que pasan al reintentar: ~10 min cada vez y líneas base sin valor (ticket de la feature 0182 §2). Lo medido en esta spec: una suite sola tarda 9 s y, con la CPU al 80-98 % por quemadores, 12-16 s sin ningún timeout; con 8 suites a la vez, 34 s y 3 de 8 en rojo. La causa es la contención entre suites, no el porcentaje de CPU. El éxito: 8 suites a la vez sin ese error. Sería un fracaso esconder un test realmente lento, y por eso el tope sube solo en esos ficheros.

## Scope

- Entra: `testTimeout` de 20 s con su motivo en los 7 ficheros de la decisión 5; el arreglo de la decisión 7; la frase de `tech-stack.md`; el escenario `w4` y su evidencia RED.
- No entra: el timeout global; el cerrojo de suites (0240, 0251); los timeouts de `git` de `tech-stack.md`; editar `skills/sdd-worktrees/SKILL.md` (decisión 1); mover ficheros a `*.slow.test.ts` (decisión 3).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Espera fija de 500 + 300 ms | `cli/test/watch/loop.test.ts:125-127` | decisión 7 |

- Filas que implementa: 0285 y la deuda «Intermitente: dos tests de `cli:test` vencen a 5 s con la máquina cargada» → `roadmap.md:70` y `:664`, las marca el cierre; `roadmap.md:134` y `:135` (0198 y 0152) solo la citan como dependencia y no cambian.
- Una pieza entra, otra sale: no se retira nada de ninguna skill, porque no se edita ninguna; `tech-stack.md` gana una frase y cabe en su tope (ver Topes).

## Approach

Una línea `vi.setConfig({ testTimeout: 20_000 })` al principio de cada fichero, con un comentario de una línea sobre el motivo: sin citar documentos (Art. X). El tope vale para el fichero, porque Vitest aísla cada uno, y el resto de la suite sigue con 5 s. Para `watch/loop`, la comprobación del hijo parado reintenta con `vi.waitFor`.

## Dónde se prueba

- Sin `Test timed out in 5000ms` con carga: `moon run cli:test` con la CPU sujeta al 80 %, y 8 suites a la vez, tres pasadas; la medida va al walkthrough.
- Un test lento sigue dando rojo fuera de esos ficheros: mutante, un test con espera de 6 s en un fichero sin tope.
- `watch/loop` da rojo si el hijo no se para: mutante, el comando sin parar.
- Gate por debajo de 5 min: el gate de cierre cronometrado.
- `w4`: batería de `sdd-implement`, ya medida en el RED.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,7 h
- Estimación de implementación: 0,75 h + 0,03 h del gate de cierre (109 s, patch 0247)
- Base de la estimación: siete líneas y un arreglo, con las medidas ya automatizadas; la incertidumbre es repetir la medida con otras sesiones en la máquina
- Confianza: alta

## Topes de palabras

Se edita `tech-stack.md`, con el conteo de `word-budget.test.ts`. `sdd-worktrees/SKILL.md` no se edita: sigue en 1.432 palabras con ese conteo, sobre un tope nominal de 1.300.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 21.790 / 24.579 (19.663 con el margen del 25 %) | 2.789 | sin cambio |

## Previsión de coste

Cifras medidas en esta spec (0,37 $ por sujeto); la skill no se edita, y por eso el resto va a cero.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 2 (`w4`, `sdd-implement`), ya gastados | 0,73 |
| GREEN | 0: sin guía nueva | 0 |
| Una tanda de REFACTOR | 0: sin guía nueva | 0 |
| Controles | 0: sin guía nueva | 0 |
| Medición tras la revisión final | 0: sin guía nueva | 0 |
| Suma | 2 | 0,73 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
