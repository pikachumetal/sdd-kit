---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261029-104828-patch-0258-ci-fixture-moon-workspace
task: 0258
mode:
date: 2026-10-29
---

# Ticket para el kit — patch 0258: moon dentro de una tarea de moon resuelve el workspace de fuera

- Contexto: patch de fallo, perfil delegate, Opus 5.5, sin subagentes
- Coste: 0,25 h frente a 0,7 h estimadas (`sdd session tokens`); 5.023.590 tokens, 2,50 $
- Nada que reportar

## Menores

- La fila 0258 daba el fallo como de Linux y pedía reproducirlo en Linux; la medida lo reprodujo en Windows con la condición de la CI (`MOON_WORKSPACE_ROOT` heredado de la tarea `cli:test-min`), y el cierre de la 0235 lo dio por verde porque la «Verificación de una task» de `tech-stack.md` corre vitest fuera de moon. Un código que lanza moon no ve en la verificación local lo que ve dentro de una tarea de moon — no localizado en el kit (regla del repo, `tech-stack.md` §Testing)
