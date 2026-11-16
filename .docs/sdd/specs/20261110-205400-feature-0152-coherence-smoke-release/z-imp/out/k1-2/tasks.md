# Tasks — 0018 Comando de ayuda

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Comando `ayuda` | hecha | ver ledger |

## Rulings
- Ruling: ayuda se despacha en run() y no es entrada de handlers — el plan la pide en handlers, pero eso la mete en commands y test/readme.test.js exigiría documentarla en README.md, que la spec deja fuera (0020) — si me equivoco, commands no incluye ayuda y la 0020 deberá añadirla al README y a la lista

Revisión final: autorrevisión (sin herramienta de subagentes), sin hallazgos Critical/Important, Arquitectura no (plan), sobre c414c6a
