---
kit_version: 2.3.4
lane: patch
id: 20261109-124833-patch-0294-rule-form-after-failed-green
task: 0294
mode:
date: 2026-11-09
---

# Ticket para el kit — patch 0294: un olvido de orden o de búsqueda se comprueba con su orden

- Contexto: patch (petición cerrada), perfil `delegate`, Opus 5.5 en el hilo, un revisor Sonnet 5.5 con effort medium
- Coste: 0,16 h frente a 0,37 h estimadas (`sdd session tokens`); 3,29 $ de sesión (hilo 3,02 $, revisor 0,27 $)
- Nada que reportar

## Menores

- `node dist/cli/bin/sdd.js roadmap check --path .docs/sdd/roadmap.md` en Git Bash sale con 0 y «Sin roadmap que validar»: con la ruta del fichero en vez de la carpeta, el check pasa sin validar nada; la carpeta (`--path .docs/sdd`) es la forma que pide `records.md` — `cli/` (verbo `roadmap check`)
- La constitution estaba justo en su tope (2.250 de 2.250, sin margen desde la feature 0284): el primer borrador de la viñeta cupo quitando la definición «cumple, pero falta…», y el revisor lo dio Important; una ronda, ~5 min — `cli/test/kit/word-budget.test.ts`
- El hook del repo denegó un `.mjs` del scratchpad escrito con heredoc en Bash; reescrito con `Write` a la primera — `.claude/hooks/` del repo, no del kit
