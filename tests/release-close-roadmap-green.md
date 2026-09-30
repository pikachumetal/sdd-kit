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
