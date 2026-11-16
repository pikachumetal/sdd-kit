---
id: 20261115-194509-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: in-review
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` deja de existir: si escribes `anular Norte lun`, ya no anula la reserva, solo responde `salas`, como con cualquier comando que el programa no conoce. `cancelar Norte lun` sigue igual y responde `cancelada Norte lun`. La guía y el README dejan de mencionar `anular`, y el requisito de la capacidad pasa a llamarse «Cancelar una reserva». Por dentro se borran la función que anulaba y el estado que dejaba la reserva.

Validación: dev-lead — el comando lo usa una persona desde la terminal: tiene que ver que `anular` ya no hace nada y que `cancelar` sigue igual.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva»; «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»; se añade el requisito «Anular ya no es un comando».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (la superficie de comandos de la CLI), MODIFIED/REMOVED (dos `REMOVED` y dos `ADDED` en `bookings`), visibilidad o permisos (se retira lo que hacía el responsable) · tamaño: ~45 líneas en 5 ficheros
- Dominio (opus): si renombrar «Cancelar una reserva propia» cambia la regla frente a «Cancelación» de PRODUCT.md, y qué puede hacer el responsable entre la 0012 y la 0011 (señal: MODIFIED + permisos)
- Técnica (sonnet): si el escenario «Anular ya no es un comando» falla de verdad contra el código actual y si `voidBooking` es un export que alguien importa (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el renombrado abre la cancelación de reservas ajenas, que es lo que el dev-lead no ha dicho

1. Enfoque: borrar `voidBooking` y su rama en `run` (A), frente a dejar la función sin comando (B) o a dar un error propio de «comando retirado» (C). Ver Approach.
2. Tras retirarlo, `anular Norte lun` se comporta como cualquier comando desconocido: responde `salas` (el literal que ya da `run`) y no toca la reserva. No he creado mensaje de error nuevo. Ese literal queda en el AND del escenario como heredado de `run`, no como regla nueva; la 0011 lo quitará al volver a introducir `anular`.
3. Requisito nuevo «Anular ya no es un comando», con ese escenario: sin él, el test que prueba la retirada no tendría un THEN que lo respalde. La capacidad lo nombra, pero no documenta `anular` como comando disponible.
4. El renombrado de «Cancelar una reserva propia» es `REMOVED` del título viejo + `ADDED` del nuevo (el título es la clave de fusión). Los escenarios se copian tal cual: no cambia ningún literal de respuesta. **Atención:** el título nuevo ya no dice «propia». Hoy `cancelar` no comprueba de quién es la reserva y esta feature no lo cambia; si quieres que la capacidad siga diciendo «propia» o fije la regla, dímelo.
5. `docs/guia.md`: solo se borra la línea de `anular`; «cancela tu reserva» no se toca (el dev-lead pidió actualizar la guía, no reescribir su redacción).
6. `README.md`: «Comandos: `cancelar` y `anular`» pasa a «Comando: `cancelar`».
7. El propósito de `bookings.md` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos»; es una edición directa del fichero, porque la fusión de requisitos no toca el propósito.
8. `PRODUCT.md` (término «Anulación») y la fila 0011 del roadmap («Anular reservas de otros», que vuelve a introducir `anular` solo para el responsable) no se tocan: la 0011 es una feature aparte y el término sigue vivo para ella. Hasta la 0011 nadie anula reservas; el responsable cancela con `cancelar`, como cualquiera.
9. `CHANGELOG.md` no se edita aquí: lo escribe el corte de `sdd-end-release`.
10. El estado interno `voided` y el export `voidBooking` desaparecen: `git grep -n -i "voided\|voidBooking" -- . ':!.docs/sdd/specs'` solo da `src/app.js:20`, `:23` y `:31`; ningún test ni documento los nombra (la búsqueda no cuenta esta carpeta `changes/`, que sí los cita); y `git grep -n -i "anular" -- test` está vacío. Es una ruptura de la superficie de la CLI (`anular` pasa de `anulada Norte lun` a `salas`), aceptada por el dev-lead al pedir la retirada.
11. Tope de `docs/guia.md`: sin cambio (60); la edición lo acorta de 42 a 28 palabras.
12. Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: «quitado Anular una reserva · quitado Cancelar una reserva propia · añadido Cancelar una reserva · añadido Anular ya no es un comando», exit 0; el propósito queda sin tocar (de ahí la decisión 7).
13. Las cinco reglas de `bookings` (datos en memoria, comandos en castellano, límites, avisos y conflicto) no cambian; solo desaparece el estado `voided` de lo que vive en memoria.
- Política de modelos: revisores de la spec — dominio (opus) y técnica (sonnet), más una segunda ronda (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

- **Aceptado** — Crítico (técnica): el THEN `salas` no distingue «retirado» de «inexistente» → el peso pasa al THEN observable (estado intacto) y `salas` queda como literal heredado en un AND; RED exigido contra el código actual.
- **Rechazado** — Crítico (dominio): quitar «propia» cambia la regla → el renombrado es literal del dev-lead («pasa a llamarse «Cancelar una reserva»»); en el código no cambia nada, porque `cancelar` nunca comprobó propiedad. No lo revierto, pero lo marco a la cabeza de la decisión 4 para que lo valides.
- **Aceptado** — comprobar el estado solo con `cancelar` → dicho en «Dónde se prueba»: no hay otra vía de lectura, la reserva es la semilla.
- **Aceptado** — «tu»→«una» en la guía (ambas lentes) → revertido: la guía solo pierde la línea de `anular` (decisión 5).
- **Aceptado** — el Intent contradice la capacidad (decía «cualquiera» anula) → reescrito: la capacidad lo reservaba al responsable, el comando no lo comprobaba.
- **Aceptado** — criterio de éxito que `bookings` no mencione `anular` → acotado a «no documenta `anular` como comando disponible».
- **Aceptado** — el requisito nuevo es provisional y fija `salas` → decisiones 2 y 3: la 0011 lo quitará; `salas` va heredado.
- **Aceptado** — qué puede hacer el responsable hasta la 0011 → decisión 8 y Scope.
- **Aceptado** — escenarios con «alguien» frente a los términos de PRODUCT.md → «la persona», como el original.
- **Aceptado** — las cinco reglas por nombre → decisión 13.
- **Segunda ronda** (sin Críticos): aceptado — el test nuevo va en su propio fichero por el estado en memoria compartido; el orden fusión/propósito/índice aclarado; la 0011 hereda el `REMOVED`; salida exacta del grep de aceptación; búsqueda de `anular` en `test/`; el motivo del `REMOVED` remite a la decisión 4; Scope reconciliado con el test nuevo. Rechazado — medir la guía con `wc -w` tras editarla en vez de simularla: el `wc -w` real se repite en la Task 2 y el gate lo cubre con `test/words.test.js`.
- **Rechazado** — el tope de 28 es estimación → es exacto: la edición solo quita esa línea.
- **Aceptado** — orden merge/propósito e índice → «Orden de la edición» en Approach.
- **Aceptado** — `voidBooking` es un export y es ruptura de la CLI; evidencia de la búsqueda → decisión 10.
- **Rechazado** — «Anulación» en PRODUCT.md y las 24 h → fuera de alcance (decisión 8); la discrepancia de las 24 h no es de esta feature.
- **Aceptado** — nada en el gate detecta un `anular` olvidado → criterio de aceptación con `git grep` en la validación.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `salas` tiene dos comandos para quitar una reserva: `cancelar` y `anular`. La capacidad dice que `anular` lo ejecuta el responsable de sala, pero el comando no lo comprueba: lo ejecuta cualquiera. El dev-lead decide retirarlo; volverá más tarde (fila 0011) solo para el responsable. Éxito: `anular Norte lun` ya no anula nada, `cancelar Norte lun` sigue respondiendo `cancelada Norte lun`, y la capacidad, la guía y el README no documentan `anular` como comando disponible. Fracaso aunque funcione: que `anular` siga cambiando el estado de una reserva por una vía que ya no se documenta, o que se rompa `cancelar`.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `run` en `src/app.js`.
- Entra: delta de `bookings` (retirar «Anular una reserva», renombrar el requisito de cancelar, añadir «Anular ya no es un comando»), y el propósito de `bookings.md`.
- Entra: `docs/guia.md` y `README.md`.
- Entra: un test nuevo en su propio fichero, `test/retire-void.test.js`.
- Entra: la 0011 hereda el `REMOVED` de «Anular ya no es un comando» al volver a introducir `anular` (su fila del roadmap no cambia, decisión 8).
- No entra: comprobar de quién es la reserva al cancelar (hoy `cancelar` no lo comprueba y el renombrado no lo cambia); un mensaje de error para comandos desconocidos; la anulación por el responsable (fila 0011); `PRODUCT.md`; `CHANGELOG.md`; el motivo al cancelar (fila 0010).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` (estado `voided`) | `src/app.js:20-25`, `src/app.js:31` | Scope; borrado en la Task 1 (decisiones 1 y 10) |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:8-14` | delta, `REMOVED` + `ADDED` «Cancelar una reserva» (decisión 4) |
| «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` (propósito) y salida de `sdd capability index` | Scope; edición directa (decisión 7) |
| Línea `anular <sala> <día>` (con «lo retira la 0012») | `docs/guia.md:8` | Scope; decisión 5 |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | Scope; decisión 6 |
| Término «Anulación» | `PRODUCT.md` (Terminology) | decisión 8: se queda, lo usa la 0011 |
| Fila 0011 «Anular reservas de otros» | `ROADMAP.md:8` | decisión 8: no cambia |

- Filas que implementa: 0012 → `ROADMAP.md:9` (su fila) y `docs/guia.md:8` («lo retira la 0012»; la línea desaparece entera) · comprobado con `git grep -n -i "anular\|void\|0012"` fuera de `.docs/sdd/specs/`.

## Approach

- A. Borrar `voidBooking` y la rama `if (cmd === 'anular')` — el cambio mínimo: `anular` cae en el `return 'salas'` final de `run`, como cualquier comando desconocido. Cuesta que la 0011 tendrá que reescribir la función.
- B. Dejar `voidBooking` exportada sin comando — conserva código muerto para la 0011; nadie la prueba ni la usa, y el estado `voided` seguiría existiendo sin camino que lo produzca.
- C. Responder con un error propio («comando retirado») — da más información a quien lo use, pero es un comportamiento nuevo que nadie pidió, y obliga a decidir su texto.
- Orden de la edición: la Task 2 edita el propósito a mano (junto a la guía y el README); la fusión del delta (`sdd capability merge`) la hace el cierre, que no toca el propósito. `sdd capability index` y el grep de aceptación se comprueban al validar, con la fusión ya hecha.
- Elegido: A — es lo que pide el dev-lead («se retira el comando anular»): sin código muerto ni comportamiento nuevo; si la 0011 lo quiere, lo escribe con su regla de permisos.

## Dónde se prueba

- `anular` ya no anula: por `run('anular', …)`, como los tests de `test/cancel.test.js`; un test nuevo, en su propio fichero `test/retire-void.test.js` (cada fichero corre en un proceso aparte con `node --test`, así la semilla en memoria llega intacta), comprueba que no responde `anulada Norte lun` (responde `salas`) y que después `cancelar Norte lun` responde `cancelada Norte lun` (la reserva no se tocó). Se ve fallar primero contra el código actual (RED: `anulada Norte lun`). La reserva es la de la semilla de `src/app.js`; no hay otra vía para leer su estado que `cancelar`. `run` no recibe identidad, así que el resultado no depende de quién ejecuta (tampoco el responsable anula hasta la 0011).
- `cancelar` sigue igual: los dos tests existentes de `test/cancel.test.js`, sin cambios.
- Guía: el test de topes `test/words.test.js` (guia.md ≤ 60 palabras).
- README, guía y capacidad: sin test nuevo; criterio de aceptación en la validación del dev-lead, tras la fusión del delta en el cierre: `git grep -n -i anular -- README.md docs/guia.md src` no devuelve nada; `git grep -n -i anular -- .docs/sdd/capabilities` solo devuelve las líneas del requisito «Anular ya no es un comando» (su título, el WHEN y el AND); y `sdd capability index` dice «Reservar y cancelar salas…».

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (fila 0012); el responsable volverá a anular, con su regla de permisos, en la fila 0011.

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado; el requisito pasa a llamarse «Cancelar una reserva», sin cambio de comportamiento: `cancelar` no comprobaba de quién era la reserva ni antes ni después (decisión 4).

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### ADDED — Anular ya no es un comando

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN la reserva no cambia de estado: `cancelar Norte lun` después responde `cancelada Norte lun`, no `sin reserva Norte lun`
- AND `anular` no responde `anulada Norte lun`: responde `salas`, el literal que `run` ya da a cualquier comando desconocido

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 (`wc -w docs/guia.md` → 42) | 18 | sin cambio: la edición lo deja en 28 (`grep -v anular docs/guia.md \| wc -w` → 28) |

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
