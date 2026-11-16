---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-14
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 00c766f | Revisión de task: limpia (3 Minor, sin acción) |
| 2 | Listado de canceladas | done | 36e2ac4 | Revisión de task: limpia (1 Minor, sin acción) |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Setup: Ruling: trabajo en la rama feature/0010-cancel-reason sin worktree nuevo — ya es una rama de feature, nadie pidió aislamiento — si falla, se mueve la rama a un worktree
Setup: Ruling: Ejecución subagent del plan manda sobre execution native de sdd-kit.json — «the plan's Ejecución line decides» — coste: ninguno
Setup: Ruling: el plan no tiene línea Modelo por task; uso sonnet + sdd-kit:effort-low al implementar (1 fichero, spec clara) y sonnet + sdd-kit:effort-medium al revisar — coste: una ronda de fix más
Preflight: Ruling: sin reserva se comprueba antes que el motivo (`cancelar Sur mar` sigue respondiendo «sin reserva Sur mar») — conserva el test existente y la spec solo fija el motivo con reserva existente (GIVEN) — coste: si se quería validar el motivo primero, se invierte el orden en una línea
Preflight: Ruling: `canceladas` une líneas con salto de línea y sin canceladas responde cadena vacía (`libres` ya devuelve '' sin resultados) — la spec solo fija el caso de una — coste: texto de vacío a ajustar
Final: Ruling: la revisión final sale con los ejes Spec y Code, sin Arquitectura — no hay frontera tocada — si falla, un tercer eje en la pasada de fix
Final: Ruling: Important (Spec) «canceladas no ve las cancelaciones de otra ejecución del CLI: las reservas viven solo en memoria» — no se arregla en esta feature: persistir las reservas cambia el scope (enmienda de spec y task nueva) y el ROADMAP ya lo separa en 0014 «Motivo guardado: el motivo se guarda en el almacén de reservas»; la app no tenía persistencia antes (`reservar` responde un texto fijo); la spec exige «se guarda con la reserva cancelada» y eso se cumple en memoria — coste si falla: hasta que llegue 0014, en el terminal `canceladas` sale vacío; el dev-lead debe confirmar que 0010 se entrega así o adelantar 0014
Final: minor (deferred): test `canceladas` depende del estado que deja el test de cancelar con éxito (comentario además impreciso: dice «test anterior», es el de dos puestos antes) (Code 1, Spec 2)
Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF y el diff reescribe todo el fichero (Code 2)
Final: minor (deferred): `canceladas` sin canceladas responde '' y con varias une con \n, sin tests; texto de vacío por decidir con el dev-lead (Code 3, Spec 3)
Final: minor (deferred): `cancelar --motivo otro Norte lun` se lee con sala `--motivo` (parseo posicional, igual que `--cada-semana`) (Code 4)
Final: minor (deferred): CANCEL_REASONS y reasonFrom no están con los datos del módulo (Code 5)
Final: minor (deferred): la sección «Decisiones que he tomado yo» de la spec está numerada 1, 3 — confirmar con el dev-lead si faltaba una 2 (Spec 4)
Final: Ruling: Declined (Code) TDD-order, reescritura del test «cancelar una reserva activa», orden sin-reserva/motivo, hash vacío de Task 2 en tasks.md, ubicación de módulos — fuera del eje o ya dictado: la spec cambia `cancelar` sin motivo, el orden es el ruling del preflight, el hash de Task 2 va en el cierre, módulos son del eje Arquitectura — coste: ninguno
Final: Ruling: Declined (Spec) mayúsculas/espacios en el motivo, `--motivo` antes de sala y día, README y CHANGELOG sin actualizar, orden de `canceladas`, cabecera «Modificadas» con delta ADDED — la spec fija la lista y la sintaxis; el changelog va por sdd-end-release; el orden solo se fija con un elemento — coste: un motivo con otra capitalización se rechaza con el mensaje que lista los válidos$

Revisión final: Spec opus+high, con arreglos (1 Important adjudicado: persistencia en 0014) · Código sonnet+high, sí · Arquitectura no (sin señales en el diff), sobre 36e2ac4
