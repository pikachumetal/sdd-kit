Task 0008, paso 4 terminado. Spec en `.docs/sdd/specs/20260922-090000-task-0008-booking-code-search/spec.md`, lista para gate.

**Decisiones que he tomado yo — valida estas**

Review de spec: ninguna (0-3 señales, solo "área no explorada"). Repaso de coherencia manual encontró y corrigió 1 hallazgo:

- **Aceptado** — la regex `^R-\d{4}$` no matcheaba el código importado `MAD-R-0042` (capability `bookings` exige prefijo de sede + `R-####`). Con la regex vieja, buscar `MAD-R-0042` habría caído en "no es un código" y buscado por cliente, contradiciendo la decisión 2. Cambiada a `^(?:[A-Z]+-)?R-\d{4}$` en las tres apariciones (decisión 1, Approach, escenario 2).

Decisiones de fondo (sin cambio respecto al brainstorming previo):
1. Regex de detección de código (corregida arriba) decide modo búsqueda.
2. Códigos importados (`MAD-R-0042`) se tratan igual que propios.
3. Búsqueda exacta, sin mayúsculas.
4. Sin capacidad nueva — delta va a `bookings`.

¿Apruebas la spec así?
