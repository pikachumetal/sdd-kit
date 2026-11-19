---
status: accepted
date: 2026-11-19
rutas:
  - skills/sdd-grilling/**
  - skills/sdd-explore/SKILL.md
  - skills/sdd-init/SKILL.md
  - skills/sdd-spec-writing/**
---

# El entrevistador dice cómo se pregunta; cada skill que pregunta, qué cubre su entrevista y cuándo para, con la spec en `sdd-spec-writing`

## Contexto y problema

La [ADR 0035](0035-interviewer-core-and-caller-territory.md) decide que el núcleo de `sdd-grilling` dice cómo se pregunta y cada llamante qué cubre su entrevista y cuándo para, y sus `rutas` nombran `skills/sdd-propose/references/spec-writing.md`, que la feature 0359 lleva a la skill de fase `sdd-spec-writing`. Desde entonces `sdd decision index --files` ya no ofrece la 0035 a quien toca la entrevista de la spec, y una ADR no se edita.

## Opciones consideradas

- Editar las `rutas` de la 0035: rompe la regla de que una ADR solo cambia su `status`.
- Una ADR nueva con la misma decisión y las `rutas` de hoy, que sustituye a la 0035 (elegida).

## Decisión

Se mantiene la decisión de la 0035, entera: el núcleo dice solo cómo se pregunta y para donde diga el llamante, o con cada decisión del usuario contestada o pendiente; `sdd-explore` (paso 2), `sdd-init` (paso 3) y `sdd-spec-writing` dicen qué cubre su entrevista y cuándo para. Una regla de territorio que baja a un llamante va literal, con su contraejemplo. Esta ADR sustituye a la 0035 (dev-lead, 2026-11-19: «1», a «ADR nuevas»).

### Consecuencias

- Las de la 0035, sin cambio.
- La 0035 queda como historia, con `status: superseded by 0042`.

### Confirmación

`kit:own` sin reglas repetidas entre skills, y la batería del entrevistador (`tests/batteries/interviewer/`) con cada fila de fondo igual o mejor que el núcleo de antes al tocar el núcleo o un llamante.
