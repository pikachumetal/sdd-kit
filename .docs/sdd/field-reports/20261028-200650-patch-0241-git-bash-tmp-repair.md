---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261028-200650-patch-0241-git-bash-tmp-repair
task: 0241
mode:
date: 2026-10-28
---

# Ticket para el kit — patch 0241: el hook de arranque del plugin repara el `/tmp` de Git Bash

- Contexto: patch de fallo, perfil `delegate`, validación en campo, Opus 5.5 en el hilo, sin subagentes
- Coste: 0,17 h frente a 0,68 h estimadas (0,5 h + 0,18 h del gate de cierre); 6.335.889 tokens del hilo, 2,99 $ (`sdd session tokens`)
- Nada que reportar

## Menores

- **El worktree no tenía `cli/node_modules` y el primer «RED» fue un error de arranque de Vitest** (`npx vitest run test/hook/git-bash-tmp.test.ts` en Git Bash → `Cannot find package 'vitest' imported from …/cli/vitest.config.ts`), no el fallo del test. Se vio al leer la salida entera; `pnpm install --frozen-lockfile` y el RED se repitió con el módulo apartado. Es otro caso de la fila 0248 («Los carriles patch y config preparan el entorno antes del primer test»), ~3 min.
- **La fila nombraba `cli/src/hook/session-start.ts`, que solo reexporta `cli/bin/session-start.js`**: el arreglo fue al segundo, que es lo que ejecuta el hook, y `patch.md` §2 lo dice. Una fila con «Ficheros» de `sdd-roadmap` que nadie contrastó con el código; ~1 min.
- **La estimación del gate tomó los 11 min del patch 0245 y el gate corrió en 31 s**: `--affected` saltó `kit:test-headless` y `cli:typecheck` salió de caché. `skills/sdd-propose/SKILL.md` paso 2 pide «el último medido en el proyecto», que no depende de qué tareas va a seleccionar el filtro; aquí sobrestimó, sin coste.
