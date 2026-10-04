# RED/GREEN — la plantilla de `sdd-grilling` de 1 a N (patch 0132)

**Qué se prueba.** Una sola llamada `claude -p --model opus --setting-sources ""` por muestra, con `--append-system-prompt` = el `SKILL.md`: el de `develop` (plantilla 🅰️ 🅱️) o el del patch (plantilla 1️⃣ … N). Se ejecuta en una carpeta con un `tech-stack.md` de `salas` (Node 22, CLI, reservas en memoria, orden sala-día-franja). El mensaje pide la pregunta de diseño que le harías al usuario. Fecha: 2026-10-03.

**Las salidas** están en `.docs/sdd/specs/20261003-113240-patch-0132-grilling-template-count/micro/out/`. Se cuentan los iconos de alternativa de cada una (🅰 🅱 🅲 1️⃣–5️⃣ 🔀) y se leyeron a mano las de exportar.

**Por qué en Opus.** El fallo que vio el dev-lead salió del agente en Opus. Con Sonnet, el micro-test m4 de la 0128 no lo reprodujo (0 de 6).

| Mensaje | n | `develop` (🅰️ 🅱️) | Patch (1️⃣ … N) |
| --- | --- | --- | --- |
| p3 · formato de exportación para hojas de cálculo, calendarios, scripts o leerlas sin más | 12 + 12 | dos alternativas más 🔀 en 3 de 12 (p3-3, p3-9, p3-12); solo dos, sin mezcla, en 1 (p3-6); los tres formatos en 8 de 12; en p3-2 «recomiendo 🔀» sin haberla listado | dos más 🔀 en 0 de 12; CSV, JSON y iCal en 12 de 12; la mezcla CSV + .ics como alternativa numerada en 6; la recomendada es 1️⃣ en 12 de 12 |
| p2 · orden de los argumentos de `mover` (un solo camino: sala-día-franja) | 12 + 12 | lo dice y lo confirma en 10 de 12 | 9 de 12; las otras proponen `--a <franja-nueva>`, defendible |
| p1 · dónde guardar las reservas (JSON o SQLite) | 4 + 4 | 2 alternativas en 4 de 4 | 2 alternativas en 4 de 4 |

**Lectura.**
- El molde de dos en la plantilla produce el «dos más una híbrida» en 1 de cada 4 preguntas con varias opciones reales. Con el molde de 1 a N, en ninguna.
- El camino único no cambia: 10 frente a 9 de 12 está dentro del ruido.
- p1 no discrimina: las dos versiones ven dos opciones reales.
