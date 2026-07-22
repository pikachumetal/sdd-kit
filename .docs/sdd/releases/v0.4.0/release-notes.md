---
release: v0.4.0
title: sdd-kit v0.4.0 — nombres más claros y mejor encaje con worktrees
created: 2026-07-22
---

# sdd-kit v0.4.0 — nombres más claros y mejor encaje con worktrees

*2026-07-22*

## Resumen

Esta versión afina el kit para el trabajo real con git-flow y varios agentes en paralelo. El carril rápido para bugs deja de llamarse "hotfix" (que se confundía con la rama `hotfix/` de git-flow) y pasa a llamarse **patch**. Y la guía de arranque deja de dar a entender que los worktrees "no aplican": ahora los respeta con naturalidad.

## Novedades

- **Para quien arregla bugs rápidos**: el carril ligero ahora se llama **`sdd-start-patch`** / **`sdd-end-patch`** (antes `sdd-start-hotfix` / `sdd-end-hotfix`). El registro que genera es `patch.md` y su carpeta lleva prefijo `patch-`. El motivo: "hotfix" chocaba con la rama `hotfix/` de git-flow y hacía pensar que un fix rápido *tenía* que salir de una rama hotfix. No es así: un patch puede salir como `feature/` o `hotfix/` según tu git-flow — el carril describe *cuánto proceso*, no *de dónde ramificas*.

- **Para quien trabaja con worktrees (varios agentes en paralelo)**: al arrancar una tarea, la guía ya no sugiere que los worktrees queden fuera del flujo. Ahora es explícita: el kit no gestiona tus worktrees, pero respeta el git-flow de tu proyecto, worktrees incluidos. Si tu proyecto los usa para aislar tareas, ya no hay fricción ni mensajes contradictorios.

## Problemas conocidos

- **El cambio de nombre no es automático en tus tareas ya empezadas**: los registros `hotfix.md` que ya tengas en disco se quedan como están (es correcto: así se llamaban). Solo las tareas nuevas usan `patch`.

## Fuera de alcance de esta entrega

- La distribución al equipo (que esta versión se instale con `/plugin marketplace update`) **no está disponible todavía**: el kit aún no tiene un repositorio remoto configurado. Hasta que lo tenga, esta versión vive en el repositorio de trabajo pero no se puede instalar centralizadamente.
- El recorte de las skills más largas queda para una versión futura.

## Próximos pasos

- Por nuestra parte: decidir dónde alojar el kit (repositorio remoto) para poder distribuir esta y las dos versiones anteriores al equipo.
- Por vuestra parte: cuando empecéis un fix rápido, usad `sdd-start-patch` en lugar del nombre antiguo.
