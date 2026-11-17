Spec al día. Coherencia revisada: la única contradicción encontrada era el regex — corregida y propagada a las 4 apariciones (decisión 1, Approach, ambos escenarios).

**Decisiones que he tomado yo — valida estas**

1. Regex del buscador: `^(?:[A-Za-z]+-)?R-\d{4}$` — cubre propio (`R-0042`) e importado con prefijo de sede (`MAD-R-0042`), según `capabilities/bookings.md:13`. Corregí el borrador (`^R-\d{4}$`), que no matcheaba el importado y contradecía la decisión 2.
2. Códigos importados de la otra sede (`MAD-R-0042`) se reconocen igual que los propios.
3. Búsqueda por código exacta, sin distinguir mayúsculas — parcial no identifica reserva.
4. Sin capacidad nueva: delta va a `bookings`.

Resto de la spec (Intent, Scope, Approach, escenarios) sin cambios de fondo, solo el regex propagado. Perfil vigente: `delegate` — no me autoapruebo, la spec queda en `.docs/sdd/specs/20260922-090000-task-0008-booking-code-search/spec.md` con `status: draft` esperando tu validación.

¿Apruebas esta spec?
