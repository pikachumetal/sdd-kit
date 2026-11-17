---
id: 20260922-154013-task-0029-release-replan
task: 0029
title: Walkthrough — Replanificar la release en curso
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Replanificar la release en curso

## 1. Cambios realizados

- `skills/sdd-start-release/SKILL.md` (`1c46095`, retocado en `42945a2`): sección «Replanificar la release en curso» con cuatro pasos —estado real leyendo el roadmap de la rama de integración y el de cada rama `feature/*`; ni la fila ni la spec de una task en marcha se tocan; ids mayores que el del script y que cualquier id leído; reserva publicada con un commit que solo toca `roadmap.md` en la rama de integración, antes de arrancar nada—, tres red flags y tres racionalizaciones.
- `tests/release-replan-red.md` y `tests/release-replan-green.md` (`fde3245`, `1c46095`, `42945a2`, `bc18b96`): evidencia de los siete sujetos, con los moldes y sus salidas en `red/` y `green/` de esta carpeta.
- `spec.md` y `plan.md` (`fde3245`): cuatro requisitos ADDED de `release-flow` y una task en línea.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: ~1,4h (spec y plan ~1,5h aparte, con el RED de tres rondas dentro)
- Desviación: −0,1h (−7%)
- Causa de la desviación: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Ninguna sobre la spec aprobada. La sección quedó donde decía el plan y no se tocaron `roadmap-fuente.md`, `Get-NextSddId.ps1` ni las skills de task.

### Decisiones tomadas sin el dev-lead

- **Tres rondas de RED en vez de una** — el molde del escenario pedido daba a los sujetos una salida que el caso de campo no tenía (la spec del molde excluía «fin por número de repeticiones»), así que se añadieron la ronda de triaje de notas y la de worktree con base vieja. Coste si está mal: 2,8 $ de sujetos y media hora.
- **Lo nuevo para una task en marcha va a una task nueva «tras ella»**, no a la «sección de entrada» que proponía la fila del roadmap — esa sección obligaba a tocar `sdd-start-task` o `sdd-end-task`, ficheros calientes de otras tasks. Coste si está mal: el roadmap gana filas dependientes en vez de una sección de entrada; se revierte con una task de una línea.
- **La salida «worktree temporal» del paso 4 se queda sin GREEN** — ningún molde tenía la rama de integración fuera de un worktree y el presupuesto de la campaña estaba agotado (11,83 de 12 $). Se concretó su redacción tras la revisión final y pasa a deuda. Coste si está mal: un agente improvisa dónde crear ese worktree y repite el `Filename too long` del ticket 0005 §2.
- **El commit `bc18b96` (2 líneas de docs) se revisó leyendo el diff en el hilo**, sin subagente: es literalmente el arreglo que prescribió la re-revisión. Coste si está mal: ninguno medible; es texto de dos ficheros de evidencia.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output None -PassThru"`: 292 passed, 0 failed (ejecutada tras cada commit; la última, tras `bc18b96`).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «ya sabes sdd-kit es delegado, end-task» · disparador: uso diario del kit 1.2.0 por el dev-lead.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED, 6 sujetos sobre tres moldes | E4 falla 6/6, E3 3/4, E2 3/6, E1 2/2 solo con base vieja ([evidencia](../../../../tests/release-replan-red.md)) |
| 2 | GREEN, 6 sujetos con la primera redacción | E1, E2 y E4 en verde; E3 falla en s2, que lista las ramas sin abrir su roadmap |
| 3 | GREEN, 1 sujeto tras reforzar el paso 1 | los cuatro frentes en verde; empieza en el `0009` citando la reserva sin fusionar de `feature/0006` |
| 4 | Revisión final de rama (Sonnet) | aprobada con cambios, sin Critical: dos Important sobre la salida «worktree temporal» |
| 5 | Re-revisión del fix (Sonnet) | un Important: el plan daba por escrita una fila de deuda que no existía; corregido en `bc18b96` |
| 6 | Suite Pester | 292/0 |

### 4.3 Residuales / deuda generada

- La salida «worktree temporal» del paso 4 no tiene GREEN: fila nueva en la tabla de deuda del roadmap.
- Triaje agrupado con tabla hallazgo → destino (punto 4 de la fila 0029): 4/4 sujetos lo hicieron bien sin guidance. A deuda como posible falso negativo.
- Reordenar las olas comprobando los ficheros calientes (punto 5 de la fila 0029): ningún escenario lo mide. A deuda sin evidencia.

## 5. Aprendizajes

- **Un escenario pedido puede traer su propia salida**: la spec del molde decía «No entra: fin por número de repeticiones», y con eso 4/4 sujetos acertaban sin guidance. El fallo de campo solo apareció al quitar esa línea y al situar al sujeto en un worktree con base vieja → `tech-stack.md`, «Fixtures y baselines».
- **Un fallo de campo puede ser de base, no de criterio**: el trabajo añadido a tasks cerradas (`82c2b53`) no salió de ignorar el estado, sino de leer el roadmap del propio worktree. Con `git show develop:…` delante, 2/2 sujetos acertaron → el requisito «Replanificar parte del estado real de la release» de [`release-flow`](../../capabilities/release-flow.md).
- **Listar ramas no es leerlas**: s2 ejecutó `git branch --all` y dio el paso por hecho. La redacción que funcionó nombra el comando por rama y dice por qué no basta la lista → `sdd-start-release/SKILL.md`, paso 1 y su racionalización.
- **Un techo de presupuesto deja huecos declarados, no ocultos**: la salida sin GREEN se documenta en la evidencia, en el plan y en la deuda, no se da por probada → `tests/release-replan-green.md`, sección «Sin GREEN».

## 6. Adendas
