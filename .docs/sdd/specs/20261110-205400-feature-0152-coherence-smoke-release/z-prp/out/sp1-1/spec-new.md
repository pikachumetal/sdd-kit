---
id: 20261112-155954-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `anular Norte lun` deja la reserva anulada y responde `anulada Norte lun`. Tras el cambio ese comando no existe: no toca ninguna reserva, y la de Norte el lunes sigue activa hasta que alguien la cancele con `cancelar Norte lun`. El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva», con el mismo escenario. La guía, el README y el glosario dejan de hablar de anular. Del programa se quitan la función que anulaba y el estado «anulada».

Validación: dev-lead — es un comando que una persona usa hoy; el agente no puede dar por bueno lo que ve quien lo ejecuta.

Qué deja de poder hacerse: el responsable de sala pierde su único comando propio. Tras el cambio solo queda `cancelar`, que hoy no comprueba de quién es la reserva; no hay ninguna regla de responsable hasta la 0011. El límite «antes de 24 h» del glosario no lo aplica el código hoy; esta feature no lo toca.

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva»; «Cancelar una reserva propia» pasa a «Cancelar una reserva»; se añade «Comando anular retirado»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED/REMOVED (tres requisitos de `bookings`), contrato público (`anular` es un comando que la gente ejecuta), visibilidad (se retira lo que solo hacía el responsable) · tamaño: ~35 líneas en 6 ficheros
- Dominio (sonnet): que retirar «Anular una reserva» no deje a nadie sin poder hacer algo que el producto promete y que `cancelar` no cubre; que el glosario quede coherente (señal: REMOVED + rol del responsable)
- Técnica (sonnet): que no quede ninguna referencia viva a `anular`, `voidBooking` ni al estado `voided`, y que el test falle hoy por la razón correcta (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el responsable de sala se queda sin vía para liberar una sala ocupada (lo que quiere recuperar la 0011)

1. Enfoque: borrado directo de la función y la ruta, frente a dejar el comando con un aviso «retirado» o conservar la función sin ruta (ver Approach).
2. `anular Norte lun` pasa a responder lo mismo que cualquier comando desconocido (hoy `salas`); no añado mensaje de «comando retirado»: nadie lo pidió. El THEN solo fija que la reserva no cambia.
3. El escenario de «Cancelar una reserva» es idéntico al de «Cancelar una reserva propia»; solo cambia el título. Que `cancelar` no compruebe de quién es la reserva (hoy el código no lo hace) no se toca aquí.
4. Se retira del glosario de `PRODUCT.md` el término **Anulación**; **Cancelación** no se toca (su «anula» es el verbo, no el término retirado).
5. La línea «lo retira la 0012» desaparece de `docs/guia.md` junto con la del comando (la guía conserva `libres`, `reservar` y `cancelar`); el README pasa a «Comandos: `cancelar`; guía en [docs/guia.md](docs/guia.md).», sin decir que es el único.
6. El propósito de `bookings` pasa a «Reservar y cancelar salas desde la línea de comandos»; lo edito directamente en `capabilities/bookings.md`, porque la fusión solo mueve requisitos (comprobado en la copia, ver abajo).
7. La fila 0011 del roadmap («Anular reservas de otros») queda como está: solo decidiste retirar el comando. Pero esa fila pide volver a anular: decide tú si se mantiene tras esta.
8. Validación `dev-lead` y no `agente`: lo que ve una persona al ejecutar el comando cambia.
9. Capacidad `bookings` con el nombre exacto del índice; no hay capacidad nueva y las cinco reglas no cambian (datos en memoria, comandos en castellano; límites, avisos y conflicto «no aplica»).
10. El renombre es `REMOVED` + `ADDED` y no `MODIFIED`, porque el título es la clave de fusión. Quitar «propia» no cambia el comportamiento (el código nunca comprobó de quién es la reserva), pero el título deja de decirlo.
11. Añado el requisito «Comando anular retirado» para tener un escenario del que cuelgue el test; su THEN no fija la respuesta de `anular` (hoy `salas`), solo que la reserva no cambia.
12. El test nuevo se llama `test/retired-command.test.js` para no reintroducir el término retirado; el aislamiento del estado en memoria es por fichero (`node --test` lanza un proceso por fichero) y el test hace `anular` y después `cancelar`, en ese orden.
13. `CHANGELOG.md` queda fuera: lo escribe el corte de la release, que debería anotar la retirada como cambio incompatible (un comando público desaparece).
14. Al retirar **Anulación** desaparece la única definición de «responsable de sala» en `PRODUCT.md`; no la sustituyo: la 0011 deberá definir el término cuando devuelva el rol.
15. «Comando anular retirado» es un requisito transitorio: si la 0011 devuelve `anular`, lo retirará ella.
- Política de modelos: dos revisores de la spec, sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → quitado «Cancelar una reserva propia», añadido «Cancelar una reserva», añadido «Comando anular retirado», quitado «Anular una reserva», rc=0; el propósito no cambia con la fusión (decisión 6).

### Hallazgos de la review

- **Aceptado** — Crítico, dominio: el responsable pierde su único comando y la spec no lo decía → párrafo «Qué deja de poder hacerse» bajo la validación y en el Intent; la 0011 sigue como pregunta en la decisión 7.
- **Aceptado** — Crítico, técnica: faltaba un escenario del que colgara el test → requisito `ADDED` «Comando anular retirado» (decisión 11).
- **Aceptado** — Importante, dominio y técnica: el criterio de éxito y la búsqueda eran incumplibles (`anula` sigue en `PRODUCT.md:13`, `ROADMAP.md`, `capabilities/bookings.md`) → búsqueda acotada a `anular`, `anulada`, `Anulación`, `voidBooking`, `voided`, con los hits permitidos listados.
- **Aceptado** — Importante, técnica: el README no es «el único comando» → decisión 5 reescrita.
- **Aceptado** — Importante, dominio: quitar «propia» cambia lo que dice el título → decisión 10 y motivo del `REMOVED`.
- **Aceptado** — Menor, técnica: faltaban decisiones en ✋ (nombre del test, `CHANGELOG`, REMOVED+ADDED) y el nombre `void.test.js` reintroducía el término → decisiones 10 a 13, test `retired-command.test.js`.
- **Aceptado** — Menor, dominio: reglas de la capacidad mal resumidas → decisión 9.
- **Rechazado** — Importante, técnica: asertar la respuesta de `anular` → el dev-lead no pidió ninguna respuesta; fijarla sería inventar un contrato (decisión 2).
- **Rechazado** — Menor, dominio: quitar «antes de 24 h» del glosario → fuera de alcance; la 24 h no es del término retirado.
- **Rechazado** — Menor, técnica: propósito «Cancelar salas» → el propósito vigente ya cubría reservar; solo se quita «anular».
- **Aceptado** — Importante, 2.ª ronda: el test nuevo da un hit en la búsqueda → entra en los hits permitidos y el Intent dice «ninguna mención salvo las listadas».
- **Aceptado** — Importante, 2.ª ronda: efecto de las 24 h, término «responsable de sala», requisito transitorio, retirada incompatible en el changelog → párrafo bajo la validación y decisiones 13 a 15; el motivo del `REMOVED` dice que se pierde la titularidad.
- **Rechazado** — Crítico, 2.ª ronda: el THEN de «Comando anular retirado» pasaría hoy sin el cambio → hoy `anular` deja la reserva en estado `voided` y `cancelar` solo busca reservas activas, así que responde `sin reserva Norte lun`: el test falla hoy por la razón correcta. La reserva de Norte el lunes ya está en el programa (no hace falta `reservar`).
- **Rechazado** — Importante, 2.ª ronda: cerrar la 0011 en esta spec o tocar el roadmap → es una decisión del dev-lead, ya pedida en la decisión 7.
- **Rechazado** — Menor, técnica y dominio: anotar la dependencia 0011→0012 en el roadmap y retirar el mínimo razonable → el roadmap no entra en esta feature (decisión 7); el mínimo es solo la propuesta de review.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy el producto ofrece `anular`, un comando del responsable de sala que el dev-lead decidió retirar (fila 0012). Se quiere que el comando, su función, su estado y toda mención suya (salvo las listadas en la búsqueda) desaparezcan, y que `cancelar` quede como único modo de liberar una reserva; el responsable de sala pierde así su única vía propia hasta la 0011. Éxito: `anular Norte lun` no modifica nada, la búsqueda de abajo solo da los hits permitidos y `node --test` sigue en verde. Fracaso aunque funcione: dejar el término «Anulación» en el glosario o `voided` en el código.

## Scope

- Entra: quitar `voidBooking` y la ruta `anular` de `src/app.js`; un test (`test/retired-command.test.js`) que muestre que `anular Norte lun` ya no anula; el requisito «Comando anular retirado»; el delta de `bookings`; el propósito de `capabilities/bookings.md`; `docs/guia.md`; `README.md`; el término **Anulación** de `PRODUCT.md`.
- No entra: la fila 0011 (volver a anular, solo para el responsable); un mensaje de «comando retirado»; comprobar de quién es la reserva al cancelar; `CHANGELOG.md` (lo escribe el corte de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` | `src/app.js:31`; `README.md:5`; `docs/guia.md:8` | Scope; delta `REMOVED` |
| Función `voidBooking` y estado `voided` | `src/app.js:20-25` | Scope; decisión 1 |
| Respuesta `anulada <sala> <día>` | `src/app.js:24`; `capabilities/bookings.md:20` | delta `REMOVED` |
| Requisito «Anular una reserva» | `capabilities/bookings.md:16` | delta `REMOVED` |
| Título «Cancelar una reserva propia» | `capabilities/bookings.md:9` | delta `REMOVED` + `ADDED` (el título es la clave de fusión) |
| Propósito «…cancelar y anular salas…» | `capabilities/bookings.md:5` | decisión 6 |
| Término **Anulación** | `PRODUCT.md:14` | decisión 4 |
| «Cancelación … anula el propio cliente» | `PRODUCT.md:13` | decisión 4, no se toca |
| Fila «Anular reservas de otros» | `ROADMAP.md:8` | decisión 7, no se toca |
| Fila 0012 y «lo retira la 0012» | `ROADMAP.md:9`; `docs/guia.md:8` | Scope (se borra la línea de la guía); la fila la cierra `sdd-archive` |

- Filas que implementa: 0012 → `docs/guia.md` la nombra y se borra esa línea; `ROADMAP.md` la cierra `sdd-archive`.
- Búsqueda: `git grep -n "anular\|anulada\|Anulación\|voidBooking\|voided" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'`. Hits permitidos al acabar: `ROADMAP.md` (fila 0012), `capabilities/bookings.md` («Comando anular retirado») y `test/retired-command.test.js`. `PRODUCT.md:13` usa el verbo «anula» y no coincide con la búsqueda.

## Approach

- Borrado directo — quitar función, ruta y estado; lo más corto, sin código muerto; `anular` pasa a ser un comando desconocido.
- Comando con aviso «retirado» — orienta a quien siga escribiéndolo; añade una respuesta nueva que nadie pidió y que habría que retirar algún día.
- Conservar la función sin ruta — guarda código para la 0011; pero es código muerto sin test y la 0011 lo reescribirá con su regla de responsable.
- Elegido: borrado directo — es lo que pide la fila 0012 («el comando anular desaparece»); el coste es que quien escriba `anular` verá `salas`, como con cualquier comando desconocido.

La prueba va por `run`, como `test/cancel.test.js`, en un solo test: tras `run('anular', ['Norte','lun'])`, `run('cancelar', ['Norte','lun'])` aún devuelve `cancelada Norte lun`, porque la reserva seguía activa.

## Dónde se prueba

- `anular` ya no anula: por `run`, como los tests de cancelar; un test nuevo en `test/retired-command.test.js`, del escenario «Comando anular retirado».
- Cancelar sigue igual: `test/cancel.test.js`, sin cambios.
- Documentos y propósito de `bookings`: `git grep` con la búsqueda de arriba y lectura del propósito tras la fusión (la edición a mano va después de la fusión); sin prueba automática.

## Términos y ADR

- Términos resueltos: **Anulación** queda retirado del glosario.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: el requisito se renombra a «Cancelar una reserva»; el escenario no cambia; el título deja de decir «propia» y se pierde, a propósito, esa restricción de titularidad

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### ADDED — Comando anular retirado

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN la reserva sigue activa y `cancelar Norte lun` responde `cancelada Norte lun`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (fila 0012)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
