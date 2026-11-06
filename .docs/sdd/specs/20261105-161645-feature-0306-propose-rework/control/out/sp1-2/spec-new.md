---
id: 20261106-101018-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hasta ahora `anular Norte lun` anulaba la reserva y respondía `anulada Norte lun`. Después de este cambio el comando ya no existe: la guía y el README dejan de nombrarlo, y escribirlo responde `salas`, como cualquier comando desconocido. `cancelar Norte lun` funciona igual que antes. El requisito de la capacidad «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva». En el código se borran la función y la rama de `anular`.

Validación: dev-lead — la frase del dev-lead no nombra `agente`, y el agente no se concede el atajo (decisión 12). Si prefieres que valide el agente, dilo en el gate.

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED`/`REMOVED` (se retira un requisito y se renombra otro), contrato público (`anular` es un comando que usa quien opera la herramienta) · tamaño: ~25 líneas en 6 ficheros
- Dominio (sonnet): si retirar «Anular una reserva» deja huecos en `bookings` y en el término «Anulación» de `PRODUCT.md`, y si quitar «propia» del título cambia lo que se espera de `cancelar` (señal: REMOVED + renombrado)
- Técnica (sonnet): si el THEN de `anular` tras el retiro (`salas`) es lo que da el código hoy y si la tabla de topes de `docs/guia.md` es correcta (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar el término `Anulación` y la fila 0011, el tipo de hueco que no se ve hasta que alguien lee la documentación con el comando ya retirado

1. **Enfoque (central)**: borrar el comando de verdad —función `voidBooking`, rama `anular` de `run` y estado `voided`— en vez de dejarlo respondiendo un aviso de «retirado». Descartado el aviso: el dev-lead dijo «se retira el comando», y un aviso sería un comando a medias que habría que retirar otra vez.
2. **Qué responde `anular` después**: `salas`, lo que ya responde hoy cualquier comando desconocido. Nadie dijo otro texto; no invento un mensaje de error.
3. **Renombrado del requisito**: va como `REMOVED` del título viejo + `ADDED` del nuevo, porque el título es la clave de fusión. El contenido (GIVEN/WHEN/THEN) no cambia: solo el título.
4. **Propósito de `bookings`**: «Reservar, cancelar y anular salas desde la línea de comandos.» pasa a «Reservar y cancelar salas desde la línea de comandos.». La fusión no toca el propósito: lo edita la Task 2 a mano.
5. **`PRODUCT.md`**: se borra el término «Anulación» (concepto retirado). **No toco «Cancelación»** («la reserva que anula el propio cliente antes de 24 h»): dice «propio cliente», y el requisito renombrado ya no dice «propia». Si la cancelación pasa a ser de cualquiera, hay que reescribirla; te lo dejo a ti.
6. **Fila 0011 del roadmap** («Anular reservas de otros»): depende de un comando que esta feature borra. **No la toco** (es planificación: va por `sdd-roadmap`). Necesita una decisión tuya: retirarla, o reescribirla como una regla de `cancelar`.
7. **Historia sin tocar**: `changelog.md` y la sección «v0.3.0» del roadmap dicen «Cancelar una reserva propia»; es lo que se entregó entonces.
8. **Tope de `docs/guia.md`**: la edición baja el fichero de 42 a 28 palabras, medido con el mismo criterio de `test/words.test.js` (partir por espacios; 28 = la guía sin la línea de `anular`, que tiene 14 palabras); el tope de 60 no cambia.
9. **Tests**: un RED nuevo en `test/cancel.test.js` (`anular` ya no responde `anulada…`). Hoy no hay ningún test de `anular`.
10. **Sin escenario para `anular` en la capacidad**: que `anular` responda `salas` se prueba con un test, no con un requisito: la capacidad no recoge comandos que no existen, y `salas` no tiene requisito propio (decisión 14).
11. **Delta probado en una copia** de `.docs/sdd` con `sdd capability merge`: «quitado Anular una reserva», «quitado Cancelar una reserva propia», «añadido Cancelar una reserva», con el escenario extra ya quitado (ver Hallazgos). Sin medir: nada.
12. **Validación `dev-lead`** (no `agente`): la frase del dev-lead no la nombra; quita este paso si prefieres que valide el agente.
13. **`cancelar` no tiene regla de propiedad**: hoy cancela la reserva activa de esa sala y día, sea de quien sea, y esta feature no lo cambia. Quitar «propia» del título no concede ni quita nada: quién puede cancelar lo decide la fila 0011. El rol «responsable» solo existía por `anular` y se queda sin comando. Los datos viven en memoria: no hay reservas `voided` guardadas que migrar.
14. **Reglas de la capacidad**: las cinco no cambian. `salas` no es una regla nueva: es la respuesta que ya da `src/app.js:32` (`return 'salas'`) a cualquier comando desconocido.
15. **Gate**: `node --test && node scripts/lint.mjs` sale de `operations.md` (la constitución dice solo «`node --test` entero en verde»); uso el más estricto, y el lint ya existe y no se toca.
- Política de modelos: revisores de la spec en Sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

### Hallazgos de la review

- **Aceptado** (Crítico, dominio) — quitar «propia» deja sin decir si cancelar lo de otro está permitido → decisión 13 e Intent; el contenido del requisito no cambia, sin AND nuevo.
- **Aceptado** — el escenario `salas` no cita su respaldo y el test necesita reserva previa → decisión 14 y «Dónde se prueba».
- **Rechazado** — usar `RENAMED`/`MODIFIED` para el renombrado → el kit no lo admite: el título es la clave de fusión y un renombrado es `REMOVED` + `ADDED` (plantilla); el ADDED copia el contenido literal y el merge se probó en la copia.
- **Aceptado** — nada comprueba `bookings.md` tras el merge (propósito incluido) → comprobación con `git grep` en «Dónde se prueba».
- **Aceptado** — el criterio de éxito promete «ninguna referencia» pero roadmap y changelog las conservan → Intent acotado a guía, README, `PRODUCT.md` y `bookings.md`.
- **Aceptado** — rol «responsable», estado `voided` y datos en memoria → decisión 13.
- **Aceptado** — «~28» sin método → decisión 8 y tabla, valor exacto con el criterio del test.
- **Aceptado** — validación `agente` propuesta sin frase → decisión 12, ahora `dev-lead`.
- **Aceptado** — origen del lint → decisión 15.
- **Aceptado** (Crítico, 2.ª ronda) — el escenario «Anular ya no existe» dejaba en la capacidad un nombre retirado y colgaba de un comportamiento sin requisito → se quita del delta; queda solo el test (decisión 10).
- **Aceptado** — comprobación positiva del propósito, cuenta de palabras de la línea retirada, gate más estricto declarado → «Dónde se prueba», decisión 8 y decisión 15.
- **Rechazado** — añadir a la capacidad que `cancelar` no comprueba quién reserva → sería una regla nueva que nadie pidió; vive en la decisión 13 hasta la 0011.
- **Rechazado** — unificar el patrón en `anul` → `PRODUCT.md` conserva «anula» en «Cancelación» y daría un falso positivo; vale `anular`.
- **Rechazado** — exigir antes del gate una frase sobre quién valida y resolver «Cancelación» → ambas van en ✋ (decisiones 5 y 12) para que las decidas al aprobar.
- **Rechazado** — mover la review a su sección y subir el mínimo → la forma del bloque la fija `review-spec.md`.
- **Rechazado** — la decisión 9 no sería decisión → se queda: la plantilla pide todo valor que no salió de la entrevista, y el test nuevo lo es.

## Intent

Hoy `salas` tiene dos comandos para quitar una reserva: `cancelar` y `anular`. El dev-lead decidió que `anular` desaparece (fila 0012). Éxito: `anular` ya no hace nada; la guía, el README, `PRODUCT.md` y `capabilities/bookings.md` no lo nombran —`roadmap.md`, `changelog.md` y las specs antiguas conservan su historia—; `cancelar` queda exactamente igual; el gate (`node --test && node scripts/lint.mjs`) sigue en verde. Fracaso aunque funcione: que quede una referencia a `anular` en esos documentos, o que `cancelar` cambie de respuesta.

## Scope

- Entra: borrar `voidBooking` y la rama `anular` de `src/app.js` (y el estado `voided`).
- Entra: `docs/guia.md` (línea de `anular`) y `README.md` (línea de comandos).
- Entra: `PRODUCT.md` (término «Anulación»).
- Entra: delta de `bookings` (requisito retirado + renombrado) y su propósito.
- Entra: un test nuevo en `test/cancel.test.js`.
- No entra: reglas de quién puede cancelar (fila 0011); motivo al cancelar (0010); `roadmap.md`, `changelog.md` y specs antiguas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` | `src/app.js:31`; `src/app.js:20-25` (`voidBooking`, estado `voided`); `docs/guia.md:8`; `README.md:5` | Scope; decisión 1 |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` «Cancelar una reserva» (decisión 3) |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | Scope; decisión 4 |
| Término «Anulación» | `PRODUCT.md:10` | Scope; decisión 5 |
| Término «Cancelación» («propio cliente») | `PRODUCT.md:9` | decisión 5, no se toca |
| Fila 0011 «Anular reservas de otros» | `.docs/sdd/roadmap.md:8` | decisión 6, no se toca |
| «Cancelar una reserva propia» en la historia | `.docs/sdd/changelog.md:20`; `.docs/sdd/roadmap.md:34` | decisión 7, no se toca |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012»; la línea se borra entera) y `.docs/sdd/roadmap.md:9` (su fila se cierra en el archivo, no aquí). Búsqueda: `git grep -n -i -E "anul|voided|voidBooking|0012" -- . ':!.docs/sdd/specs'`.

## Approach

Borrado simple, sin avisos de transición (decisión 1). Primero el RED (`anular` no responde `anulada…`), luego el borrado del código, después los documentos.

## Dónde se prueba

- `anular` ya no responde: por `run('anular', [...])`, como los tests de `cancelar` de `test/cancel.test.js`.
- `cancelar` sin cambios: con los dos tests que ya hay en `test/cancel.test.js`.
- La guía y el README: el tope de palabras de `test/words.test.js` y `git grep -n -i anular -- docs README.md PRODUCT.md src` sin resultados.
- `bookings.md` tras fusionar: `git grep -n -i -E "propia|anular" -- .docs/sdd/capabilities` sin resultados, y `git grep -n "Reservar y cancelar salas" -- .docs/sdd/capabilities` con una línea (el propósito se edita a mano en la Task 2).
- El RED de `anular` crea antes la reserva activa de Norte el lunes (como la que ya tiene `src/app.js`) y comprueba después que sigue activa.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: el comando `anular` se retira (fila 0012).

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado a «Cancelar una reserva»; el contenido pasa tal cual al requisito nuevo.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta a 28, medido) |

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
