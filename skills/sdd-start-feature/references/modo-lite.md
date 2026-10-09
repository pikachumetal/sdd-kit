## Modo lite — predicado observable, activación del usuario

Una feature **puede** ir en modo lite si cumple **todas** estas condiciones:

- El flujo a modificar ya existe en el repo y se puede leer.
- No cambia contratos públicos (API, interfaces que consume otro módulo).
- No cambia el schema de datos. Una migración solo de datos, idempotente y reversible (alta o baja de textos o de filas de catálogo) no lo descarta, pero la spec la nombra.
- Cabe en un solo módulo o área.
- Si existe `.docs/sdd/estimation.md`: la estimación es ≤ media jornada.

Cumplirlas **habilita** el modo; NO lo activa. Propón el modo lite en la pregunta del carril de `sdd-propose`, **citando una por una las condiciones que has comprobado**, y espera la confirmación explícita del usuario. Sin confirmación, la feature va en modo full.

En lite: `spec.md` corta (con el bloque de estimación dentro), sin `plan.md` ni `tasks.md`. Si la lite cambia lo que se ve, su Approach lleva el criterio en frases medibles y la pantalla de referencia, y antes de presentar la validación aplicas [frontend-verification.md](frontend-verification.md): sobre el entorno del usuario si lo tiene levantado, sin build dedicado ni suite de specs nueva, el detector de `§Frontend` en sus dos viewports y una captura por estado. No presentas con un hallazgo del detector abierto sin justificar, y la presentación enseña su salida, o el aviso «composición no medida», o «no probado» con su motivo. Todo lo demás es idéntico — el gate de la spec, el smoke y el `walkthrough.md` con tiempo real no se abaratan nunca. Si al implementar cae cualquier condición, la feature **sube** a modo full: para, dilo y escribe el `plan.md` que faltaba con su gate. Nunca al revés.
