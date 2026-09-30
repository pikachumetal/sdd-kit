# GREEN — el cierre que mantiene el roadmap en la forma de la plantilla (feature 0123)

Mismos moldes y peticiones que [release-close-roadmap-red.md](release-close-roadmap-red.md), con el kit de la rama `feature/0123-release-close-keeps-roadmap` tras cada task. 2026-09-30. Salidas en `green/out/` de la carpeta de la spec.

## Escenarios `r1` y `r2` — `sdd-end-release` (Task 1)

4 sujetos Sonnet, 0,80 $, 6 a 11 turnos. Acumulado de la campaña: 8 sujetos, 1,55 $.

### Fallos del RED

| # | Conducta | r1-1 | r1-2 | r2-1 | r2-2 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | No cortar desde «Versión siguiente» sin decirlo | «No es una sección `## Release <N>`, así que no he cortado desde ahí»; propone el paso de `migrations/v2.3.0.md` y su gate | igual: «Necesito tu visto para hacerlo» | — | — | 2/2 |
| R2 | `Test-Roadmap.ps1` tras el corte | el roadmap queda sin tocar: paso 4 bloqueado y paso 5 sin ejecutar, «Hasta que dé ese visto, el paso 5 no se ejecuta» | igual | `Roadmap válido` | `Roadmap válido` | 4/4 |
| R3 | La diferida no mencionada sale de la sección abierta | anuncia «Sus filas salen del roadmap» para el colapso | igual | la fila 0022 sale; `validaciones pendientes: 0017, 0022` | igual | 4/4 |
| R4 | Adenda del disparador nuevo en su walkthrough | anunciada, sin colapsar | anunciada | 0017 y 0022: «Nuevo disparador: el smoke de la siguiente release» | igual | 2/2 donde colapsa |
| R5 | Deuda saldada y patch anteriores al corte salen | anunciado | anunciado | salen | salen | 2/2 donde colapsa |
| R6 | La 0017 de la línea de la v1.2.0 se pregunta | «Dime si también probaste la 0017 y la 0022» | igual | la nombra y la mueve a la línea de la v1.3.0 | igual | 4/4 |
| R7 | La release nueva arriba de «Releases cerradas» | «la subsección va arriba» (anunciado) | — | arriba | arriba | 2/2 donde colapsa |

### Controles (lo que el RED ya cumplía)

| # | Conducta | Resultado |
| --- | --- | --- |
| C1 | Subsección con resumen, enlace al changelog y línea de smoke | 2/2 en `r2`; `r1` la propone para después del visto |
| C2 | `validaciones pendientes:` en la release nueva | 2/2 en `r2` |
| C3 | La 0024 rescatada a «Próximo» | 2/2 |
| C4 | Sale `## Release 1.3` y la fila 0019 de «Próximo» | 2/2 (lo confirma `Roadmap válido`) |
| C5 | Sin merge ni tag; sin release notes | 4/4 |
| C6 | Adenda en el walkthrough de la 0021 | 2/2 en `r2` |

Sin regresión. En `r1` los sujetos siguen con los pasos 1-3: `r1-1` sella el changelog sin commitear, como permite el paso 4 pendiente.

## Escenario `p1` — `sdd-roadmap` (Task 2), y control de `r2`

3 sujetos (`p1-1`, `p1-2` y `r2-3` como control de la Task 1 con la guía de la Task 2 en el kit), 0,54 $. Acumulado: 13 sujetos, 2,35 $.

### Fallos del RED

| # | Conducta | p1-1 | p1-2 | Veredicto |
| --- | --- | --- | --- | --- |
| P1 | Sin sección fuera de la plantilla | `B2` en el Backlog: «No he abierto la sección «Ideas del cliente». La plantilla del roadmap tiene una forma cerrada» | `B2`: «Si quieres la sección de todos modos, dímelo. Habría que cambiarlo en la plantilla del kit» | 2/2 |
| P2 | Sin prosa fuera de «Releases cerradas» | sin prosa | sin prosa | 2/2 |
| P3 | `Test-Roadmap.ps1` tras escribir | «`Test-Roadmap.ps1` da «Roadmap válido»» | igual | 2/2 |

### Controles

| # | Conducta | Resultado |
| --- | --- | --- |
| C7 | Sin id de la secuencia para algo que no se va a hacer | 2/2 |
| C8 | Sin rama, spec ni propuesta; commit solo de `roadmap.md` | 2/2 |
| C9 | No toca las demás filas | 2/2 |
| `r2-3` | Corte con `Roadmap válido`, la 0017 y la 0022 en `validaciones pendientes:` | `Roadmap válido` |

## Escenarios `c1` y `c2` — `sdd-end-feature` y `sdd-end-patch` (Task 3)

4 sujetos, 0,98 $, 8 a 12 turnos. Total de la campaña: 21 sujetos, 4,32 $ (previsión: 24 y ~12 $, techo 18 $).

### Fallos del RED

| # | Conducta | c1-1 | c1-2 | c2-1 | c2-2 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| K1 | `Test-Roadmap.ps1` tras editar el roadmap | sí | sí | sí | sí | 4/4 |
| K2 | Aviso en el mensaje final, con cuántos y la migración | «Es el único fallo y lo arregla el paso «Roadmap en la forma de la plantilla» de la migración» | «da 1 fallo… No la escribí yo, así que no la he tocado» | «Es 1 fallo y lo arregla el paso…» | «Roadmap en rojo, ya antes… No lo he tocado» | 4/4 |

### Controles

| # | Conducta | Resultado |
| --- | --- | --- |
| C10 | No tocar las líneas heredadas | 4/4 |
| C11 | No parar el cierre por el roadmap heredado | 4/4 |
| C12 | Fila de la feature a `✅` con walkthrough; fila del patch en «Patches» | 4/4 |

La línea del índice de `sdd-templates` no tiene escenario propio (spec, decisión 10): los cuatro sujetos llegaron al script por el paso de su skill.
