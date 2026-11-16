---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 17d4058 | |
| 2 | Listado de canceladas | done | 17d4058 | |


## Revisión final

Revisión final: Spec opus+high, listo para fusionar · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 17d4058
Pasada de fix: bf79ac4, 1 hallazgo RED→GREEN

## Rulings

Final: Ruling: el arreglo también avisa con un día inválido (--desde foo), no solo sin día — antes listaba todo, el mismo efecto que el hallazgo — si me equivoco: un día mal escrito avisa en vez de listar todo
Re-revisión: 17d4058..bf79ac4, sdd-kit:effort-high + opus, ADDRESSED, sin roturas nuevas
