---
id: 20261102-170328-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` desaparece: quien escriba `anular Norte lun` ya no anula nada, y la reserva de Norte del lunes sigue activa; se obtiene la respuesta de cualquier comando desconocido. Cancelar no cambia: `cancelar Norte lun` sigue respondiendo `cancelada Norte lun`, y el requisito deja de llamarse «Cancelar una reserva propia» para llamarse «Cancelar una reserva». La guía deja de mencionar `anular`.

Validación: dev-lead — es un comando que usa una persona; el dev-lead comprueba que `anular` ya no hace nada y que `cancelar` sigue igual.

## Capacidades

- Nuevas: ninguna
- Modificadas: `bookings` — se retira «Anular una reserva» y «Cancelar una reserva propia» pasa a «Cancelar una reserva»
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `REMOVED` (el delta quita «Anular una reserva» y el título viejo del requisito de cancelar) · tamaño: ~40 líneas en 5 ficheros
- Mínimo razonable: ninguna — una sola señal contada; no hay rol, contrato ni dato nuevos. Lo que queda sin mirar por otro ojo es el repaso de coherencia, que he hecho yo (sección «Lo que se retira o cambia de forma»).

1. **Qué responde `anular` después de retirarlo** — la respuesta de cualquier comando desconocido (hoy `salas`), sin mensaje propio y sin tocar la reserva. Nadie lo dijo; un aviso del tipo «comando retirado» sería un texto nuevo que nadie ha pedido.
2. **Renombrar = quitar el título viejo y añadir el nuevo**: el delta lleva `REMOVED — Cancelar una reserva propia` y `ADDED — Cancelar una reserva`, porque el título es la clave de fusión. Los escenarios se copian tal cual (`cancelada Norte lun`, `sin reserva Norte lun`); no cambia ningún comportamiento de cancelar.
3. **El código muerto se va con el comando**: `voidBooking` y el estado `voided` de `src/app.js`. No hay datos que migrar: las reservas viven en memoria.
4. **`docs/guia.md`**: se quita la línea de `anular` y la línea de `cancelar` pasa de «cancela tu reserva» a «cancela una reserva», para que diga lo mismo que el requisito renombrado. (El dev-lead dijo solo «la guía se actualiza»; el cambio de `cancelar` es mío.) El fichero baja de 42 a unas 25 palabras, bajo su tope de 60.
5. **`README.md`** (línea 5, «Comandos: `cancelar` y `anular`») pasa a nombrar solo `cancelar`: sin eso el README anunciaría un comando que no existe. Nadie lo pidió.
6. **Se queda como está**: el `[0.3.0]` del changelog y la línea «Cancelar una reserva propia» de las releases cerradas del roadmap (historia de una versión ya publicada); la entrada «Anulación» del glosario de `PRODUCT.md`, porque la 0011 («Anular reservas de otros») la vuelve a usar; la fila 0011 del roadmap, aunque ahora parte de un comando que la 0012 retira: cuando se haga, será un `ADDED` y no un `MODIFIED`. **Si prefieres otra cosa en estos tres, dilo al aprobar.**
7. **Propósito de `bookings`**: la fusión no toca el propósito (comprobado), así que la edición va en el Scope y la hace el cierre: «Reservar, cancelar y anular salas desde la línea de comandos.» pasa a «Reservar y cancelar salas desde la línea de comandos.» El texto nuevo es mío.
8. **Orden de las tasks**: dos, la 1 (RED + retirada en `src/app.js`) y la 2 (guía y README). Dos tasks: no se propone partir.
- Resultado de `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal fuera del repo: sale 0; `bookings.md: quitado «Cancelar una reserva propia»` · `añadido «Cancelar una reserva»` · `quitado «Anular una reserva»`. Deja el propósito sin tocar (decisión 7); `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin `architecture.md`) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `anular Norte lun` marca como anulada la reserva de Norte del lunes, sin comprobar quién lo pide. El dev-lead decidió retirar el comando; el motivo no está escrito en el roadmap (la 0011 prevé más tarde un `anular` solo para el responsable de cada sala). Éxito: tras el cambio, `anular Norte lun` no modifica ninguna reserva y la documentación (capacidad, guía y README) no menciona el comando. Fracaso, aunque pase el gate: que quede código o texto que lo anuncie, o que `cancelar` cambie de respuesta.

## Scope

- Entra: quitar `anular` de `src/app.js` (`voidBooking`, el estado `voided` y la rama de `run`); un test que fije que `anular` ya no cambia la reserva; el delta de `bookings` (retirar «Anular una reserva», renombrar el requisito de cancelar); el propósito de `bookings` (decisión 7); `docs/guia.md`; `README.md`.
- No entra: ningún cambio de `cancelar`; la 0011 (rol de responsable); el glosario de `PRODUCT.md`; la historia del changelog `[0.3.0]` y de las releases cerradas del roadmap; un mensaje propio para el comando retirado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` / estado `voided` | `src/app.js:20-25`, `src/app.js:31` | Scope: se eliminan (decisión 3) |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Título «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9`; `changelog.md:20` (`[0.3.0]`); `roadmap.md:34` (release cerrada) | delta, `REMOVED` + `ADDED` (decisión 2); changelog y roadmap, historia: se quedan (decisión 6) |
| Propósito «Reservar, cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | Scope: el cierre lo edita (decisión 7) |
| Línea de `anular` | `docs/guia.md:8` | Scope: se quita |
| «cancela tu reserva» | `docs/guia.md:7` | decisión 4 |
| «`cancelar` y `anular`» | `README.md:5` | decisión 5 |
| Glosario «Anulación» | `PRODUCT.md:10` | decisión 6: se queda por la 0011 |
| Fila 0011 «Anular reservas de otros» | `roadmap.md:8` | decisión 6: se queda |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012»: se quita con la línea) y `roadmap.md:9` (la marca el cierre de `sdd-archive`) | búsqueda hecha: `grep -rniE "anula|void|propia|0012"` sobre el repo sin `.git`; los tests no mencionan `anular` ni `voided`.

## Approach

Se quita el comando y su código muerto, se escribe el test de que `anular` ya no toca la reserva, y se alinea la documentación con el requisito renombrado. Nada de lo que `cancelar` hace cambia.

## Dónde se prueba

- `anular` retirado: por `run('anular', ['Norte', 'lun'])`, como los tests de `test/cancel.test.js`; comprueba que responde lo mismo que un comando desconocido y que `run('cancelar', ['Norte', 'lun'])` después aún devuelve `cancelada Norte lun` (la reserva no se anuló).
- `cancelar` no cambia: los dos tests existentes de `test/cancel.test.js`.
- Guía bajo su tope: `test/words.test.js`, ya existente.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: pasa a llamarse «Cancelar una reserva»; el título es la clave de fusión

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (fila 0012)

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
