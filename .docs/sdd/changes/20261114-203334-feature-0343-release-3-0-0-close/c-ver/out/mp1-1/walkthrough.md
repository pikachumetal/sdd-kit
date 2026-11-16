---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1 — Cancelar con motivo (`cb1950a`): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; otro valor, o ninguno, responde «motivo no válido: cambio de planes, sala ocupada, otro». La reserva cancelada guarda el motivo (`src/app.js`).
- Task 2 — Listado de canceladas (`f89e362`): `canceladas` lista cada reserva cancelada como «<sala> <día> — <motivo>» (`src/app.js`).
- Pasada de fix de la revisión final (en el commit de cierre): `test/cancel.test.js` recupera el test «sin reserva», añade el de «sin `--motivo`» y cada test importa su propia instancia del módulo, para no depender del orden.
- Capacidad `bookings` creada en `capabilities/bookings.md` con el delta de la spec; el bloque «Capacidades» de la spec pasó de «Modificadas» a «Nuevas», porque la capacidad no existía.

## 2. Tiempo y coste

- Tipo: backend
- Sin `estimation.md` en el proyecto: tiempo no medido.
- Modelo del hilo: Opus 5.5, effort no registrado (revisión final y cierre)
- Revisión final: Spec opus+high, Código sonnet+high; re-revisión opus+high
- Review de spec: no

## 3. Desviaciones del plan

- `tasks.md` no se escribió antes de la Task 1, como pide `sdd-implement`; se creó en la pasada de fix con el ledger y `git log`.

### Decisiones tomadas sin el dev-lead

- Ejes en paralelo 2 (Spec opus+high, Código sonnet+high) sin `control.maxParallelAgents` en `sdd-kit.json` — la política de modelos de la spec aprobada los nombra y son solo dos — si el tope fuera 1, se habrían pisado dos despachos de solo lectura, sin efecto en el código
- Eje Arquitectura no sale — la única señal del diff es el campo `reason` de la reserva, en memoria, ya prevista en la spec — si había frontera, nadie la miró
- `tasks.md` creado en la pasada de fix — el ledger y `git log` eran la fuente — solo registro
- «No verificado» del eje Spec (suite y CLI con comillas) — verificados en el hilo: suite 7/7 y la CLI real con `--motivo "sala ocupada"` — ninguno
- Motivo y cancelaciones solo en memoria: `canceladas` en un proceso aparte siempre sale vacío — es el modelo de datos de la base para todos los comandos y la 0014 «Motivo guardado» lo guarda en el almacén — si el dev-lead esperaba verlo en uso real ya en la 0010, hay que adelantar la 0014
- Cancelar sin motivo deja de funcionar — la spec lo pide — ninguno
- Motivo sensible a mayúsculas — lista cerrada, el mensaje enseña los valores válidos — un usuario repite el comando
- `--motivo` antes de sala y día, `voidBooking` sin motivo, informe por sala, anulaciones con motivo — fuera de scope (0011, 0012) o uso no razonable — ninguno
- Renombre y cambio de aserciones de los tests en `cb1950a` — el contrato de `cancelar` cambió por la spec — ninguno
- Spec con `bookings` «Modificada» sin capacidad existente, decisión 3 citando MODIFIED con delta solo ADDED, numeración 1→3 — defectos del registro; corregido en el cierre solo el bloque «Capacidades», que bloqueaba el merge — el resto queda como está en la spec aprobada

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 7/7 · 1 s · configuración: la del gate · sobre el commit de cierre (verificado en el hilo sobre el código del cierre)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 7/7 · smoke 3/4 THEN con ejecución real, 1 por suite · revisión final Spec y Código, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ✅ |
| sin `--motivo` → el mismo mensaje | ejecución real (`node src/app.js cancelar Norte lun`) | ✅ |
| `canceladas` → «Norte lun — sala ocupada» | suite (`canceladas enseña sala, día y motivo`); en ejecución real, un proceso aparte sale vacío porque el estado es en memoria (0014) | ✅ en suite · no probado en CLI real |

### 4.3 Residuales / deuda generada

- A «Por triar» de `debt.md`: `canceladas` vacío imprime una línea en blanco; `--motivo` sin comillas; sin `.gitattributes`.
- Minors diferidos de la revisión final: en `tasks.md`.
- Persistir el motivo: 0014 del roadmap.

## 5. Aprendizajes

- El estado de `src/app.js` vive en el módulo; los tests lo aíslan importando su propia instancia → `steering/architecture.md`

Retro: documento o skill desmentido → corregido en el mismo documento: «Capacidades» declaraba `bookings` Modificada sin capacidad existente (spec.md)
Retro: error que cazaría un chequeo → ticket del kit: la spec se aprobó con una capacidad «Modificada» inexistente; `sdd capability check` al aprobar la spec lo habría cazado, y solo saltó en el cierre
Retro: documento o skill desmentido → ticket del kit: `sdd watch subagent` acabó con exit 1 y sin mensaje después de volver la re-revisión; «Silence watch» no describe esa salida

## 6. Adendas
