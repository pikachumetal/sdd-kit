# Tasks — 0018 Comando de ayuda

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Comando `ayuda` | hecha | c4c3c40 |

## Rulings

- Task 1: `ayuda` no entra en `commands` (se añade a `handlers` después de exportarlo). Con ella dentro, `test/readme.test.js` falla y el README es «No entra» (0020). Coste si falla: la 0020 debe documentar `ayuda` en el README y sumarla a `commands`; mientras, el test del README no vigila `ayuda`.

Revisión final: autorrevisión del hilo (sin herramienta de subagentes) — Spec sin hallazgos · Código sin hallazgos · Arquitectura no (plan), sobre c4c3c40
