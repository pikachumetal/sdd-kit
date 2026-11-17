Reviso spec.md (`.docs/sdd/specs/20260922-090000-task-0008-booking-code-search/spec.md`) contra la rúbrica de `review-spec.md`: sin capacidad nueva, sin contrato público, sin MODIFIED/REMOVED, una sola capacidad, sin datos/migración, sin dependencia externa, sin rol nuevo. 0 señales → no toca recomendar review. Spec ya completa y consistente con `capabilities/bookings.md`.

Paso 4 cerrado. Gate de aprobación (perfil `delegate`, para aquí):

---

**Decisiones que he tomado yo — valida estas**

1. El buscador reconoce un código de reserva con `^R-\d{4}$` y, si la consulta encaja, busca por código en vez de por cliente.
2. Los códigos importados de la otra sede (`MAD-R-0042`) también se reconocen como código.
3. Búsqueda por código exacta, sin distinguir mayúsculas.
4. Sin capacidad nueva: el delta va a `bookings`.

Scope: entra reconocer código propio o importado y búsqueda exacta; no entra cambiar la forma del código ni búsqueda por fecha.

---

¿Apruebas esta spec?
