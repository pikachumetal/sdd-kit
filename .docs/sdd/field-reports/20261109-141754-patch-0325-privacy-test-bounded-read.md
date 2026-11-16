---
kit_version: 2.3.4
lane: patch
id: 20261109-141754-patch-0325-privacy-test-bounded-read
task: 0325
mode:
date: 2026-11-09
---

# Ticket para el kit — patch 0325: el test de privacidad de la evidencia cabe en el hook

- Contexto: patch de fallo, perfil delegate, Opus 5.5 en el hilo y un revisor Sonnet 5.5 (effort medium); `sdd-propose`, `sdd-implement`, `sdd-debugging`, `sdd-tdd`, `sdd-archive`, `add-to-changelog` y `sdd-feedback`.
- Coste: 0,41 h frente a 0,82 h estimadas (`sdd session tokens` en el commit de cierre); 3,70 $ (hilo 3,49 $ y revisor 0,21 $).
- Por iniciativa propia: el RED de un fallo de tiempo fue el mismo fichero con `--hook-timeout 3000` como cota local del `beforeAll` (rojo antes, verde después), y el rojo real con `cli:test-min` entero antes y después del fix; `sdd-tdd` no dice qué forma tiene el RED de un fallo de rendimiento.

## Menores

- Lancé `cli:test-min` en segundo plano para reproducir el rojo y edité los ficheros del test mientras corría; la reproducción valió porque el error citaba la línea 241 del `beforeAll` viejo, pero pudo leer el código nuevo. Ninguna regla dice que la reproducción en segundo plano congela los ficheros que corre — no localizado.
- La primera versión del fix listaba con `git ls-files --others --deleted` y seguía pasando de 3 s con carga: esas dos opciones costaban 0,7 s y 0,4 s. Se midió antes de la segunda versión, en ~5 min — `skills/sdd-debugging/SKILL.md` Fase 3 ya lo cubre (una hipótesis, medir).
- Escribir un script de medida `.mjs` con heredoc en Git Bash lo paró el hook `PreToolUse` del repo y pasé a `Write`: la regla funcionó — `.claude/hooks/`.
