---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261028-220952-patch-0254-campaign-cleanup-kit-copy
task: 0254
mode:
date: 2026-10-28
---

# Ticket para el kit — patch 0254: la limpieza de una campaña para también los procesos de la copia del kit

- Contexto: patch de fallo (`solution: causa raíz`), perfil `delegate`, Opus 5.5 en el hilo, sin subagentes
- Coste: 0,10 h de reloj frente a 0,51 h estimadas (0,5 h + 0,01 h del gate); 4.427.961 tokens del hilo, 2,60 $ (`sdd session tokens`); el gate de cierre, 150 s aparte
- Nada que reportar

## Menores

- La fila 0254 fijaba «busca también los que nombran la copia del kit»; buscada a secas, habría parado los `claude --plugin-dir <copia del kit>` de los sujetos en curso. Lo acoté a `<copia>/cli/bin/sdd.js` y a cuando no queda ningún sujeto en curso, como decisión `sin el dev-lead` en `patch.md` §3 (~2 min). El triaje que escribe la solución de una fila no comprueba a qué más alcanza — `skills/sdd-roadmap/SKILL.md` (triaje de un ticket)
- `kit:test-headless` tardó 144,63 s en el gate de cierre (`Duration` de su salida), frente a los «~60 s desde la 0238» que dice `tech-stack.md` §Testing del repo, con otros dos worktrees abiertos — no localizado en el kit
