---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-14
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de estar en la lista cerrada (cambio de planes, sala ocupada, otro); si no, responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — `4e0dd18`.
- `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — `1756932`.
- Fuera de spec: `canceladas` sin ninguna cancelada responde «sin canceladas» (`src/app.js:36`) — `61915c5`.

## 3. Desviaciones del plan

- La spec no tiene escenario para «sin canceladas»; se añadió tras la revisión final (ver abajo).

### Decisiones tomadas sin el dev-lead

- Salida «sin canceladas» para el listado vacío — la lista vacía devolvía una cadena vacía — coste si está mal: un texto que nadie pidió; la spec sigue sin escenario.
- Importante abierto de la re-revisión: falta un test que fije «sin canceladas» — no se arregla en el cierre (sin segunda pasada de fix); queda como deuda en el roadmap — coste: quitar el `||` no rompe la suite.
- `src/app.js` pasó de CRLF a LF en `61915c5` (el diff sale 48/48 en vez de 1/1) — no se revierte — coste: `git blame` del fichero apunta a ese commit.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 pass · 0 fail (ejecutado en el cierre, sobre `61915c5`).
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia, sobre `1756932`. Re-revisión de `1756932..61915c5` (opus+high): 1 Important y 3 Minor abiertos, adjudicados arriba; sin rotura nueva.

### 4.2 Smoke / tests

Validado por el dev-lead: 2026-10-14 · «probé cancelar con motivo y sale en canceladas». No detalló el caso de motivo fuera de la lista ni el listado vacío; esos dos los verificó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real · validado por el dev-lead | ✅ |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (agente) | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real · validado por el dev-lead | ✅ |
| (fuera de spec) `canceladas` sin canceladas responde «sin canceladas» | ejecución real (agente) · sin test | ✅ |

### 4.3 Residuales / deuda generada

- Test de «sin canceladas» → deuda técnica del roadmap.
- Capacidad `bookings`: ver §5.

## 5. Aprendizajes

- El delta de la spec **no se ha fusionado**: la spec declara `bookings` como «Modificada», pero `.docs/sdd/capabilities/bookings.md` no existe y `sdd capability merge` se niega («no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»»). Crearla es decisión del dev-lead (la capacidad la crea la spec que la declara en sus decisiones, con su slug aprobado) → fila en la deuda técnica del roadmap; no se ha tocado la spec aprobada.
- `.claude/skills/` no existe en el proyecto: revisado, sin patrón reutilizable que lo justifique.
- Sin `estimation.md`, `architecture.md` ni `environments.md`: no hay nada que actualizar ahí.

## 6. Adendas

- _Ninguna_
