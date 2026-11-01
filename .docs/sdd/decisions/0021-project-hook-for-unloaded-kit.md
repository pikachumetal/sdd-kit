---
status: accepted
date: 2026-11-01
rutas:
  - hooks/project/**
  - cli/bin/session-start.js
  - cli/src/init/project-hook.ts
---

# El aviso de kit no cargado vive en un hook copiado al proyecto

## Contexto y problema

Una sesión puede arrancar sin el plugin del kit y nadie lo dice. Medido el 2026-11-01 con Claude Code 2.1.316: el hook del plugin no corre sin el plugin, y la entrada de un hook no trae la lista de skills. En SessionStart, el hook del plugin y el del proyecto corren a la vez.

## Opciones consideradas

- Solo en el hook del plugin: no corre justo en el caso que hay que avisar.
- Hook del proyecto que lee `installed_plugins.json` o el transcript: formatos sin documentar.
- Hook del proyecto que lanza `claude plugin list`: dice qué hay instalado, no qué cargó la sesión.
- Hook del proyecto en `UserPromptSubmit` que mira una marca escrita por el hook del plugin.

## Decisión

La última: es lo único que observa si esta sesión cargó el plugin, con interfaces documentadas salvo la ruta de la caché, que solo se usa para dar la ruta del aviso.

### Consecuencias

- Cada proyecto lleva un fichero y una entrada más, y arranca node en cada mensaje (~66 ms en Windows).
- La copia solo cambia con una migración: la ruta de la marca, su `.warned` y la validación del id son un contrato con las copias ya desplegadas.
- No detecta el plugin cargado sin skills (`--disable-slash-commands`, `skillOverrides`).

### Confirmación

`keeps the marker path the deployed copies look at` en `cli/test/hook/project-hook.test.ts` fija el literal; cambiarlo a sabiendas pide una migración.
