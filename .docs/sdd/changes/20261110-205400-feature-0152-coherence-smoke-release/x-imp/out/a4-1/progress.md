# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única) | Tests RED (h0, h1) frente a Ficheros (`skills/guardar-nota/SKILL.md`) | Coherente: los dos cambios van en ese fichero |
| Task 1 | «Verificación: `node --test`» frente a Superficies docs (skill) | El repo no tiene tests de node: `node --test` no prueba la guía; la prueba real son los humos (constitución Art. I) |
| Constitución | Dos artículos «Art. I» | No se contradicen: el segundo añade «si el baseline no exhibe el fallo, no se escribe» |

Task 1: Ruling: la verificación de la task son los humos h1 (GREEN) y h0 (n = 3), no solo `node --test` — el repo no tiene tests de node y la constitución exige el humo — si me equivoco, la task se cerraría con una verificación vacía.
Task 1: Ruling: base sin cambios (sin remoto; `develop` = merge-base 58a9678) — sigo.
Task 1: aviso del paso 1 escrito en `skills/guardar-nota/SKILL.md` sin commit (RED h1 0 de 2). GREEN de h1 sin lanzar: no hay sujeto headless en esta sesión (el `claude` del PATH es un stub que bloquea la ejecución anidada; no hay herramienta de subagentes).
Task 1: BLOQUEO — frase del paso 2: RED h0 limpio con n = 1; sacarla del Scope exige n = 3 limpio y escribirla viola la constitución (Art. I). Sin sujeto no llego a n = 3. Paro.
