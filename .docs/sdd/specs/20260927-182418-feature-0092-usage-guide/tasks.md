# Tasks — feature 0092, guía de uso del kit

Registro vivo. Ejecución Native.

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — La guía de uso, bajo la vigilancia del test | hecha | 9bf7def |
| 2 — Greenfield, brownfield y el anexo al día con la 2.0.0 | hecha | d118b23 |
| 3 — El README y los índices apuntan a la guía | hecha | 3714291 |
| 4 — Pasada de humanizer | pendiente | |

## Task 2 — RED de C6

Búsqueda del plan sobre greenfield y brownfield antes de editar, 5 afirmaciones de la 1.1.0:

- `greenfield.md:39` — el cierre «añade una línea al historial» de la capacidad (la 0070 retiró el Historial).
- `greenfield.md:72` — «Implementación con subagentes, que es el modo por defecto» y los tests RED que el hilo «commitea» antes de despachar (Native por defecto desde la 0055; los RED van en el commit de la task).
- `greenfield.md:147` — `sdd-end-release` con «inventario completo del feedback con su triaje» y retro fija (la 0063 lo dejó en el corte; el acta pasó a `sdd-roadmap`).
- `brownfield.md:54` — «Implementación con subagentes por defecto».
- `brownfield.md:91` — `sdd-end-release` «con el acta de feedback triado».

Fuera de la búsqueda, al leerlos: la lista de skills de greenfield §1.4 sin `using-sdd`, `sdd-config` ni `sdd-feedback`; el arranque sin la puerta de entrada (`using-sdd`) ni `sdd-roadmap`; el feedback de cliente que se convierte en tareas sin `sdd-roadmap`; la validación sin diferido.

## Task 4 — Pasada de humanizer (C7)

Skill `humanizer:humanizer` 3.0.0, modo fichero, sobre `usage-guide.md` entera y los párrafos reescritos de greenfield y brownfield. Cambios en la guía:

- §1: fuera el contraste «Tú no eliges la skill: la eliges con lo que pides» (patrón 1); queda «no hace falta nombrar ninguna skill».
- §1: fuera la negrita de los nombres de carril en la tabla (patrón 19).
- §2: el cierre «Contéstala y sigue.» pasa a decir qué hace el agente con la respuesta (patrón 2); fuera la negrita de «una».
- §3: fuera el arranque «Puede parecer mucho junto; esto es lo que significa cada parte» (patrón 4); el cierre «Es más barato que corregir después.» se funde con la frase anterior y dice qué cuesta cada cosa (patrón 2).
- §3: fuera la negrita de «sí» y «apruebo» (patrón 19).
- §4: fuera las etiquetas en negrita de la lista del smoke (patrón 19).

Sin cambios: la única raya de la guía está dentro del literal «Decisiones que he tomado yo — valida estas»; las etiquetas en negrita de §3 y §5 nombran la parte de la pregunta o la regla. En los párrafos reescritos de greenfield y brownfield no quedó ningún patrón de los fuertes (1 a 5), ni rayas.
