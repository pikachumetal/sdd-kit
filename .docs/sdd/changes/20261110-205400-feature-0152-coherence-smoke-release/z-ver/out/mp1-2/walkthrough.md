---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) antes de buscar la reserva y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (11f2b1c).
- Comando `canceladas`: lista las reservas canceladas con su motivo, `<sala> <día> — <motivo>` — `src/app.js`, `test/cancel.test.js` (46240a3).
- Cierre: tests de la revisión final en `test/cancel.test.js` — el AND «sin `--motivo`», vuelve «cancelar sin reserva lo dice» con un motivo válido, y el test de `canceladas` prepara su propio GIVEN.
- Capacidad viva `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.
- Revisión final: Spec opus+high, Código sonnet+high; re-revisión opus+high. Review de spec: no (decidido en la spec).

## 3. Desviaciones del plan

- La revisión final encontró tres huecos de tests y la pasada de fix los cerró en `test/cancel.test.js`; el código de `src/app.js` no cambió tras la Task 2.
- `tasks.md` se escribió en el cierre, no antes de la Task 1.

### Decisiones tomadas sin el dev-lead

- La spec declaraba `bookings` en «Modificadas» sin capacidad viva en el proyecto; pasa a «Nuevas» para que `sdd capability merge` la cree — no toca requisitos, THEN ni Scope — si estaba mal, habría que fusionarla a mano donde viva.
- `tasks.md` se escribió en el cierre desde el ledger y `git log` — sin efecto en el código.
- `canceladas` sin ninguna cancelación imprime una línea vacía y se queda así: un aviso es salida que la spec no fija — fila «Por triar» en `debt.md` — si está mal, el usuario ve una salida vacía hasta otra feature.
- Sin `--motivo` da el mismo mensaje que un motivo no válido: el revisor de Código lo marcó, el código se queda porque es el tercer AND de la spec — ninguno.
- El requisito de cancelar se queda `ADDED` y no `MODIFIED`: no había capacidad viva `bookings` — si estaba mal, el historial pierde que `cancelar` sin motivo funcionaba antes.
- Las reservas no persisten entre invocaciones de la CLI, así que `canceladas` en otro proceso no enseña nada: ya pasaba en todo el molde y la spec no lo pide; lo cubre la 0014 «Motivo guardado» del roadmap — si está mal, el listado no sirve fuera de un mismo proceso hasta la 0014.
- Los tests previos de `cancel.test.js` reescritos en la Task 1 son del molde y cambian con esta feature, no RED de otra task — ninguno.
- Fuera de juicio, sin cambio: `anular` sin motivo (Scope de la 0011), la rama `--cada-semana` (ajena al diff), posición de `--motivo`, motivos de varias palabras sin comillas y regla de las 24 h (la spec fija la forma) — ninguno.
- No verificado por el revisor y sin cambio: si el test borrado era la regresión del patch 0007 (su `patch.md` no lo nombra); se restauró igualmente — ninguno.
- El último commit del cierre se corrigió con `--amend` antes de presentarlo, para dejar `test/cancel.test.js` en CRLF como el resto del repo — local y sin publicar — ninguno.

### Mejoras menores diferidas

- Los estados `'cancelled'` y `'active'` repetidos como literales.
- `cancelledList` (`src/app.js:36`) mezcla filtrar, formatear y unir en una línea larga.
- Ningún test comprueba que un motivo no válido deja activa una reserva real.
- La lista «Decisiones que he tomado yo» de la spec salta del 1 al 3.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 7/7 · 1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 7/7 · smoke 4/4 THEN y AND con ejecución real (el listado, en un mismo proceso) · revisión final Spec y Código, re-revisión con los 3 hallazgos resueltos, 1 sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | el mensaje exacto |
| sin `--motivo` → el mismo mensaje | ejecución real (`node src/app.js cancelar Norte lun`) | el mensaje exacto |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar', …)` y `run('canceladas', [])`); por la CLI en dos procesos sale vacío porque el estado no persiste (0014) | «Norte lun — sala ocupada» |

**✋ Me salí del plan en…**

- sin revisar: el último cambio del cierre — devuelve el test de `canceladas` a `test/cancel.test.js` con su GIVEN y restaura CRLF (tras la re-revisión, que no abre otra; 9 líneas de test netas, suite 7/7).

### 4.3 Residuales / deuda generada

- `canceladas` vacío imprime una línea en blanco → «Por triar» de `debt.md`.
- Persistencia del motivo entre invocaciones → ya en el roadmap como 0014.

## 5. Aprendizajes

- El estado de `src/app.js` es del módulo y lo comparten los tests de un mismo fichero: un test que lee estado prepara su propio GIVEN → `steering/constitution.md`.

Retro: documento o skill desmentido → la spec declaraba `bookings` como «Modificadas» sin capacidad viva; corregido en su bloque «Capacidades» (spec.md)
Retro: error que cazaría un chequeo → un test reescrito quedó en LF en un repo con CRLF en el índice y sin `.gitattributes`, y costó un commit de arreglo; fijar el EOL del repo pide decidirlo → «Por triar» (debt.md)

## 6. Adendas
