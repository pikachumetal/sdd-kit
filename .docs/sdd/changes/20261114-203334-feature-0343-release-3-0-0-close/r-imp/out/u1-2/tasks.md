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
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | (commit de la task 2) | THEN enmendado el 2026-11-14 (sin «quién canceló»), commit b1172d3 |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre d6ba7c7
Pasada de fix: 2bfc26c, 2 hallazgos RED→GREEN
Re-revisión: d6ba7c7..2bfc26c, sdd-kit:effort-high + opus, Yes

## Rulings

Final: Ruling: Code I1 (test de canceladas depende del estado del test 1) — regrado: el test pasa igual solo o tras el test 1 (si corre solo cancela Norte lun y lista; tras el test 1 el cancelar es un no-op y la lista ya la tiene), sin efecto para quien usa la herramienta; un reset exportado sería código de producción solo para tests — cuesta: un test futuro que cancele Norte lun en otro orden puede contaminar este
Final: minor (deferred): canceladas sin canceladas devuelve '' (línea en blanco), sin mensaje ni test
Final: minor (deferred): test de motivo fuera de la lista usa Sur mar, no comprueba que la reserva siga activa
Final: minor (deferred): reasonOf trata `--motivo --otra` como motivo «--otra» y `--motivo` sin valor no lo dice
Final: minor (deferred): spec etiqueta ADDED un requisito que cambia cancelar (es MODIFIED); reetiquetar al archivar
Final: Ruling: declined (anulaciones/0011 fuera de canceladas, 0014 persistencia, regla de 24 h, 0012 informe, orden de --motivo, tabla Aprobaciones sin fila de la enmienda) — fuera del Scope de la 0010 o de otras features; el listado ya excluye voided — cuesta: ninguno si el roadmap las cubre
Final: minor (deferred): test «sin --motivo» corre con Norte lun ya cancelada y no comprueba que el rechazo deje la reserva activa; opción: fichero de test aparte con estado limpio
