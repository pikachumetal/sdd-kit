---
release: v3.0.4
title: sdd-kit v3.0.4 — la entrevista de la spec ya no se puede saltar
created: 2026-11-19
---

# sdd-kit v3.0.4 — la entrevista de la spec ya no se puede saltar

*19 de noviembre de 2026*

## Resumen

La 3.0.3 pedía al agente que os preguntara lo vuestro antes de escribir la spec, pero en uso real seguía escribiéndola sin preguntar: decidía él que no había nada vuestro. Esta versión saca la escritura de la spec y del plan a skills propias que se cargan enteras, y la entrevista ya no tiene puerta para no preguntar.

## Novedades

- **Para quien pide una feature**: antes de escribir la spec, el agente os enseña lo que ha entendido repartido en tres montones (lo que ya está respondido, lo menor que decide él y lo que solo podéis decidir vosotros) y os pregunta lo vuestro, una cosa por turno. Lo que el prompt de arranque deja en «Abierto» siempre os lo pregunta.
- **Para quien quiere saber en qué fase está el agente**: la spec y el plan pasan por cuatro skills con nombre propio (`sdd-spec-writing`, `sdd-spec-review`, `sdd-spec-approval`, `sdd-plan-writing`). Si no veis que se invocan, falta un paso.
- **Para quien inicia un proyecto nuevo**: el paso del registro de estimaciones de `sdd-init` ya no falla en un proyecto que todavía no tiene cambios.

## Próximos pasos

- Por vuestra parte: actualizad el kit, reiniciad la sesión y pedid «actualízame al kit»; no cambia nada en vuestro proyecto salvo la versión.
