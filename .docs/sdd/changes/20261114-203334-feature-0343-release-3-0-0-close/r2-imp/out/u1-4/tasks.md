---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d89fd11 | |
| 2 | Listado de canceladas | done | 4c34751 | Enmienda 14136f4: sin «quién canceló» |

Revisión final: Spec opus+high, Con arreglos (2 Important, 2 Minor) · Código sonnet+high, Con arreglos (1 Important, 5 Minor) · Arquitectura no (plan: sin señales en el diff), sobre 4c34751
Pasada de fix: 5b09d9b, 2 hallazgos (cobertura de tests de comportamiento ya existente; comprobados por mutación, no RED→GREEN)
Re-revisión: 4c34751..5b09d9b, sdd-kit:effort-high + opus, Approved

## Rulings

Task 2: Ruling: enmienda aprobada por el dev-lead (14136f4) — el listado enseña «Norte lun — sala ocupada», sin «quién canceló» — la app no tiene identidad — si se quiere el quién, va con 0011
Final: Ruling: integración — no existe `develop` en este repo; el merge-base del paquete se corta contra `main` — el paquete incluye Task 1 y 2 de la rama — si el dev-lead usa otra base, el paquete trae algún commit de más o de menos
Final: Ruling: sin `operations.md` ni `capabilities/` — el eje Código va con «sin E2E declarados» y el eje Spec con «Sin capacidades» — un reviewer no podrá contrastar la verdad viva
Final: Ruling: los dos tests nacen en verde — comportamiento ya implementado, no se puede RED→GREEN — se verificaron por mutación — si la mutación no refleja un fallo real, el test protege menos de lo que parece
Final: minor (deferred): orden de los tests dependiente del estado compartido del módulo (test canceladas tras test 1)
Final: minor (deferred): el motivo no válido sobre Norte lun no comprueba que la reserva siga activa
Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco
Final: minor (deferred): faltan tests de canceladas vacío y de una anulada excluida
Final: minor (deferred): `reasonOf` asume `--motivo` tras las posicionales
Final: Ruling: «develop» no existe en el repo aunque la constitución lo cita — se queda para sdd-archive — si el merge va a develop hay que crearla antes
