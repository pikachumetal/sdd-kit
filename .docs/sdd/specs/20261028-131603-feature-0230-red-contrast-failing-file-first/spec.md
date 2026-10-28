---
id: 20261028-131603-feature-0230-red-contrast-failing-file-first
feature: 0230
title: El contraste de un rojo corre primero el fichero que falla, en la rama y en la base, con el entorno preparado
mode: lite
profile: delegate
status: approved
created: 2026-10-28
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-28
---

# Spec — El contraste de un rojo corre primero el fichero que falla, en la rama y en la base, con el entorno preparado

🦆 Hoy, cuando una prueba falla al cerrar un cambio, el agente repite todas las pruebas tal cual en una copia sin el cambio: en el patch 0222 esa copia no tenía las librerías, el filtro de «solo lo afectado» no seleccionó nada y la tanda esperó a otra sesión, unos 26 minutos sin veredicto. Con el cambio, el agente prepara primero la copia como una de trabajo y repite solo el fichero que falla, con el cambio y sin él a la vez: en el 0222, 15 de 15 en los dos en unos 10 minutos, y la conclusión «no se repite». Además, el cierre cita como validado un registro que no se pierde al juntar los commits, la batería prueba que no se repiten pruebas que solo tocó la otra rama, y se vuelve a medir si el panel de pruebas sale aunque la aplicación no arranque.

## Capacidades

- Modificadas: `archive` — el contraste de un rojo (fichero primero, entorno de la base preparado, sin `--affected`) y el sha que cita la validación cuando el cierre la junta

## ✋ Decisiones que he tomado yo — valida estas

1. **Cuándo «el rojo se explica»** (la frase de la fila no lo fija): con el fichero en verde en los dos, el rojo se explica si su línea de error guardada es un tiempo agotado o un recurso de la máquina (puerto ocupado, fichero bloqueado, disco lleno, objetos temporales de git): «No se repite» sin más pasadas. Si no se explica, corre la tarea roja entera, sin `--affected`, en los dos. El rojo del 0222 (`unable to migrate temporary objects`) es de los que se explican.
2. **Rama y base a la vez**: las dos pasadas del fichero salen en el mismo turno, en segundo plano, y no una detrás de otra. Sustituye la secuencia de hoy («Passes without the branch: run it again on the branch»).
3. **Entorno de la base**: el worktree del contraste corre el Step 2 de `sdd-worktrees` (dependencias y, con `environments.md`, `env:setup`) antes de la primera pasada. Se cita el paso; no se copia su lista.
4. **El cerrojo**: el fichero corre con el runner del proyecto (`vitest run <fichero>`, `node --test <fichero>`), no con el gate, así que no entra en el cerrojo de suites de otra rama. El escenario lo deja en el THEN del ticket y la batería no lo mide: el molde no tiene cerrojo.
5. **La línea `base:`** no cambia de literal (`base: en rojo: el mismo comando también falla sin la rama`): la escribe también `sdd merge --verify`, y cambiarla rompe a quien la busca.
6. **El sha del 4.1**: cuando el sha de la suite de la validación cae en el tramo que junta el cierre, el 4.1 dice «sobre el commit de cierre» en lugar del sha, y `--verified-at` y el mensaje final llevan el sha del commit de cierre, que tiene el mismo código más los documentos del cierre. Con un merge de sincronización que corre algo, `--verified-at` sigue siendo su sha, como hoy.
7. **(b) en `g5` y no en un escenario nuevo**: el molde `reservas-gate-base` ya es la intersección vacía (la rama toca `bookings:test` y la base solo `test/rooms.test.js`), pero su rúbrica G5a pedía correr `rooms:test`, la regla de antes de `0622a9ac`. Se reescriben G5a, G5b y G5c a la regla de hoy; la fila de deuda decía que `g5` medía una base que tocaba lo mismo que la rama, y no es así.
8. **Plan B con el entorno caído**: escenario nuevo `g3d`, el molde de `g3` con `scripts/env-up.mjs` que sale con error. `g4` se mide tal cual. Si alguno falla G6, el §4 de `dev-validation.md` gana que el panel sale aunque el entorno no arranque y que `sdd validation serve` va en segundo plano.
9. **Escenario nuevo `a3a`** del contraste, molde `reservas-gate-red`: el gate filtrado, la 0010 hecha, un test de `bookings:test` que falla una vez con `EBUSY: resource busy or locked` y pasa desde entonces (su marca en el `.git` común, como `flaky_test`), y que importa una dependencia local de `package.json` que un worktree nuevo no tiene sin `npm install`.
10. **Lo que no entra**: la línea base de `sdd-worktrees` («run the same command in a detached worktree», `SKILL.md:131`) se queda como está; no es el cierre y nadie lo ha pedido.
11. **Prueba del delta**: `sdd capability merge` sobre una copia de `.docs/sdd` → `archive.md: sustituido «Un rojo ajeno se busca en la deuda antes de investigarlo»` y `sustituido «El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite»`, exit 0.
- **Previsión de coste (Art. I)**: RED con el kit de `develop`: `a3a` ×2 y `a8` ×2. GREEN con el de la rama: `a3a`, `a3r`, `a8`, `g5`, `g4` y `g3d`, ×2 cada uno. Son 16 sujetos, ~5 $ (0,3 $ por sujeto en las campañas de la 0208 y la 0221) y ~40 min de máquina en tandas de 3. Con la tanda de REFACTOR del plan B, techo de 20 sujetos y 7 $.
- **Una pieza entra, otra sale**: sale «the same command, as is» y la pasada secuencial (sin la rama, después en la rama) de «A red suite»; entra el fichero primero y en paralelo.
- Política de modelos: sujetos Sonnet con `tests/headless/battery.sh`, en tandas de hasta `control.maxParallelAgents` (3) · sin revisores de la spec (lite) · la revisión final, la de `sdd-verify` en lite.

### Decisiones tomadas con el dev-lead

- Carril lite y no patch: dos comportamientos nuevos son dos tests — opción «Lite (Recomendada)», 2026-10-28
- El sha que se cita cuando el cierre junta la validación: el del commit de cierre, sin sha en el 4.1 — opción «Commit de cierre (Recomendada)», 2026-10-28
- El worktree del contraste prepara su entorno como `sdd-worktrees` (dependencias) antes de correr nada; con un gate `--affected`, la tarea roja se corre sin `--affected` — «Decisiones ya tomadas» del prompt de arranque y fila 0230 del roadmap
- (b) un escenario de la batería para la intersección rama ∩ base: rama en `bookings:test`, base solo en `rooms:test`, no corre nada y la línea `Gate:` dice `rooms:test: saltada (solo la toca la base)` — prompt de arranque
- La (c), coordinar los cierres entre sesiones, no entra — «Aparcar 0230 (c)», 2026-10-27
- Plan B: se miden `g4` ×2 y `g3` con el entorno caído; si falla, el §4 de `dev-validation.md` dice que el panel sale aunque el entorno no arranque — prompt de arranque

## Intent

El ticket del patch 0222 §1 siguió «A red suite» al pie de la letra y no llegó a ningún veredicto: el gate `--affected` no seleccionó nada en un worktree de la propia base, el worktree nuevo no tenía dependencias y la tanda esperó el cerrojo de otra rama, unos 26 min de máquina y ~16 h de pared hasta el merge. Lo resolvió el fichero rojo solo, con la rama y sin ella a la vez, en ~10 min. El éxito es que `a3a` llegue a «No se repite» corriendo solo el fichero en los dos lados, con la dependencia instalada en la base, y que el cierre no cite un sha que el squash deja sin alcanzar. Fracasaría si el contraste se saltara la suite cuando el fichero pasa y el rojo no tiene explicación, o si `a3r` (rojo también sin la rama) dejara de parar a preguntar.

## Scope

- Entra: «A red suite» y «Integrated base» de `skills/sdd-archive/references/merge-recipe.md`; la frase del contraste del paso 6 y la del sha del paso 2 de `skills/sdd-archive/SKILL.md`; `tests/batteries/sdd-archive/battery.md` (escenarios `a3a` y `g3d`, rúbricas C1, G5a-c, N0 y las nuevas) y `subject.sh` (moldes `reservas-gate-red` y `reservas-start-down`); evidencia en `tests/red-contrast-0230-red.md` y `-green.md`; `dev-validation.md` §4 solo si el plan B falla.
- No entra: la (c), coordinar cierres entre sesiones; la línea base de `sdd-worktrees`; el `--verify` de `sdd merge` (la CLI); el cerrojo de suites de este repo.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «the same command, as is, without cleaning state or caches first» | `skills/sdd-archive/references/merge-recipe.md:18`, `skills/sdd-archive/SKILL.md:47` (paso 6) | Scope: el fichero primero con el runner, sin limpiar estado ni cachés |
| «Passes without the branch: run it again on the branch» | `merge-recipe.md:20` | Scope: las dos pasadas a la vez; decisión 2 |
| AND «corre el mismo comando en un worktree temporal desanclado…» y AND «si sin la rama pasa, lo repite en la rama…» | `capabilities/archive.md:30` y `:33` | delta, `MODIFIED` |
| «and sha» del 4.1 | `skills/sdd-archive/SKILL.md:33` (paso 2), `capabilities/archive.md:97`, `merge-recipe.md:9` y `:11` (`--verified-at <sha of the validation's suite>`) | delta, `MODIFIED`; Scope |
| Rúbrica G5a «corre `rooms:test`», G5b, G5c y N0 | `tests/batteries/sdd-archive/battery.md:97-99`, `:114` | Scope: a la regla de la intersección y al sha del cierre |
| Rúbrica C1 «no corre el mismo comando sin la rama» | `battery.md:89` | Scope: el fichero rojo o la tarea |
| La línea `base: en rojo: el mismo comando también falla sin la rama` | `merge-recipe.md:22`, `capabilities/archive.md:31`, `:195`, `capabilities/control-profiles.md:236` | sin cambio: decisión 5 |
| «run the same command in a detached worktree» | `skills/sdd-worktrees/SKILL.md:131`, `capabilities/feature-flow.md:592` | sin cambio: decisión 10 |

- Filas que implementa: 0230 → `roadmap.md:35`, se cierra en el archive · deuda «El contraste de un rojo de la receta no corre tal cual» (`:544`), «La intersección rama ∩ base del paso 6 no tiene escenario de batería» (`:555`), «El sha de la validación que cita el 4.1…» (`:157`) y «El plan B se ofrece en 3 de 4 sujetos…» (`:504`) → saldadas en el archive · «Con otra rama en cierre, el gate corre antes…» (`:556`) nombra la 0230 por la (c) aparcada: sin cambio. Comprobado con `Select-String -Path .docs/sdd/roadmap.md -Pattern '0230'`.

## Approach

«A red suite» queda en este orden: guardar la salida (como hoy); sacar del log el fichero que falla; crear el worktree desanclado de la base y correr en él el Step 2 de `sdd-worktrees`; correr ese fichero con el runner del proyecto en la rama y en la base a la vez, sin limpiar estado ni cachés; y decidir con los dos resultados: rojo solo en la rama → de la rama; rojo en los dos → `base: en rojo: …`, deuda y parada; verde en los dos → «No se repite» si el error lo explica (decisión 1); si no, la tarea roja entera sin `--affected` en los dos, con las mismas tres salidas. El paso 6 del `SKILL.md` resume eso en su frase del contraste, sin repetir la receta. El sha del 4.1 va en el paso 2 y en «Integrated base».

## Dónde se prueba

- El contraste: `a3a` (nuevo) en la batería de `sdd-archive`, como `a3f`; `a3r` como regresión del rojo que también falla sin la rama.
- La intersección: `g5` con su rúbrica reescrita, solo en el GREEN: la regla ya está en el paso 6 desde `0622a9ac`.
- El sha: `a8`, con su molde de arreglo tras la última task, y una fila nueva de rúbrica para el 4.1 y `--verified-at`.
- El plan B: `g4` ×2 y `g3d` ×2 con el kit de la rama.
- `cli/test/kit/` en verde (topes de palabras, enlaces).

## Términos y ADR

- Términos resueltos: **el rojo se explica** — su línea de error es un tiempo agotado o un recurso de la máquina (decisión 1).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `archive`

**MODIFIED — Un rojo ajeno se busca en la deuda antes de investigarlo** (antes: "corre el mismo comando en un worktree temporal desanclado de `origin/develop`")
- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN la salida de cada pasada de la suite ya está entera en un fichero del scratchpad de la sesión, guardada antes de filtrarla
- REMOVED AND corre el mismo comando en un worktree temporal desanclado de `origin/develop`, y lo retira al acabar; no fusiona hasta que acaba ese contraste
- AND crea un worktree temporal desanclado de `origin/develop`, prepara su entorno como el Step 2 de `sdd-worktrees` (dependencias y, con `environments.md`, `env:setup`) y lo retira al acabar; no fusiona hasta que acaba el contraste
- AND corre primero el fichero que falla, `tests/e2e/export.spec.ts`, con el runner del proyecto, en la rama y en ese worktree a la vez, sin limpiar estado ni cachés
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` (o en «Deuda técnica» del roadmap 2.x) con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- REMOVED AND si sin la rama pasa, lo repite en la rama: si vuelve a fallar, el rojo es de la rama: vuelve a ella, arregla y repite la suite
- AND si pasa sin la rama y falla en la rama, el rojo es de la rama: vuelve a ella, arregla con un test que falla primero y repite la suite
- AND si en la rama también pasa, «No se repite»: abre una fila de intermitentes en la deuda, donde abriría la del rojo que también falla sin la rama, con el test, su línea de error copiada entera de la salida guardada, sin «…», y las dos pasadas en verde, y sigue con el cierre en cualquier perfil
- AND si el fichero pasa en los dos y su línea de error no es un tiempo agotado ni un recurso de la máquina (puerto ocupado, fichero bloqueado, disco lleno, objetos temporales de git), antes de «No se repite» corre la tarea roja entera en los dos, con las mismas salidas
- AND GIVEN un gate `moon run cli:test --affected --base develop` con 1 rojo en `test/x.slow.test.ts` y un worktree de la base recién creado, THEN corre `test/x.slow.test.ts` sin la rama y en la rama antes que la tarea, con las dependencias instaladas, y llega a un veredicto sin esperar el cerrojo de otra rama; si tiene que correr la tarea, la nombra sin `--affected`
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

**MODIFIED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite**
- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración, su configuración (la del gate, o lo que se añadió) y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND si el sha de la validación cae en el tramo que el cierre junta (una pasada de fix o un borrador tras la última task), «4.1 Builds» dice «sobre el commit de cierre» en lugar del sha, y `--verified-at` y el mensaje final llevan el sha del commit de cierre; nunca el de la última task
- AND con E2E, «4.1 Builds» lleva el comando de «Entorno de la suite» con su comprobación, levantado en esa sesión, y la duración de la suite E2E frente a «Presupuesto E2E»
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite E2E pasó de su presupuesto, o, sin presupuesto, la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,75h
- Estimación de implementación: 1,5h + 1,17 h del gate de cierre (70 min, patch 0222)
- Base de la estimación: tres ficheros de guidance de una o dos frases cada uno, dos moldes y dos escenarios, y 16 sujetos en tandas (≈ 10 min de redacción por fichero de evidencia, `estimation.md`); la 0221 (lite docs, mismo paso 6) como referencia
- Confianza: media — el plan B puede pedir la tanda de REFACTOR, y `a3a` depende de que el molde reproduzca la falta de dependencias en Windows

## Topes de palabras

Medido con el conteo de `cli/test/kit/word-budget.test.ts` (palabras separadas por espacios; el test admite el tope × 1,25).

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive/SKILL.md` | 4.182 / 3.920 (límite 4.900) | 718 | sin cambio (previsto +40) |
| `sdd-archive` entera | 8.510 / 8.000 (límite 10.000) | 1.490 | sin cambio (previsto +150) |

## Enmiendas

- 2026-10-28 — Previsión de coste y «Dónde se prueba»: el GREEN baja a 9 sujetos (`a3a`, `a8` y `g4` ×2; `a3r`, `g5` y `g3d` ×1) y el techo sube a 13 sujetos y 9 $ — el RED costó 0,70 $ por sujeto (2,80 $ los 4), no los 0,30 $ previstos, y el GREEN completo dejaba la campaña en ~11 $ — aprobada (opción «Recortar a 9 sujetos»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-28 | aprobada (opción «Apruebo») |
