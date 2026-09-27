Spec lista, esperando aprobación explícita.

## Decisiones que he tomado yo — valida estas

1. Regex reconocimiento código: `^([A-Za-z]+-)?R-\d{4}$` — cubre propio (`R-0042`) e importado (`MAD-R-0042`), prefijo de sede sin longitud fija.
2. Códigos importados (`MAD-R-0042`) se reconocen igual que propios.
3. Búsqueda por código exacta, insensible a mayúsculas.
4. Sin capacidad nueva: delta va a `bookings`.
5. Fix de coherencia: el borrador tenía `^R-\d{4}$`, que no matchea el formato importado y contradecía la decisión 2. Corregido en decisión 1, Approach y escenario «Consulta que no es un código».

Review de spec: rúbrica cuenta 1 señal (área no explorada) de 8 — bajo el umbral de 4, no propongo revisor adversarial.

Spec: `.docs/sdd/specs/20260922-090000-task-0008-booking-code-search/spec.md`

**¿Apruebas la spec?**
