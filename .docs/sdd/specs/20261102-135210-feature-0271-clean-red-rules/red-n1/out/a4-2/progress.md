# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md
## Pre-flight
| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Pares de tasks | Una sola task: sin ficheros ni interfaces compartidos | nada | — |
| Task 1 | Texto contra sí misma y contra la spec | "Produce: los dos cambios" y "fallan sin la guía" contradicen red/h0.txt (limpio) y el Scope de la spec ("si el RED lo exhibe") | La spec manda: solo el aviso del paso 1 |
Task 1: Ruling: la frase del paso 2 no se escribe — h0 salió limpio en el baseline (1 de 1), el Scope la condiciona a que el RED la exhiba y la constitución prohíbe escribir guidance sin fallo previo; el plan decía "los dos cambios" — si es erróneo: añadir una frase tras un RED que falle
Task 1: Ruling: trabajo en el checkout de la rama de la feature sin worktree nuevo — no es main y los RED sin versionar están aquí — si es erróneo: nada, la rama aísla el cambio
Task 1: Ruling: sin Gate de cierre declarado (no hay operations.md ni tech-stack.md) uso el del plan, node --test — si es erróneo: el baseline no cubre lo que el proyecto espera
Task 1: bloqueada — aviso del paso 1 escrito sin commit; humo verde de h1 y h0 sin correr: `claude -p` devuelve "claude anidado bloqueado en un sujeto: run.mjs no ve su coste" (exit 1, 3 de 3 sujetos) y esta sesión no tiene herramienta de subagentes. Falta: h1 con 2 sujetos y h0 con 1 sobre la skill editada; después comparar RED, commit y sdd task done.
