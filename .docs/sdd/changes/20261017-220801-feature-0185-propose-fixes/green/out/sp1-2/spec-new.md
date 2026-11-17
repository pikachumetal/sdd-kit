---
id: 20261018-103224-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-10-18
author: <git-user>
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` desaparece: quien escriba `anular Norte lun` ya no anula nada y la reserva de Norte del lunes sigue activa; para quitarla se usa `cancelar Norte lun`, que responde `cancelada Norte lun` como hasta ahora. El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva». Se borra el código de `anular`, su requisito en la capacidad y su mención en la guía, el README y el glosario del producto.

## Capacidades

- Modificadas: `bookings` — se quita el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna — señales: REMOVED/MODIFIED (un requisito quitado, uno renombrado) · tamaño: ~20 líneas en 7 ficheros. Un único usuario del comando (la misión lo dice), sin datos persistentes que migrar.

1. **`anular` pasa a ser un comando desconocido**: responde lo mismo que cualquier comando que no existe, `salas`, sin mensaje nuevo ni aviso de «retirado» — es lo que hace hoy `run` con un comando sin rama, y no añado texto que nadie pidió.
2. **Se borra también el código muerto**: `voidBooking` y el estado `voided` de `src/app.js` (solo los usaba `anular`). `findBooking` y `cancelBooking` no cambian.
3. **El renombrado del requisito no cambia sus escenarios**: «Cancelar una reserva» conserva los mismos GIVEN/WHEN/THEN (`cancelar Norte lun` → `cancelada Norte lun`; sin reserva → `sin reserva Norte lun`). Como el título es la clave de fusión, va como `REMOVED` del título viejo + `ADDED` del nuevo.
4. **Glosario `PRODUCT.md`**: quito la línea «Anulación» (el término deja de existir). **No toco** la definición de «Cancelación» («la que anula el propio cliente antes de 24 h»): habla de «propio cliente» y de 24 h, que no están en el requisito; si con el renombrado quieres que cambie, dímelo en «Cambios».
5. **Historia intacta**: el changelog `[0.3.0]` («Cancelar una reserva propia.»), la release cerrada del roadmap y los patches/specs anteriores se quedan como están; son lo que se entregó entonces. El cierre añade al changelog una entrada `Removed` para esta feature.
6. **Propósito de la capacidad**: «Reservar, cancelar y anular salas…» pasa a «Reservar y cancelar salas desde la línea de comandos.»; lo edita el cierre junto a la fusión del delta.
7. **Test nuevo**: `test/retire-void.test.js` comprueba que `anular` ya no anula (tras `anular Norte lun`, `cancelar Norte lun` responde `cancelada Norte lun`, no `sin reserva`). Va primero, en rojo.
8. **Aviso de conflicto con la fila 0011** del roadmap («Anular reservas de otros: solo el responsable de cada sala anula…»): hoy depende de un comando que esta feature retira, y esa fila **no la toco**. Antes de arrancar la 0011 hay que decidir si se descarta o se replantea; lo dejo dicho, no lo resuelvo yo.
9. **Fusión probada** en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` → «quitado «Anular una reserva» · quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva»», sin rechazos. El Propósito no lo fusiona el script (decisión 6). El comportamiento de `anular` retirado (responde `salas`, decisión 1) no entra como requisito en la capacidad: una capacidad cuenta lo que existe, y lo cubre el test (decisión 7).
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `anular` deja a cualquiera marcar como anulada la reserva de otra persona, algo que el producto no quiere sostener (fila 0012 del roadmap: «el comando anular desaparece»). Éxito: `anular` no existe en el código, en la capacidad ni en la documentación, `cancelar` sigue igual y `node --test && node scripts/lint.mjs` queda en verde. Fracaso aunque compile: que `anular Norte lun` siga modificando una reserva, o que la guía, el README o la capacidad sigan nombrándolo.

## Scope

- Entra: quitar la rama `anular` de `run`, `voidBooking` y el estado `voided` en `src/app.js`; quitar el requisito «Anular una reserva» y renombrar «Cancelar una reserva propia» en `bookings`; actualizar su Propósito; quitar `anular` de `docs/guia.md` y `README.md`; quitar «Anulación» de `PRODUCT.md`; test nuevo; entrada de changelog en el cierre.
- No entra: mensaje de «comando retirado»; cambiar la regla de quién puede cancelar o las 24 h de `PRODUCT.md`; tocar las filas 0010 y 0011 del roadmap; reescribir la historia (changelog 0.3.0, specs y patches anteriores).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` | `src/app.js:31` | Scope; el requisito, `REMOVED` |
| `voidBooking` y estado `voided` | `src/app.js:21-27` | Scope y decisión 2 |
| Requisito «Anular una reserva» y su respuesta `anulada <sala> <día>` | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Título «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` (decisión 3) |
| Propósito «Reservar, cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 6 |
| `anular <sala> <día>: … lo retira la 0012` | `docs/guia.md:7` | Scope |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | Scope |
| Término «Anulación» | `PRODUCT.md:11` | decisión 4 |
| «Anular reservas de otros» (usa `anular`) | `.docs/sdd/roadmap.md:8` (fila 0011) | decisión 8: no se toca, se avisa |
| «Cancelar una reserva propia» (histórico) | `.docs/sdd/changelog.md` (0.3.0), `.docs/sdd/roadmap.md` (v0.3.0) | decisión 5: historia, se queda |

- Filas que implementa: 0012 → `.docs/sdd/roadmap.md:9` (la fila misma; el cierre la pasa a hecha) y `docs/guia.md:7` («lo retira la 0012»; la línea entera se borra) | búsqueda hecha: `grep -rniE "anular|anulad|void|0012"` sobre el repo sin `.git`; `capabilities/` y `skills/` solo aportan el requisito de `bookings` (en este proyecto no hay `skills/`).

## Approach

Se borra el comando de punta a punta —código, requisito, documentación— sin dejar sustituto: quien quiera quitar una reserva usa `cancelar`. `anular` cae en la rama por defecto que ya existe para cualquier comando desconocido. La capacidad queda con dos requisitos: reservar lo que ya tenía y «Cancelar una reserva».

## Dónde se prueba

- `anular` ya no anula: por `run`, como los tests de `test/cancel.test.js`.
- `cancelar` sigue igual: los tests existentes de `test/cancel.test.js`.
- La guía sin `anular` y dentro de su tope de 60 palabras: `test/words.test.js`, sin cambios.
- README, `PRODUCT.md` y capacidad sin `anular`: `grep -rniE "anular|voided" --exclude-dir=.git .` sin resultados fuera de la historia (decisión 5) y de la fila 0011.

## Términos y ADR

- Términos resueltos: «Anulación» se retira del glosario; «Cancelación» queda como está (decisión 4).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Anular una reserva**
- motivo: el comando `anular` se retira (fila 0012 del roadmap)

**REMOVED — Cancelar una reserva propia**
- motivo: el requisito pasa a llamarse «Cancelar una reserva»

**ADDED — Cancelar una reserva**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
