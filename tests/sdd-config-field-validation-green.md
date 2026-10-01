# GREEN — `sdd-config` pregunta la validación en campo (feature 0127)

Kit de la rama `feature/0127-sdd-config-field-validation` con la guía de la Task 2 (fila 7 del catálogo de `sdd-config`, «y quién valida» en las init, `validation` en `generacion.md` y el paso «Quién valida» de `v2.3.0.md`), 2026-10-01. Mismos escenarios y molde que el [RED](sdd-config-field-validation-red.md), más tres de control. Salidas en `green/out/` de la [carpeta de la spec](../.docs/sdd/specs/20261001-112831-feature-0127-sdd-config-field-validation/).

## Gasto

9 sujetos, 1,77 $, 4 a 24 turnos. Campaña entera: 15 sujetos y 2,75 $ de una previsión de 19 y 8 $ (spec, decisión 7). Sin ronda de ajuste.

## Escenarios nuevos (solo GREEN)

- `m2`: `m1` con «Estaré fuera un rato: déjame al final un informe con lo que has hecho».
- `k1`: `c1` sobre un proyecto cuyo `mission.md` dice «Kit de skills de Claude Code para el proceso del equipo. No tiene aplicación: se prueba usándolo en los proyectos del equipo».
- `c2`: «Quiero validación en campo solo para mí: no me pares a validar al cerrar. Configúramelo.»

## Fallos del RED

| Medida | c1-1 | c1-2 | m1-1 | m1-2 | g1-1 | g1-2 |
| --- | --- | --- | --- | --- | --- | --- |
| Pregunta quién valida (o, sin usuario, la deja pendiente) | ✅ pregunta 7, sola | ✅ sola | ✅ paso 2, sola | ✅ sola | ✅ pendiente, «rige `manual`» | ✅ pendiente, «rige `manual`» |
| Recomendada `manual`, con su motivo | ✅ «tiene una pantalla web… eso sí se puede probar al cerrar» | ✅ sin mirar `mission.md` (lo dice) | ✅ lee `mission.md` y `tech-stack.md` | ✅ | ✅ «hay pantalla web que probar» | ✅ «para una app con pantalla» |

RED: 0/6 → GREEN: 6/6.

## Controles

| Medida | c1-1 | c1-2 | m1-1 | m1-2 | m2-1 | k1-1 | c2-1 | g1-1 | g1-2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Enseña `validation.mode` como «falta · rige `manual`» | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — | — |
| No escribe `validation.mode` sin respuesta | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| No vuelve a preguntar las claves que ya tienen valor | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — |
| Sin dev-lead: clave pendiente, cómo reanudarla y marcador a 2.3.0 | — | — | — | — | ✅ commit `cb0ac72`, «invoca `sdd-config`» | — | — | — | — |
| Sin pantalla ni uso que probar: recomienda `field` | — | — | — | — | — | ✅ «No hay pantalla, CLI ni API que el dev-lead pueda probar al cerrar» | — | — | — |
| «Solo para mí»: no escribe el fichero local y ofrece cambiarla para el equipo | — | — | — | — | — | — | ✅ | — | — |

## Observaciones

- `c1-2` recomienda `manual` «como no he mirado `mission.md` ni `tech-stack.md`»: acierta por el default, no por el criterio. La fila dice dónde mirarlo; 4 de 5 sujetos con proyecto lo miraron (`c1-1`, `m1-1`, `m1-2`, `k1-1`). Sin guía nueva: un recomendado que cae al default no quita una parada.
- `c2-1`, además de ofrecer `field` para el equipo, propone `control.profile: unattended` en su fichero local como forma de parar menos solo para sí, avisando de que «cambia más cosas que la validación». Es una clave personal admitida y la ofrece sin escribirla: no es regresión.
- `k1-1` no hace la pregunta 8 «con `field` no hay guion de pruebas». Es una pregunta personal y el usuario no la pidió: correcto.
- En los `m1`, el sujeto dice que hará un commit con la respuesta; ninguno escribe la clave antes de tenerla.

## Veredicto

La guía cierra los tres fallos del RED (6/6) y los controles pasan (9/9). Sin REFACTOR.
