---
id: 20260923-145338-task-0042-merge-script
title: Tasks — La receta de merge del cierre como script con cerrojo
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — La receta de merge del cierre como script con cerrojo (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0042`

| Task | Estado | Commit | Notas |
| --- | --- | --- | --- |
| 1 — `Invoke-SddMerge.ps1` | done | `7bd8aa2` | tests del hilo sin commitear: el pre-commit rechaza la suite en rojo, así que viajan en el commit de la implementación (como en la 0009); review limpia, 1 Important aparcado con ruling (`noFf: false` + fast-forward) |
| 2 — La receta invoca el script (RED→GREEN) | done | `529fcab` | en línea; RED 2/2 sin fetch, GREEN 2/2 + control de denegación 1/1 |
