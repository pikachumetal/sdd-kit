---
name: sdd-end-task
description: Usar cuando la implementación de una task está terminada y hay que cerrarla — el usuario dice "cierra la tarea", "hemos acabado", "haz el walkthrough" — o antes de mergear una feature que tiene carpeta en .docs/sdd/specs/. No para patches (eso es sdd-end-patch).
---

# sdd-end-task

## Overview

El cierre de una task es una **Definition of Done**: un checklist que garantiza que la documentación del proyecto no se desactualiza y que el bucle de mejora se cierra. **Cerrar = ejecutar TODO el checklist**, no solo constatar que el código está.

**Violar la letra del checklist es violar su espíritu.** Si saltas un paso "porque esta task es pequeña" o "porque hay prisa", es exactamente cuando los docs empiezan a divergir.

## Checklist de cierre (crea un todo por paso)

0. **Pre-check de coherencia** — ¿la spec está aprobada (`status: approved`, aprobaciones firmadas)? Si no, SEÑÁLALO al usuario antes de continuar: cerrar sobre una spec en draft es una anomalía que debe aceptarse explícitamente y quedar anotada en el walkthrough. ¿El usuario ha **validado el trabajo** — ha dicho **qué probó él y que funciona**? «Cierra la tarea», «está implementada» o una `review-final.md` limpia NO lo son: son la orden de cerrar. Si no hay validación, PARA antes de tocar nada: presenta qué hay, cómo probarlo y tu smoke, y pregunta qué ha probado. Con el usuario ausente, este checklist no arranca y la task queda EN ESPERA. Un «Validado por el dev-lead» en el walkthrough que el dev-lead no ha dado es una invención, no un registro.
   **Lee `mode:` en el frontmatter de `spec.md`** (sin campo = `full`). En modo `lite` no existen `plan.md` ni `tasks.md`: no los reclames y salta el paso 6. Todo lo demás del checklist se aplica igual — el modo abarata los artefactos de planificación, nunca la verificación.
1. **`walkthrough.md`** — calcando `walkthrough-template.md` del skill `sdd-templates`. En la verificación, distingue siempre **verificado por ti** (con la evidencia) de **reportado por el usuario**. Sin verificación documentada no hay cierre.
2. **Tiempo real** *(si existe `.docs/sdd/estimation.md`)* — estimado vs real en el walkthrough; nunca en
   blanco. Umbral de desviación y qué hacer si no lo sabes: [estimation.md](references/estimation.md).
3. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — el walkthrough registra, el log acumula:
   sin fila no hay calibración. Cómo generarlo: [estimation.md](references/estimation.md).
4. **Aprendizajes → docs vivos** — cada aprendizaje del walkthrough se vuelca donde vive. Destino por tipo
   de aprendizaje: [aprendizajes-skills.md](references/aprendizajes-skills.md).
5. **Revisión de skills** — "no aplica" se decide mirando, no por omisión.
   Cómo: [aprendizajes-skills.md](references/aprendizajes-skills.md).
6. **`tasks.md`** *(solo modo full, y solo si el plan tuvo >1 task)* — todas las filas con status final y commit hash. Si encuentras discrepancias entre `tasks.md` y la realidad, corrígelas y déjalo anotado.
7. **Changelog** *(si existe `.docs/sdd/changelog.md`)* — entrada vía `add-to-changelog`.
8. **`roadmap.md`** — marcar el módulo/tarea. El estado ✅ exige verificación documentada en el walkthrough. Deuda descubierta → fila en la tabla de deuda técnica.
9. **Code-review** *(solo si la task se ejecutó **en línea**)* — `superpowers:requesting-code-review` antes de darla por cerrada. Con el default del kit no hace falta: `subagent-driven-development` ya revisa cada task y lanza la revisión final de la rama. Este paso cubre únicamente el camino que se salta esas revisiones.
10. **Rama** — *(si existe `.docs/sdd/environments.md`)* `env:clean` **ANTES** de invocar `finishing-a-development-branch`: borrar un worktree con el entorno vivo deja contenedores huérfanos secuestrando puertos. Luego `superpowers:finishing-a-development-branch`: verificar estado y decidir merge/PR **con el usuario**.
11. **Ticket para el kit** — ofrece generar el ticket de mejora del kit con `sdd-feedback` en esta misma sesión: al limpiar el contexto se pierde lo aprendido sobre el kit. No es un gate — sin respuesta, el cierre termina y no queda nada pendiente ni anotado. Si esta sesión ya generó su ticket, no se ofrece otra vez.

## Para patches

Este checklist NO aplica: el cierre ligero de un patch es `sdd-end-patch`.

## Red flags — STOP, no has cerrado

- Vas a mergear sin `walkthrough.md`.
- El tiempo real está en blanco, o el estimation-log no tiene la fila de esta task (con el módulo de estimación activo).
- No has abierto `.claude/skills/` — la revisión de skills no se hace de memoria.
- No has tocado `roadmap.md`.
- La spec sigue en `draft` y no se lo has señalado al usuario.
- Has escrito en `tech-stack.md`, `architecture.md` o `environments.md` un valor que ya está en `capabilities/` (un tiempo, un límite, una cuota).

| Racionalización | Realidad |
| --- | --- |
| "El usuario me ha pedido cerrar: eso ya es validar" | Pedir el cierre es una orden, no una prueba. Validar es que diga qué probó y que funciona. Sin eso, el checklist no arranca; con el usuario ausente, la task espera. |
| "Es una task lite, el cierre también va ligero" | Lite abarata la planificación, no la verificación. Smoke, walkthrough con tiempo real, changelog y roadmap siguen siendo obligatorios. Lo único que desaparece es lo que nunca existió: `plan.md` y `tasks.md`. |
| "El usuario tiene prisa: walkthrough mínimo y listo" | El checklist entero cabe en minutos. Lo que se salta hoy es la deriva de docs de mañana. |
| "El aprendizaje ya está en el walkthrough" | El walkthrough es un registro muerto para las próximas tareas; los docs vivos son constitution/architecture/tech-stack. |
| "Este proyecto no tiene skills, me salto ese paso" | Se mira `.claude/skills/`, no se asume. Quizá esta task crea la primera. |
| "El plan pide documentar los tiempos en tech-stack" | El anclaje dice dónde está la constante y enlaza la capacidad; el valor vive solo en `capabilities/`. Dos copias divergen en el primer `MODIFIED`. |
| "El tiempo quedó en el walkthrough, con eso basta" | Sin fila en el log no hay factor de calibración. El log es lo que convierte tiempos sueltos en estimaciones defendibles. |
