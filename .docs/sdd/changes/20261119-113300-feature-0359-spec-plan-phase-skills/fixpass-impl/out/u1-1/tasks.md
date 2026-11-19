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
| 1 | Cancelar con motivo | done | 705c7bc | |
| 2 | Listado de canceladas | done | a078645 | enmienda aprobada 2026-11-19: sin «quién canceló» |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, sí · Arquitectura no (sin señales: sin módulo, dependencia ni contrato nuevos), sobre 2068a3e
Pasada de fix: e3e5852, 2 hallazgos RED→GREEN (mutación)
Final: minor (deferred): canceladas vacío imprime línea en blanco (la spec calla); test de motivo no válido sobre reserva inexistente; test de canceladas depende del orden; reasonOf asume la bandera al final.
Re-revisión: 2068a3e..e3e5852, sdd-kit:effort-high + opus, sí (0 Críticos, 0 Importantes)
Final: minor (deferred): el test «sin --motivo» corre con Norte lun ya cancelada (el GIVEN del spec no se cumple en una pasada completa); e3e5852 mezcla un cambio de docs (hash de la Task 1) en un commit test().
