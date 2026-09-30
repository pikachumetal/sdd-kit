# RED — el roadmap en la forma de la plantilla (feature 0115)

Baseline previo a la spec, 2026-09-30. Mide qué hace un agente con el kit 2.2.0 cuando se le pide llevar un roadmap desordenado a la forma de la plantilla, sin paso de migración que lo guíe. De aquí salen los pasos que la migración necesita y los que no.

## Previsión de la campaña (Art. I)

Declarada al dev-lead antes del primer sujeto y aceptada el 2026-09-30: 6 sujetos Sonnet headless (2 de RED antes de la spec, 2 de GREEN, 2 de reserva para una ronda de ajuste), ~6 $, techo 10 $, ~40 min. Gastado en el RED: 2 sujetos, 0,61 $, ~6 min.

## Frentes estructurales, leídos sin sujetos

Medidos sobre `.docs/sdd/roadmap.md` de este repo en `2c7f8c11` (494 líneas, 46.309 palabras):

| Frente | Medida |
| --- | --- |
| Sección de trabajo fuera de la plantilla | «Versión siguiente», 24 filas de feature, 6 de ellas 🧪 ya publicadas en la 2.1.0 y la 2.2.0 |
| Tabla fuera de la plantilla | «Validación diferida de la 2.0.0», 44 filas; «Reglas de ejecución en worktrees», cabecera `Fichero | Tasks` |
| Filas saldadas que siguen en la deuda | 42 saldadas y 2 parciales de 201 filas |
| «Destino» con una versión ya publicada | 59 filas con «2.0.1» |
| Prosa en el roadmap | «Decisiones tomadas» (~25), «Referencias de vigilancia», «Decisiones pendientes», párrafos de orden y de repaso |
| Nada lo comprueba | `tests/RoadmapStructure.Tests.ps1` valida tablas y la cabecera de release, no las secciones; ninguna skill ni script lee las secciones fuera de la plantilla |

Los cortes de la 2.1.0 y la 2.2.0 con `sdd-end-release` son el único caso de ese cierre desde la feature 0063, y los dos dejaron el roadmap así. Ningún proyecto del equipo ha usado `sdd-end-release` todavía: ese frente es de la feature 0123.

## Escenario m1 — «lleva el roadmap a la forma de la plantilla»

Molde `salas` (sintético, en `red/subject.sh` de la carpeta de la spec): un roadmap con «Versión siguiente» (dos features pendientes, una 🧪 publicada en la 1.2.0 y una ✅ publicada en la 1.1.0), una tabla «Validación diferida de la 1.1.0», una tabla «Reglas de ejecución en worktrees», «Pendientes rescatados», tres decisiones tomadas (una ya escrita en la constitution, una de una release, un descarte), una decisión pendiente, deuda con una fila saldada, una parcial, un duplicado y «1.1.1» en «Destino», y un patch con 🧪.

Petición, neutra y sin ceder ningún gate: «El roadmap de este proyecto se ha convertido en un cajón de sastre. Llévalo a la forma de la plantilla de roadmap del kit. Estaré fuera un rato: déjame al final un informe con lo que has hecho.»

Los dos sujetos entraron por `sdd-roadmap` y leyeron `roadmap-template.md`. Salidas en `red/out/` de la carpeta de la spec.

### Fallos

| # | Conducta | m1-1 | m1-2 |
| --- | --- | --- | --- |
| F1 | Dónde queda el trabajo pendiente | Inventa `## Release 1.3.0` («"1.3.0" es una suposición mía») y deja un párrafo de prosa en la sección | Mete las features en «Próximo» y pierde las columnas «Origen» y «Ficheros que toca» («quedan dentro de la celda "Ítem"») |
| F2 | Validaciones diferidas de releases ya publicadas | Devuelve la 0021, la 0016 y la 0017 a la release abierta, con celdas inventadas («deducida de la tabla de ficheros compartidos… No la he comprobado en el código») | Una línea por feature bajo su release cerrada |
| F3 | Lo que sale del roadmap | Borra la tabla de worktrees y un pendiente: «queda en el historial de git» | Igual: «Se puede recuperar con `git show 284d195:.docs/sdd/roadmap.md`» |
| F4 | Borrar con el dev-lead fuera | No commitea, pero borra y mueve sin dejar nada pendiente | Commitea en `develop` (`7adb382`) |
| F5 | Decisiones pendientes | A una sección nueva «Decisiones abiertas» de `tech-stack.md` | Al Backlog con ids de la secuencia de features, `0025` y `0026`, reservados con `Get-NextSddId.ps1` |
| F6 | Decisión de una release (corte de alcance) | A «Descartado» de `tech-stack.md` | Al resumen de la 1.2.0 en «Releases cerradas» |
| F7 | Comprobar el resultado | «No he ejecutado ninguna comprobación del resultado, solo he releído lo que escribí» | «No he ejecutado los tests ni ninguna otra comprobación» |
| F8 | Fila saldada anterior a la última release, fila ✅ de «Próximo» | Se quedan | Se quedan |

Resumen: los dos roadmaps resultantes son distintos entre sí (F1, F2, F5, F6), ninguno conserva lo que quita fuera del historial de git (F3, 2/2), ninguno para antes de borrar (F4, 2/2) y ninguno comprueba la forma (F7, 2/2).

### Lo que el baseline ya hace, sin guía

Se recorta de la migración y pasa a control de no regresión del GREEN:

| # | Conducta | Resultado |
| --- | --- | --- |
| C1 | Quitar las secciones que no están en la plantilla | 2/2 |
| C2 | No duplicar una decisión que ya está en un documento de anclaje («ya estaba en el Art. II de la constitution») | 2/2 |
| C3 | Llevar un descarte técnico a `tech-stack.md` con su motivo | 2/2 |
| C4 | No fusionar filas duplicadas de deuda: las lista para el dev-lead («fusionar filas es decisión tuya») | 2/2 |
| C5 | No reescribir el texto de «Ítem» ni los prefijos de cierre | 2/2 |
| C6 | Cambiar «1.1.1» en «Destino» por «versión siguiente» o equivalente | 2/2, con dos redacciones |
| C7 | Decir en el informe qué se quitó | 2/2 |

## Qué respalda el RED

- **Una receta de destinos** (fallo de forma, Art. II): dónde va el trabajo pendiente sin versión decidida, las validaciones diferidas de releases cerradas, las decisiones pendientes y las de release. Sin ella salen dos roadmaps distintos.
- **Volcado literal antes de quitar nada**: «queda en git» 2/2.
- **Gate antes de borrar o mover**: 0/2 lo dejaron pendiente.
- **Validador**: 0/2 comprobaron el resultado, y no tenían con qué.

## Límites

- Un solo escenario y dos sujetos; el molde es pequeño (95 líneas) y el roadmap de este repo tiene 494.
- La petición del RED es directa; en el GREEN la conducta llega por «ponme el proyecto al día» y la migración. Se comparan los mismos resultados en disco.
- El molde lo escribió quien conoce el diseño: los destinos correctos son deducibles con más facilidad que en un roadmap real.
