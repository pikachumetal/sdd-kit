# Tasks — feature 0297

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — RED de `rm1`, `rm2` y `rm3` con el kit de `HEAD` | hecha · afectada por enmienda 2026-11-08 → Task 3 | 08d5eb29 |
| 2 — OpenSpec e impeccable al día en `upstream.json` | hecha | ver git log |
| 3 — enmienda 2026-11-08: la regla 3 con `rm2b`, y RM2 | hecha: RED limpio, la regla 3 no entra | ver git log |

Revisión final: Spec opus+high, con fixes (3 Minor, 5 sin verificar) · Código sonnet+high, con fixes (1 Important, 5 Minor) · Arquitectura no (plan), sobre 13888288
Pasada de fix: juntada en el cierre, 1 Important re-medido con rm2b (RM2b 2/2) y 5 Minor; 4 adjudicados con ruling y 1 a la parada (THEN del ADDED 2)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia salvo el desvío del THEN del ADDED 2 (a ✋, aprobado: «1»)

## Rulings

- Task 1: Ruling: la fila RM3h iba al revés (`presente` = «falla si está») y su regex no casaba `git show <sha> -- .docs/sdd/capabilities/` — pasa a `ausente` con `capabilities\/` y se vuelve a dar el veredicto sobre las mismas salidas — si es errónea, RM3 mide de más y el RED de la regla 2 sería falso limpio (los dos informes leídos a mano sí recuperan el vigente)
- Task 1: Ruling: enmienda 2026-11-08 aprobada («1») — Task 2 solo upstream.json; Task 3 nueva para rm2b y RM2
- Task 2: Ruling: `npx vitest` da MODULE_NOT_FOUND desde cli/ en este worktree; la verificación corre con `pnpm exec vitest`, el mismo binario de node_modules — si es errónea, ninguno: mismo vitest
- Task 3: Ruling: rm2b sin fixtures nuevos — la base es app-rm.js y la rama no toca src/ (solo el test), en vez de app-rm2b-base.js y app-rm2b.js — menos código y el diff no delata nada, que es el caso de la fuente — si es errónea, un revisor puede tomar «la rama no toca src» como pista que el caso de campo no da
- Task 3: Ruling: el THEN del ADDED «recupera del historial» nombra `git log -p`; los sujetos de rm3 usaron `git show <sha> -- …` — misma conducta (leer el historial), se deja el texto aprobado — si es errónea, la capacidad nombra uno de dos comandos
- Final: Ruling: Código, declinado — subject.mjs:193 cita «requisito vigente» — falso positivo: término del escenario de juguete, no un documento del proyecto — si es errónea, un comentario que envejece
- Final: Ruling: Código, declinado — sdd-verify sin cambios, regla 3, dist/ y NOTICE, coste — son del eje Spec, del build o del proceso, ya cubiertos — ninguno
- Final: Ruling: Spec, declinado — f3 sin correr — la viñeta no cambió, no hay nada que pueda romperlo — si es errónea, ninguno
- Final: Ruling: Spec, declinado — las dos cláusulas no escritas y rm2b sin plan — no hay texto que verificar; el límite va en la evidencia y en 4.3 — si es errónea, el caso sin plan queda sin medir
- Final: Ruling: Spec, declinado — from OpenSpec v1.16.1 sin traer texto — la versión es la última revisada, como impeccable — si es errónea, kit:upstream callaría un cambio no leído, y se leyó entero
- Final: Ruling: Spec Minor 3 — molds.test.ts no monta rm* — construye un caso por molde distinto a propósito, y rm* comparten reservas con f1; el seco de rm1-rm3 y rm2b corrió en esta sesión — si es errónea, una rotura de reviewRemoved sale en la próxima tanda, antes de gastar (DRY_RUN)
- Final: Ruling: Código Minor 4 — reviewBase acumula ramas por escenario — legible hoy (baseApp aparte, 3 ramas); se parte con la próxima familia — si es errónea, más condiciones en una función
- Final: Ruling: Código Minor 5 — OpenSpec como copy (from) y no concepto — el texto del eje Spec está adaptado de verify-change.ts y su MIT pide el aviso en el NOTICE, que solo sale de las copias — si es errónea, una fila de aviso de más
- Final: Ruling: Spec Minor 1 — el THEN del ADDED 2 dice git log -p — cambiar un THEN es un desvío: va a la parada con su enmienda sin commitear — si es errónea, la capacidad nombra un comando de dos
- Final: Ruling: desvío del THEN del ADDED 2 aprobado («1») tras la review de la enmienda (dominio opus, técnica sonnet, a petición del dev-lead: 8 aceptados, 1 rechazado) — el THEN no nombra comandos y vale la última versión antes del commit que lo quitó; sustituye al ruling de la Task 3 y al de Spec Minor 1 — si es errónea, ninguno: RM3h comprueba el cómo
