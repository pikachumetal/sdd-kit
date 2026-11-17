Paso 4 cerrado. Repaso de coherencia encontró una contradicción real entre decisión 2 (`MAD-R-0042` se reconoce como código) y el regex de decisión 1/Approach (`^R-\d{4}$`, que no matchea prefijo). Corregido: regex generalizado a `^(?:[A-Z]+-)?R-\d{4}$`, alineado con `capabilities/bookings.md` (prefijo de sede genérico, no solo `MAD-`).

**Decisiones que he tomado yo — valida estas**

1. Regex unificado `^(?:[A-Z]+-)?R-\d{4}$` (sin distinguir mayúsculas) para código propio e importado — la spec original tenía dos reglas incompatibles, las fusioné.
2. Códigos importados de cualquier sede (no solo `MAD-`) se reconocen igual.
3. Búsqueda por código exacta, sin distinguir mayúsculas.
4. Sin capacidad nueva: delta va a `bookings`.
5. Review de spec: ninguna — 0 de 8 señales (sin capacidad nueva, sin contrato público, sin MODIFIED/REMOVED, una sola capacidad, sin datos/migración, sin dependencia externa, `bookings.md` ya leído, sin roles nuevos).

Spec en `.docs/sdd/specs/20260922-090000-task-0008-booking-code-search/spec.md`, status `draft`, lista para gate.

¿Apruebas la spec así?
