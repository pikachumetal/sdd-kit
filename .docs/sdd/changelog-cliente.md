# Novedades para el cliente — sdd-kit

Qué ha cambiado en el kit, versión a versión, contado para quien lo usa. La versión más reciente arriba. Cada sección se deriva de las release notes de esa versión; las anteriores a este documento quedan enlazadas.

## v1.0.0 — 9 de septiembre de 2026 — el proceso decide con evidencia, no con suposiciones

### Resumen

Esta versión cierra lo que dos retos reales del equipo enseñaron: dónde el asistente decide solo, dónde se salta pasos y dónde una regla escrita una vez ahorra semanas. El kit ahora pregunta lo que antes inventaba, escribe los tests antes de que exista el código, revisa las specs con la profundidad que cada una merece y no cierra nada sin que tú lo hayas validado. Y un proyecto que ya trabaja con el kit se pone al día con una orden.

### Novedades

- **Para quien arranca una tarea**: la spec cabe en una pantalla y empieza por las decisiones que el asistente ha tomado sin ti, para que apruebes leyendo solo eso. Según la complejidad, el asistente propone una revisión adversarial con una lente (dominio o técnica) y tú la activas o no. El comportamiento del producto vive en un fichero por capacidad, y cada tarea declara qué añade, qué cambia y qué quita.
- **Para quien ejecuta**: el trabajo lo hace un asistente fresco por tarea con revisión entre tareas, y los tests que codifican cada escenario se escriben y guardan antes de que el implementador arranque: son su contrato y no los toca. Cada encargo lleva las reglas del proyecto delante, incluidas las dos de comentarios (ninguno repite el código; ninguno cita documentos). Los cambios acotados van por una vía corta sin perder ninguna verificación.
- **Para quien cierra**: nada se da por terminado sin que digas qué has probado y que funciona. El registro de estimaciones se genera solo desde los cierres, y las reglas del producto que antes se decidían al azar en cada tarea (dónde viven los datos, idioma de los nombres, límites, avisos, qué manda ante un conflicto) tienen nombre y sitio: se preguntan al inicializar, se escriben por capacidad y la revisión las reclama.
- **Para quien ya usa el kit en un proyecto**: «ponme al día» aplica solo lo que falta desde tu versión, con un gate por cambio, y deja un marcador de versión en el proyecto. Al cerrar una entrega, el cliente puede recibir además un documento acumulado de novedades derivado de las notas de cada versión.
- **Para quien mantiene el kit**: cada commit valida la anatomía de las skills y los manifests; las skills cargan solo lo que hace falta en cada paso; el propio kit se cicla con su flujo y toda regla nueva viene con la prueba de que hacía falta.

## Versiones anteriores

- [v0.5.0 — 2 de septiembre de 2026 — el proceso se adapta al tamaño del cambio](releases/v0.5.0/release-notes.md)
- [v0.4.0 — 22 de julio de 2026](releases/v0.4.0/release-notes.md)
- [v0.3.0 — 21 de julio de 2026](releases/v0.3.0/release-notes.md)
- [v0.2.0 — 21 de julio de 2026](releases/v0.2.0/release-notes.md)
- v0.1.0 — 9 de julio de 2026 — sin release notes (el carril release no existía).
