# Acta de release y retro — detalle

## Paso 2 — Acta + triage del feedback

2. **Acta + triage del feedback** *(si hubo demo/reunión con transcripción o notas)* — inventario COMPLETO
   en `.docs/sdd/releases/vX.Y.Z/feedback.md`, calcando `feedback-template.md` del skill `sdd-templates`
   (+ la fuente archivada al lado): cada petición con referencia (minuto/fuente), área y recomendación.
   La **decisión es del usuario, item a item**
   (`release-siguiente / backlog / trabajo-cliente / ya-cubierto / descartado`). El feedback se procesa
   con criterio de producto, **no se transcribe como compromisos**. Las peticiones de producto van a
   roadmap/backlog tras decisión — **NUNCA a la tabla de deuda técnica** (eso es solo ingeniería).
   Cambios de requisito detectados → sección propia del acta (`capabilities/<capability>.md` lo actualiza su dueño).

## Paso 3 — Retro con evidencia

3. **Retro con evidencia** *(si existe `estimation-log.md`)* — como sección del MISMO `feedback.md` (un
   único acta por release, no un fichero aparte): agregado estimado-vs-real de la release, qué funcionó/qué
   corregir, action items **verificables**, y comprobación de los action items de la release anterior. Sin
   evidencia no es retro, es opinión.
