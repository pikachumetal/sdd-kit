---
id: 20261112-212149-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy, si escribes `anular Norte lun`, la reserva de Norte del lunes pasa a «anulada». Tras el cambio ese comando ya no existe: responde `salas`, como cualquier orden que la herramienta no conoce, y la reserva sigue activa (`cancelar Norte lun` responde `cancelada Norte lun`). La guía, el README y la capacidad `bookings` dejan de hablar de `anular`, y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva». Por dentro se borran la función `voidBooking` y su rama en `run`.

Validación: dev-lead — el comando `anular` desaparece de lo que ve quien usa la herramienta; lo observa una persona, y la frase de delegación no nombra al agente.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva», «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» y se añade «Anular ya no es un comando».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (`anular` es un comando de la CLI que usa el responsable), MODIFIED/REMOVED (tres requisitos de `bookings`) · tamaño: ~35 líneas en 5 ficheros
- Dominio (opus): si retirar «Anular una reserva» deja a `cancelar` con el mismo comportamiento que hoy, y si el renombrado «Cancelar una reserva» cambia quién puede cancelar (señal: MODIFIED + rol del responsable)
- Técnica (sonnet): si quitar `voidBooking` y la rama de `run` deja `anular` cayendo al `salas` por defecto y no queda código muerto del estado `voided` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el renombrado esconde un cambio de permisos, el hueco que no se ve desde el código

1. Enfoque: A (borrar la función y su rama), frente a B y C (ver Approach).
2. Tras retirarlo, `anular Norte lun` responde `salas`, la respuesta por defecto de cualquier comando que `run` no reconoce (hoy devuelve `salas`; el requisito fija solo el caso de `anular`); no añado un mensaje propio de «comando retirado» — el roadmap dice que el comando «desaparece». Como esa promesa necesita un escenario que la fije, añado el requisito `ADDED` «Anular ya no es un comando» a `bookings` (ver Delta). Ninguna reserva puede quedar ya «anulada»; los datos viven en memoria, así que no hay reservas anuladas que migrar.
3. El renombrado quita la palabra «propia» del título, y eso tiene una consecuencia que dejo a la vista para que la valides: la capacidad ya no limita `cancelar` a la reserva de quien la pide, y sin `anular`, el responsable cancela con `cancelar` igual que cualquiera. El código de hoy ya funciona así (`cancelBooking` en `src/app.js` busca por sala y día, sin mirar quién pide; no hay concepto de persona), así que no cambia ningún comportamiento observable; lo que cambia es que la regla escrita deja de decir «propia». No invento titulares ni roles en los escenarios: el producto no los tiene. En la fusión va como `REMOVED` del título viejo + `ADDED` del nuevo, que es como lo hace el kit con un renombrado.
4. La línea de Propósito de `bookings` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos.»; la fusión no toca el Propósito, así que va en el Scope como edición directa del cierre.
5. `README.md`: «Comandos: `cancelar` y `anular`» pasa a «Comandos: `cancelar`»; solo quito `anular`, sin afirmar exclusividad ni añadir `libres` o `reservar`, que no es lo pedido.
6. `PRODUCT.md` queda como está, con el término **Anulación** (sin comando que lo respalde mientras tanto) y la definición de **Cancelación** («la reserva que anula el propio cliente antes de 24 h», que tampoco coincide ya con el requisito sin «propia» ni con la regla «Límites: no aplica» de la capacidad): tocar el glosario es más de lo decidido y la 0011 puede volver a necesitar «anulación» (ver 7). Queda como desfase conocido; propuesta: revisarlo cuando se resuelva la 0011. Por eso el criterio de éxito de la Intent habla de documentos que presentan `anular` como comando disponible, no de que la palabra desaparezca.
7. **Solape con la 0011** («Anular reservas de otros», ⏳ en Now): pide un comando de anulación para el responsable, justo el que esta feature retira. No toco su fila; la dejo señalada para que el dev-lead decida si se mantiene, se reformula o se retira.
8. `CHANGELOG.md` no entra: el corte de release escribe la entrada «Removed».
9. Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: «quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva» · añadido «Anular ya no es un comando» · quitado «Anular una reserva»», sin rechazos; el Propósito queda como estaba (de ahí la decisión 4). La capacidad no queda vacía, así que no hay «Retiradas».
10. Política de modelos: revisores de la spec dominio opus + técnica sonnet, en paralelo · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): el renombrado quita «propia» y cambia quién puede cancelar → decisión 3 reescrita con la consecuencia explícita (el responsable cancela como cualquiera; el código ya lo hacía) para que la valides.
- **Aceptado** — Crítico (técnica): la promesa «`anular` responde `salas` y la reserva sigue cancelable» no tenía escenario → `ADDED` «Anular ya no es un comando» (decisión 2).
- **Aceptado** — Crítico (técnica): el test no fijaba la secuencia → «Dónde se prueba» da la secuencia exacta y un fichero propio `test/anular.test.js`.
- **Aceptado** — Importante: el grep del criterio de éxito no admitía el test nuevo ni `anula`/`voided` → comando exacto con lista cerrada de hits; «y el glosario» eliminado (era `PRODUCT.md`).
- **Aceptado** — Importante: el glosario de `PRODUCT.md` queda desfasado → decisión 6 lo declara como desfase conocido, sin tocarlo.
- **Aceptado** — Importante: contrato y datos sin declarar → línea «Contrato y datos» en el Scope.
- **Aceptado** — Menor: el motivo del `REMOVED` introducía comportamiento → el motivo queda solo en el motivo.
- **Rechazado** — Importante (dominio): faltan las cinco reglas de la capacidad → el delta no introduce datos, nombres, topes ni avisos nuevos; la plantilla las pide solo en ese caso.
- **Rechazado** — Importante (dominio): una línea por rol con lo permitido y prohibido → el producto no tiene roles en el código ni en la capacidad que no sean los de `anular`, que se retira; la decisión 3 dice qué le queda al responsable.
- **Rechazado** — Menor (técnica): separar la política de modelos de las decisiones → es la línea que la plantilla pone en `delegate`.
- **Rechazado** — Menor (técnica): explicar el efecto del perfil y dar dueño a la 0011 → el perfil lo dijo el dev-lead; la 0011 queda señalada en la decisión 7 y decidirla no es de esta feature.

**Segunda ronda** (un revisor sonnet sobre la spec corregida; sin Críticos):

- **Aceptado** — Importante: el grep omitía `PRODUCT.md:13` (la definición de Cancelación casa con `anula\b`) → añadido, comprobado ejecutándolo.
- **Aceptado** — Importante: el requisito prometía «cualquier comando desconocido» y solo fijaba `anular` → renombrado «Anular ya no es un comando» y la decisión 2 dice que fija solo ese caso.
- **Aceptado** — Importante: el motivo del `REMOVED` de «propia» decía «no cambia» → ahora cita la decisión 3.
- **Aceptado** — Menor: README «Comando: `cancelar`» afirmaba exclusividad → «Comandos: `cancelar`» (decisión 5); recuento «~35 líneas en 5 ficheros»; `ROADMAP.md:9` añadido a los hits esperados.
- **Rechazado** — Importante: registrar el desfase de `PRODUCT.md` en `debt.md` → ya está como decisión 6 con su propuesta; abrir deuda es decisión del dev-lead.
- **Rechazado** — Menor: la 0011 como decisión aparte → es la decisión 7, a validar con esta lista.
- **Rechazado** — Menor: comprobar el estado con `libres` → `libres` filtra por franja y no por día, y el `cancelar` posterior ya prueba que la reserva seguía activa.

### Decisiones tomadas con el dev-lead

- Se retira el comando anular — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `salas` tiene un comando `anular <sala> <día>` para que el responsable anule la reserva de otra persona. Se retira: `anular` deja de existir y la guía deja de mencionarlo. Éxito: `anular Norte lun` ya no cambia ninguna reserva (la de Norte del lunes sigue activa y se puede cancelar), `cancelar` se comporta exactamente igual que antes, y ningún documento vivo del producto menciona `anular` como comando disponible. Fracaso aunque los tests pasen: dejar en la guía, el README o la capacidad una referencia al comando retirado.

## Scope

- Entra: quitar `voidBooking` y su rama en `run` de `src/app.js`; retirar de `bookings` el requisito «Anular una reserva»; renombrar «Cancelar una reserva propia» a «Cancelar una reserva»; añadir a `bookings` el requisito «Anular ya no es un comando»; editar el Propósito de `bookings`; quitar la línea de `anular` de `docs/guia.md` y ajustar `README.md`; un test nuevo (`test/anular.test.js`) que fija que `anular` ya no hace nada.
- Contrato y datos: se retira el comando `anular` de la CLI; los datos viven en memoria, sin migración ni otros consumidores del estado `voided`.
- No entra: `PRODUCT.md` (decisión 6), la fila 0011 del roadmap (decisión 7), `CHANGELOG.md` (decisión 8), cualquier cambio de comportamiento de `cancelar`, validar quién cancela.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` (`voidBooking`, estado `voided`, respuesta `anulada …`) | `src/app.js:20-25`, `src/app.js:31` | Scope: se borra; sin otros usos del estado `voided` |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16` | delta, `REMOVED` |
| Título «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` «Cancelar una reserva» (decisión 3) |
| «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` (Propósito) | Scope, edición directa (decisión 4) |
| «`anular <sala> <día>`: anula la reserva de otra persona; lo retira la 0012.» | `docs/guia.md:8` | Scope: se quita la línea |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | Scope, decisión 5 |
| Término **Anulación** | `PRODUCT.md:14` | decisión 6: se queda |
| Fila «Anular reservas de otros» | `ROADMAP.md:8` | decisión 7: se queda, señalada |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») y su destino: la línea se quita entera.

## Approach

- A. Borrar `voidBooking` y su rama de `run` — el comando cae en el `salas` por defecto; es el cambio mínimo y lo que dice la fila («desaparece»).
- B. Dejar `anular` respondiendo un mensaje propio («comando retirado») — avisa a quien aún lo escriba, pero inventa un texto y mantiene una rama muerta que luego habría que quitar.
- C. Marcarlo obsoleto una versión y retirarlo después — no hay más usuarios que quien lo desarrolla (PRODUCT.md), así que el periodo de aviso no protege a nadie.
- Elegido: A — el único usuario es el propio dev-lead, que ya decidió retirarlo; el resto cuesta código sin comprador.

## Dónde se prueba

- `anular` ya no hace nada: test nuevo en `test/anular.test.js` (fichero propio, para partir del estado inicial: node ejecuta cada fichero en su proceso y `cancel.test.js` ya cancela Norte lun), por `run`, como los tests de cancelar actuales. Secuencia: `run('anular', ['Norte','lun'])` es igual a `salas`; después `run('cancelar', ['Norte','lun'])` es `cancelada Norte lun` (la reserva inicial de Norte el lunes seguía activa).
- `cancelar` sin cambios: los dos tests actuales de `test/cancel.test.js`.
- Documentos y código: `git grep -nEi "anular|anulad|anula\b|voided" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'` solo debe listar `PRODUCT.md:13`, `PRODUCT.md:14`, `ROADMAP.md:8` (0011), `ROADMAP.md:9` (la propia 0012, que el cierre pasa a ✅ pero no borra) y el test nuevo; ejecutado hoy, además de esas líneas devuelve `bookings.md`, `README.md`, `docs/guia.md` y `src/app.js`, que son justo lo que la feature quita; sin hits en `src/`, `README.md`, `docs/` ni `.docs/sdd/capabilities/` (que no se excluye).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: pasa a llamarse «Cancelar una reserva»; se quita «propia» del título (decisión 3), y el comportamiento observable de `cancelar` no cambia.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### ADDED — Anular ya no es un comando

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas` y no cambia ninguna reserva
- AND `cancelar Norte lun` responde después `cancelada Norte lun`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
