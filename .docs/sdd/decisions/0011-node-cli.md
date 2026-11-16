---
status: accepted
date: 2026-10-08
rutas:
  - cli/**
  - hooks/hooks.json
---

# Una CLI `sdd` en Node, sin build ni dependencias

## Contexto y problema

El código ejecutable del kit estaba en tres lenguajes: 12 scripts PowerShell, el hook de sesión en bash y los bash de superpowers que el kit usa en las tasks Native. Cada proyecto consumidor necesitaba `pwsh` instalado para que el cierre de una feature funcionara, y dos tickets de campo vinieron de lanzar bash desde PowerShell en Windows (el `bash` de WSL, y una salida vacía que dejaba la task sin registrar). El 2026-09-25 `architecture.md` descartó portar los scripts a Node porque lo lento de la suite era crear procesos en Windows, no el lenguaje; ese criterio medía la velocidad de la suite y no el coste de un lenguaje más en cada proyecto. La 3.0.0 quiere lo mecánico en una CLI (principio 4), y la 0147 necesita los bash de superpowers como código propio.

## Opciones consideradas

- Mantener PowerShell: la decisión del 2026-09-25 se tomó por la velocidad de la suite, no por esto. Deja `pwsh` en cada proyecto, tres lenguajes y los dos tickets de campo.
- JavaScript plano con `node:test`: sin tipos, y quien edita el kit prefiere TypeScript. `node:test` valdría, pero los tests no viajan al proyecto y no hay razón para limitarlos.
- Bun: un runtime más que instalar en cada proyecto, cuando Node ya es lo habitual.
- TypeScript con paso de compilación y `dist/` commiteado: dos ficheros por módulo en el plugin, uno de ellos generado y a punto de desfasarse del fuente.

## Decisión

Una sola CLI, `sdd`, en `cli/` dentro del plugin: TypeScript que Node ≥ 22.18.0 ejecuta sin compilar (type stripping, solo sintaxis que se borra), sin `dependencies` y con módulos `node:*`. El plugin lleva el mismo fichero que se edita. `typescript` y `vitest` son `devDependencies` del repo y no viajan. `bin/sdd.js` es JS plano y comprueba la versión de Node antes de cargar nada. El hook de sesión es un verbo de la CLI, declarado en `hooks/hooks.json` en forma exec. Las skills invocan los verbos con `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js"`.

El repo se desarrolla con proto, pnpm y moon, que fijan Node 26, y la suite de la CLI corre también con Node 22.18.0.

### Consecuencias

- Node ≥ 22.18.0 es dependencia obligatoria de los proyectos y `pwsh` deja de serlo. Sin Node, Claude Code enseña el error del hook y las skills no ejecutan sus verbos.
- Se retira el canal `npx skills add`: instala solo `skills/`, sin `cli/`, y allí `${CLAUDE_PLUGIN_ROOT}` no existe.
- El Art. X de la constitution rige el código de la CLI; los Pester que quedan (frases y anatomía de skills) siguen hasta la 0152.
- Los proyectos con el kit anterior se migran con la nota de la 3.0.0 (0144).

### Confirmación

`cli/test/docs-claims.test.ts` comprueba que las skills y las capacidades solo nombran verbos y opciones que existen, y que ninguna cita un `.ps1` retirado. `moon run cli:test-min` ejecuta la suite con Node 22.18.0.
