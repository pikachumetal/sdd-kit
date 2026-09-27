## Modo lite — predicado observable, activación del usuario

Una feature **puede** ir en modo lite si cumple **todas** estas condiciones:

- El flujo a modificar ya existe en el repo y se puede leer.
- No cambia contratos públicos (API, interfaces que consume otro módulo).
- No toca schema de datos ni exige migración.
- Cabe en un solo módulo o área.
- Si existe `.docs/sdd/estimation.md`: la estimación es ≤ media jornada.

Cumplirlas **habilita** el modo; NO lo activa. Propón el modo lite **citando una por una las condiciones que has comprobado** y espera la confirmación explícita del usuario. Sin confirmación, la feature va en modo full.

En lite: `spec.md` corta (con el bloque de estimación dentro), sin `plan.md` ni `tasks.md`. Todo lo demás es idéntico — el gate de la spec, el smoke y el `walkthrough.md` con tiempo real no se abaratan nunca. Si al implementar cae cualquier condición, la feature **sube** a modo full: para, dilo y escribe el `plan.md` que faltaba con su gate. Nunca al revés.
