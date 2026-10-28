---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261028-212154-patch-0239-watch-ignores-moon-heartbeat
task: 0239
mode:
date: 2026-10-28
---

# Ticket para el kit — patch 0239: `sdd watch command` no cuenta el latido de moon como actividad

- Contexto: patch (fallo con causa raíz), Opus 5.5, sin subagentes, perfil `delegate`, `validation.mode: field`
- Coste: 0,09 h de reloj frente a 0,5 h + 0,18 h del gate estimadas (`sdd session tokens`); gate de cierre 1 min 55 s; 1,52 $ de hilo a mitad del cierre
- Nada que reportar

## Menores

- El worktree no tenía `node_modules`: la primera corrida del RED (`npx vitest run test/watch/loop.test.ts`, Git Bash) falló con `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vitest'`, y `pnpm install` lo arregló en 2 s; `sdd-start-patch` no tiene paso de preparar el entorno, que sí hace `sdd-worktrees` en una feature (ya en el roadmap, fila 0248) — `skills/sdd-start-patch/SKILL.md` paso 1
- La fila de deuda «El vigía de una verificación lenta sigue vivo tras acabar el comando» estaba triada como «Actuar → 0239», pero el enunciado de la 0239 solo arregla el latido; la cerré como `parcial` con lo que queda, sin regla del kit que diga qué hacer con un «Actuar → <id>» que la tarea no cubre — `skills/sdd-archive/references/records.md`, no localizado el paso
- El primer RED esperaba la promesa del vigía antes de mirar su salida y falló por timeout de 5 s en vez de por aserción; lo reescribí para que fallara con `Received: undefined` — no localizado
