---
name: sdd-end-task
description: Usar cuando la implementación de una task está terminada y hay que cerrarla — el usuario dice "cierra la tarea", "hemos acabado", "haz el walkthrough" — o antes de mergear una feature que tiene carpeta en .docs/sdd/specs/. No para hotfixes (eso es sdd-end-hotfix).
---

# sdd-end-task

## Overview

El cierre de una task es una **Definition of Done**: un checklist que garantiza que la documentación del proyecto no se desactualiza y que el bucle de mejora se cierra. **Cerrar = ejecutar TODO el checklist**, no solo constatar que el código está.

**Violar la letra del checklist es violar su espíritu.** Si saltas un paso "porque esta task es pequeña" o "porque hay prisa", es exactamente cuando los docs empiezan a divergir.

## Checklist de cierre (crea un todo por paso)

0. **Pre-check de coherencia** — ¿la spec está aprobada (`status: approved`, aprobaciones firmadas)? Si no, SEÑÁLALO al usuario antes de continuar: cerrar sobre una spec en draft es una anomalía que debe aceptarse explícitamente y quedar anotada en el walkthrough.
1. **`walkthrough.md`** — calcando `.docs/sdd/templates/walkthrough-template.md`. En la verificación, distingue siempre **verificado por ti** (con la evidencia) de **reportado por el usuario**. Sin verificación documentada no hay cierre.
2. **Tiempo real** *(si existe `.docs/sdd/estimation.md`)* — estimado vs real en el walkthrough; si la desviación supera el ±30%, la causa es obligatoria. ¿No conoces el tiempo? Pregunta, y si no hay respuesta, aproxima y márcalo como aproximado — nunca en blanco.
3. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — si el proyecto tiene `tools/sdd/Build-EstimationLog.ps1`, ejecútalo (`pwsh -NoProfile -File tools/sdd/Build-EstimationLog.ps1`). Si no, añade la fila a mano en `.docs/sdd/estimation-log.md` (créalo si no existe): task, tipo, estimado, real, ratio. El walkthrough registra; el log acumula — sin fila no hay calibración.
4. **Aprendizajes → docs vivos** — cada aprendizaje del walkthrough se vuelca donde vive: convención nueva → `constitution.md`; cambio estructural → `architecture.md`; versión/herramienta → `tech-stack.md`. Un aprendizaje que se queda solo en el walkthrough se pierde para las próximas tareas.
5. **Revisión de skills** — abre `.claude/skills/` del proyecto y decide: ¿este trabajo reveló un patrón reutilizable (nueva skill), o desmintió algo que una skill afirma (actualizarla)? Usa `superpowers:writing-skills` si toca. "No aplica" se decide mirando, no por omisión — y si el proyecto aún no tiene skills, quizá esta task crea la primera.
6. **`tasks.md`** — todas las filas con status final y commit hash. Si encuentras discrepancias entre `tasks.md` y la realidad, corrígelas y déjalo anotado.
7. **Changelog** *(si existe `.docs/sdd/changelog.md`)* — entrada vía `add-to-changelog`.
8. **`roadmap.md`** — marcar el módulo/tarea. El estado ✅ exige verificación documentada en el walkthrough. Deuda descubierta → fila en la tabla de deuda técnica.
9. **Rama** — `superpowers:finishing-a-development-branch`: verificar estado y decidir merge/PR **con el usuario**.

## Para hotfixes

Este checklist NO aplica: el cierre ligero de un hotfix es `sdd-end-hotfix`.

## Red flags — STOP, no has cerrado

- Vas a mergear sin `walkthrough.md`.
- El tiempo real está en blanco, o el estimation-log no tiene la fila de esta task (con el módulo de estimación activo).
- No has abierto `.claude/skills/` — la revisión de skills no se hace de memoria.
- No has tocado `roadmap.md`.
- La spec sigue en `draft` y no se lo has señalado al usuario.

| Racionalización | Realidad |
| --- | --- |
| "El usuario tiene prisa: walkthrough mínimo y listo" | El checklist entero cabe en minutos. Lo que se salta hoy es la deriva de docs de mañana. |
| "El aprendizaje ya está en el walkthrough" | El walkthrough es un registro muerto para las próximas tareas; los docs vivos son constitution/architecture/tech-stack. |
| "Este proyecto no tiene skills, me salto ese paso" | Se mira `.claude/skills/`, no se asume. Quizá esta task crea la primera. |
| "El tiempo quedó en el walkthrough, con eso basta" | Sin fila en el log no hay factor de calibración. El log es lo que convierte tiempos sueltos en estimaciones defendibles. |
