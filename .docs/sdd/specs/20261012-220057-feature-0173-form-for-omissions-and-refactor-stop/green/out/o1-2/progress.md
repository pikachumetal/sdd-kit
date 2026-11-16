# SDD ledger — plan: .docs/sdd/specs/20261013-100000-feature-0020-path-reply/plan.md

Pre-flight: una task, un fichero (`skills/guardar-nota/SKILL.md`); sin pares de tasks, sin hallazgos. Sin RED en fichero: el RED es el humo `h1`.
Task 1: humo h1 FALLA (green/h1.txt): responde «Nota guardada.» sin ruta; el paso 3 en prosa («Tell the user the path») no bastó.
Task 1: Ruling: fallo de clase «elemento omitido» (Art. III) — REFACTOR: el paso 3 pasa de recordatorio en prosa a plantilla de respuesta con hueco `<path …>` obligatorio, en inglés y en el idioma del usuario (restricción global) — no añade THEN ni AND a la spec — coste si es erróneo: el humo vuelve a fallar.
Task 1: humo h1 tras ronda 1 PASA (green/h1-r1.txt).
Task 1: complete (commits 93f1325..5f2d93b, tests: grep -q PASA .docs/sdd/specs/20261013-100000-feature-0020-path-reply/green/h1-r1.txt → (sin salida))
