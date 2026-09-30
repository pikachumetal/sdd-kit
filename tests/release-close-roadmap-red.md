# RED — el cierre que mantiene el roadmap en la forma de la plantilla (feature 0123)

Baseline con el kit de `develop` (`1c4b6054`, 2.2.0 más la plantilla y el validador de la 0115), 2026-09-30. Mide qué hacen `sdd-end-release`, `sdd-roadmap`, `sdd-end-feature` y `sdd-end-patch` con el roadmap cuando ninguna skill ejecuta `Test-Roadmap.ps1`. Molde `salas` sintético en [red/subject.sh](../.docs/sdd/specs/20260930-175003-feature-0123-release-close-keeps-roadmap/red/subject.sh); salidas en `red/out/` de la misma carpeta.

## Previsión de la campaña (Art. I)

Declarada en la spec (decisión 10) antes del primer sujeto: 5 escenarios, 2 sujetos Sonnet headless por escenario y fase, 20 sujetos más 4 de reserva, ~12 $, techo 18 $, ~100 min (`SUBJECT_CAP=24`, `COST_CAP=18`).

Sin evidencia de campo de `sdd-end-release` desde la 0063: el molde de `r1` calca la forma de los cortes de la 2.1.0 y la 2.2.0 de este repo (`ab89c44e`, `73d5f0ee`), que cortaron desde «Versión siguiente».

## Escenarios `r1` y `r2` — `sdd-end-release`

Común a los dos: `hasRecipient: false` escrito por el dev-lead, `[Unreleased]` con la 0019, la 0021, la 0022 y el patch 0020, una fila de deuda saldada por el patch 0020 el 2026-09-22, el patch del 2026-09-22 en «Patches», y `### v1.2.0 — 2026-09-10` con `validaciones pendientes: 0017`, cuyo walkthrough dice `disparador: el smoke de la 1.3, a cargo del dev-lead`. La 0022 está `🧪 validación diferida a el smoke de la 1.3`.

- `r1`: el trabajo de la release está en `## Versión siguiente` (0019 ✅, 0021 ✅, 0022 🧪), fuera de la plantilla. Antes del corte, `Test-Roadmap.ps1` escribe `roadmap.md: línea 9: sección «Versión siguiente» fuera de la plantilla`.
- `r2`: roadmap válido con `## Release 1.3` (0021 ✅, 0022 🧪, 0024 ⏳), la 0019 ✅ en «Próximo».

Petición (`r2` añade «La 0024 no entra, pásala a la siguiente»): «Cierra la release: la versión es la 1.3.0. Smoke: probé a mano la 0021 (liberé la sala Sur y llegó el aviso) y funciona. No hagas merge ni tag, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho y lo que quede pendiente.»

4 sujetos, 0,75 $, 8 a 12 turnos cada uno.

### Fallos

| # | Conducta | r1-1 | r1-2 | r2-1 | r2-2 |
| --- | --- | --- | --- | --- | --- |
| R1 | Cortar desde «Versión siguiente» sin decir que no es `## Release <N>` | la deja y reescribe su prosa: «Salieron de la 1.3.0 en el corte del 2026-09-30» | igual: «"Versión siguiente" queda con solo la 0022» | — | — |
| R2 | Comprobar el roadmap tras el corte (`Test-Roadmap.ps1`) | no lo ejecuta; sale en rojo | no lo ejecuta; 3 fallos | no lo ejecuta; 4 fallos | no lo ejecuta; 3 fallos |
| R3 | La diferida no mencionada sale de la sección abierta | sigue como fila `🧪` en «Versión siguiente» **y** en `validaciones pendientes: 0022` | igual | la pasa a «Próximo» con `🧪` y en la línea: `la 0022 ya está en la v1.3.0: su fila sale de «Próximo»` | igual |
| R4 | La adenda del disparador nuevo en el walkthrough de la diferida | no | no | sí: «la validación pasa a la siguiente release» | no |
| R5 | La fila saldada y el patch anteriores al corte salen | se quedan | se quedan: `fila saldada el 2026-09-22, no posterior a la v1.3.0 (2026-09-30): sale en el corte` | se quedan | se quedan |
| R6 | La 0017, diferida desde la 1.2.0 al smoke de la 1.3, se pregunta | no la nombra | no | no | no |
| R7 | La release nueva va arriba en «Releases cerradas» | la añade **debajo** de la v1.2.0: el validador toma la v1.2.0 como última y no ve R5 | arriba | arriba | arriba |

Resumen: 4 de 4 dejan el roadmap en rojo sin saberlo (R2), 2 de 2 cortan desde la sección heredada sin decirlo y la conservan (R1), 4 de 4 dejan la diferida como fila de una sección abierta además de en la línea (R3), 4 de 4 dejan la deuda saldada y el patch (R5) y 4 de 4 olvidan la diferida de la release anterior (R6).

### Lo que el baseline ya hace, sin guía

Pasa a control de no regresión del GREEN.

| # | Conducta | Resultado |
| --- | --- | --- |
| C1 | Subsección `### v1.3.0 — 2026-09-30` con resumen, enlace al changelog y línea de smoke con la forma de `notas-y-roadmap.md` | 4/4 |
| C2 | Línea `validaciones pendientes: 0022` en la release nueva | 4/4 |
| C3 | Rescatar la 0024 a «Próximo» antes de colapsar | 2/2 (`r2`) |
| C4 | Sacar la sección `## Release 1.3` y la fila 0019 publicada de «Próximo» | 2/2 (`r2`) |
| C5 | No hacer merge ni tag; sin release notes con `hasRecipient: false` | 4/4 |
| C6 | Adenda fechada en el walkthrough de la 0021 con lo que el dev-lead probó | 4/4 |

## Escenario `p1` — `sdd-roadmap`

Roadmap válido de `r2`. Petición: «Apunta en el roadmap que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección «Ideas del cliente» para estas cosas. Decide tú, estaré fuera un rato: déjame al final un informe con lo que has hecho.»

2 sujetos, 0,26 $, 6 turnos cada uno. Acumulado: 10 sujetos, 1,82 $.

### Fallos

| # | Conducta | p1-1 | p1-2 |
| --- | --- | --- | --- |
| P1 | Sección fuera de la plantilla | crea `## Ideas del cliente` entre «Backlog» y «Deuda técnica», con numeración propia `I1` | igual: «Por qué sección propia y no Backlog: me lo pediste» |
| P2 | Prosa fuera de «Releases cerradas» | una línea: «Cosas que el cliente ha dicho que querrá más adelante…» | igual |
| P3 | Comprobar el roadmap tras escribir | no ejecuta `Test-Roadmap.ps1`; queda `sección «Ideas del cliente» fuera de la plantilla` | igual |

La plantilla de la 0115, que los dos leen, dice «ni secciones propias»: la petición explícita del usuario pesa más, y la línea «en «Próximo» con id si se va a hacer, en «Backlog» si no, **o donde diga el usuario**» de «Algo concreto» se lo permite.

### Lo que el baseline ya hace, sin guía

| # | Conducta | Resultado |
| --- | --- | --- |
| C7 | Sin reservar id de la secuencia para algo que no se va a hacer | 2/2 |
| C8 | Sin rama, spec ni propuesta; commit que solo toca `roadmap.md` | 2/2 |
| C9 | No toca las demás filas | 2/2 |

## Escenarios `c1` y `c2` — `sdd-end-feature` y `sdd-end-patch`

Roadmap heredado de `r1` (con `## Versión siguiente`, que `Test-Roadmap.ps1` rechaza). `c1`: feature 0030 en modo lite, spec aprobada, código commiteado en `feature/0030-floor-search`, fila `0030 · 🔄` en «Próximo»; petición «Cierra la feature 0030. La revisión final ya está hecha y limpia sobre el último commit. La validé yo: probé freeRoomsOnFloor(1) con la sala Norte ocupada y libre, y funciona. No hagas merge ni push…». `c2`: patch 0031 con `patch.md` y fix commiteados en `feature/0031-room-order`; petición «Cierra el patch 0031. Lo validé yo: el listado sale Norte, Sur. No hagas merge ni push…».

4 sujetos, 0,98 $, 9 a 12 turnos. Acumulado: 17 sujetos, 3,34 $.

### Fallos

| # | Conducta | c1-1 | c1-2 | c2-1 | c2-2 |
| --- | --- | --- | --- | --- | --- |
| K1 | Ejecutar `Test-Roadmap.ps1` tras editar el roadmap | no | sí, antes y después con `git stash`, por iniciativa propia (lo encontró en la copia del kit; ninguna skill lo nombra) | no | no |
| K2 | Avisar en el mensaje final del roadmap fuera de forma | no: «Marqué la 0030 como ✅» | sí: «`Test-Roadmap.ps1` protesta por la sección «Versión siguiente»… Ya fallaba antes de mis cambios y no la toqué» | no | no |

3 de 4 cierres terminan con el roadmap en rojo sin decirlo. La conducta de `c1-2` es la que busca la guía, y sale de una fuente incidental (Art. I): se escribe la guía.

### Lo que el baseline ya hace, sin guía

| # | Conducta | Resultado |
| --- | --- | --- |
| C10 | No tocar las líneas heredadas ni reordenar el roadmap para arreglarlas | 4/4 |
| C11 | No parar el cierre por el roadmap heredado | 4/4 |
| C12 | Marcar la fila de la feature (`✅` con walkthrough) o añadir la del patch a «Patches» | 4/4 |
