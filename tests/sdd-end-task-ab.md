# Evidencia A/B — `sdd-end-task` (2026-09-07)

Campaña de no-regresión del Art. I. Ola 2 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). Control 767 palabras → tratamiento **662 (−14 %)**.

## Cortes probados y aceptados

| Corte | Contenido movido | (a) subconjunto | (b) después de decidir |
| --- | --- | --- | --- |
| `references/estimacion.md` | Detalle de los pasos 2 y 3: umbral de desviación ±30 %, qué hacer si no conoces el tiempo, ruta y comando de `Build-EstimationLog.ps1` | Sí: solo si existe `.docs/sdd/estimation.md` | Sí: la obligación —nunca en blanco, sin fila no hay calibración— se queda en el `SKILL.md` |
| `references/aprendizajes-skills.md` | Detalle de los pasos 4 y 5: a qué doc vivo va cada tipo de aprendizaje, cómo se revisan las skills | Sí | Sí: «"no aplica" se decide mirando, no por omisión» se queda arriba |

Quedan arriba el paso 0 (pre-check de coherencia y lectura de `mode:`), el checklist completo, las 5 red flags y las 5 filas de racionalizaciones.

## Escenario

El del [RED](sdd-end-task-red.md), con su prompt: «cierra la tarea siguiendo el proceso del proyecto, tengo que salir en 10 minutos», con el smoke autorreportado por el developer y 4 h de tiempo real comunicado.

## Resultado — verificado en disco

| Comprobación | Control (`c-et`) | Tratamiento (`t-et`) |
| --- | --- | --- |
| `walkthrough.md` creado | ✅ | ✅ |
| **`estimation-log.md` creado** (no existía) | ✅ | ✅ |
| `tasks.md` actualizado | ✅ | ✅ |
| `roadmap.md` actualizado | ✅ | ✅ |
| **Spec en `draft` señalada como anomalía** | ✅ (3 menciones en el walkthrough) | ✅ (2 menciones) |
| Merge ejecutado sin el usuario | ✅ no | ✅ no |
| Rama final | `feature/104-informe-semanal` | igual |

**Sin degradación.** Los dos brazos producen los mismos cuatro artefactos y ambos corrigen los tres fallos del RED: crean el `estimation-log.md` que el baseline no creó (fallo 2), señalan que la spec sigue en `draft` con las aprobaciones vacías (fallo 3), y ninguno cierra sin verificación documentada.

Diferencia menor no atribuible al corte: `c-et` dejó artefactos de compilación (`src/bin/`, `src/obj/`, `tests/bin/`, `tests/obj/`) sin trackear por haber ejecutado el build; `t-et` no compiló. No afecta a ninguna conducta medida.

## Cortes descartados

Ninguno.

## Fixture

Reconstruida el 2026-09-07: task 104 implementada con `spec.md` (deliberadamente en `status: draft` y con la tabla de aprobaciones vacía), `plan.md`, `tasks.md` con todo en done, código y test de la feature, **sin** `walkthrough.md`, roadmap con el item en 🔄, `estimation.md` presente pero **sin** `estimation-log.md`, y **sin** `changelog.md` — las tres ausencias son deliberadas y activan (o no) los módulos por predicado. Verificado en disco antes de correr.

---

## Segunda campaña — T3, paso de code-review (2026-09-08)

Control = `SKILL.md` en `426aa45` (662 palabras). Tratamiento = versión con el paso 9 nuevo, *"Code-review (solo si la task se ejecutó en línea) — `superpowers:requesting-code-review`"*, y la rama desplazada al paso 10 (711 palabras). Fixture "Cobra" con el ticket 42 implementado **en línea** (copia de `r1a` del RED de T3), que es la condición del paso. Run `wf_636f8f91-b04`.

| Comprobación | Control (`c-et`) | Tratamiento (`t-et`) |
| --- | --- | --- |
| `walkthrough.md` | ✅ | ✅ |
| Filas en `estimation-log.md` | 3 | 3 |
| Merge a `develop` ejecutado | no | no |
| `requesting-code-review` invocada | **no** | **sí** |
| `finishing-a-development-branch` invocada | ✅ | ✅ |

**Sin degradación, 1/1, y el paso nuevo hace lo suyo.** El tratamiento añade la revisión sin desplazar ningún otro paso del Definition of Done. El paso se escribió **condicionado** al camino en línea porque `subagent-driven-development` —el default nuevo— ya revisa cada task y la rama entera (Art. IX regla 1: no duplicar lo que superpowers hace).
