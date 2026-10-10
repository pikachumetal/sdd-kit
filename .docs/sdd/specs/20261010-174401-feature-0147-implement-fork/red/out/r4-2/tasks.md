# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 674402c |
| 2 — Listado de canceladas | hecha (revisión: NEEDS FIXES → arreglada) | 4c66c35 + fix 9715938 |

Revisión de la Task 2: sonnet + effort-medium, NEEDS FIXES (1 Important: el test de `canceladas` no preparaba su GIVEN), sobre 4c66c35.
Pasada de fix: 9715938, 1 hallazgo RED→GREEN
Revisión final: sdd-kit:effort-high + opus, NEEDS FIXES (1 Important: test «sin reserva» borrado; 3 huecos de spec y 3 Minor), sobre 9715938
Pasada de fix: cc21434, 1 hallazgo (test recuperado, verde al nacer: el comportamiento ya existía)

## Rulings

- La sesión se cortó por cuota con la Task 2 ya commiteada; el informe del implementador se perdió. Se verificó (suite 5/5, árbol limpio) y se revisó la task con un revisor nuevo.
- Los tests de las dos tasks los escribió el implementador, no el hilo principal, y no hay copia previa para comparar; los revisores los contrastaron con la spec.
- Importante reproducido en RED por el hilo (`--test-name-pattern=canceladas` → `actual: ''`) antes del fix; el fix añade `resetBookings` exportado para los tests.
- La Task 1 borró el test «cancelar sin reserva lo dice» y `cancelar` valida el motivo antes que la reserva: llevado al revisor final como posible hueco de la spec.
