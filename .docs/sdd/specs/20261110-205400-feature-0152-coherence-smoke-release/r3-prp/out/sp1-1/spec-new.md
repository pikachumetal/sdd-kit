---
id: 20261111-191520-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy se puede escribir `anular Norte lun` y la reserva de Norte del lunes queda anulada. Tras este cambio, `anular` deja de existir: escribirlo responde `salas`, igual que cualquier comando desconocido, y la reserva sigue activa. `cancelar Norte lun` sigue igual, y el requisito deja de llamarse «Cancelar una reserva propia» para llamarse «Cancelar una reserva». La guía y el README dejan de nombrar `anular`.

Validación: agente — nadie observa nada que no midan los tests: un comando menos y texto de documentos; ninguna pantalla nueva.

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva».

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (`anular` es un comando que se escribe en la terminal), REMOVED (un requisito) y renombrado (REMOVED + ADDED) · rol del responsable de sala (el que usaba `anular`) · tamaño: ~35 líneas en 6 ficheros
- Dominio (opus): si retirar `anular` deja sin cubrir algo que `PRODUCT.md` promete al responsable (término «Anulación») y si la fila 0011 «Anular reservas de otros» contradice esta retirada (señal: REMOVED + rol)
- Técnica (sonnet): si quitar `voidBooking` y el estado `voided` no deja otro uso, y si el THEN «responde `salas`» es lo que da `run` hoy para un comando desconocido (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar el choque con la 0011 y el término «Anulación», el hueco que no se ve hasta que alguien lee el roadmap
```

1. Enfoque: borrar `anular` sin alias ni mensaje de «retirado», frente a dejar un aviso «anular ya no existe» o mantener el código y solo quitarlo de la guía (ver Approach).
2. Tras retirarlo, `anular Norte lun` responde `salas`, lo que ya devuelve `run` para cualquier comando desconocido; no escribo un mensaje propio.
3. Retirar es borrar también el estado `voided` y la función `voidBooking`: nada más los usa (comprobado con `git grep`).
4. El renombrado «Cancelar una reserva propia» → «Cancelar una reserva» va como `REMOVED` del título viejo + `ADDED` del nuevo con los mismos GIVEN/WHEN/THEN: el título es la clave de fusión. No añado ninguna comprobación de quién es la reserva: el código hoy no la hace.
5. La línea de propósito de la capacidad («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos»: la fusión no toca esa línea, la edito en el cierre.
6. `README.md` línea 5 pierde `anular` («Comandos: `cancelar`»): nadie lo pidió, pero nombra el comando retirado.
7. Retiro el término «Anulación» de `PRODUCT.md` (Terminology): el comando que lo definía ya no existe. «Cancelación» se queda tal cual.
8. No toco `CHANGELOG.md`: lo escribe el corte de `sdd-end-release`; la entrada «Cancelar una reserva propia» de la 0.3.0 es historia y se queda.
9. **Choque con la fila 0011 «Anular reservas de otros»**: esa fila vuelve a pedir `anular` (solo para el responsable). Resuelto en la decisión 14; si se implementa después, volverá a añadir `anular` con su propio requisito.
10. **Fila 0010 «Motivo al cancelar»**: modificará «Cancelar una reserva»; con el nuevo título ya tiene clave. Sin cambios aquí.
11. Delta probado sobre una copia de `.docs/sdd` (`sdd capability merge`): «quitado «Anular una reserva» · quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva»», exit 0; el propósito queda como estaba (decisión 5). El test de `anular` no se ha podido escribir aún: va al RED de la Task 1.
12. **Quitar «propia» del título cambia lo que la capacidad dice**: deja de afirmar que se cancela solo lo propio. El comportamiento no cambia (el código nunca comprobó de quién es la reserva), y es lo que pidió el dev-lead. Pero `PRODUCT.md:13` sigue definiendo «Cancelación» como «la reserva que anula el propio cliente antes de 24 h», con «propio» y un límite de 24 h que el código no aplica (es anterior a esta feature). No reescribo esa definición: es una regla de producto. **Valida o dime el texto nuevo.**
13. El responsable de sala: tras retirar `anular` no tiene comando propio. Puede usar `cancelar` como cualquiera, porque no hay comprobación de dueño; nada se lo prohíbe ni se lo concede. Con una sola persona usuaria (`PRODUCT.md`), el rol no tiene contrapartida real hoy.
14. **Propuesta para la 0011 y la 0010**: las dos llevan `0012` en la columna `Tras` de `ROADMAP.md`. La 0011 pide `anular` y esta feature lo retira (la reformulación o el descarte los decide el dev-lead); la 0010 modifica «Cancelar una reserva» y, si fuese antes, tocaría el título viejo y esta feature lo borraría. Aprobar la spec confirma los dos `Tras`; no toco sus textos.
18. Validación `agente` (cabecera): un comando que se retira lo mide un test y un `git grep`; nadie vería nada más. Aun así `anular` es un contrato de terminal que desaparece, y dejarlo en `agente` es decisión mía: si prefieres que lo valides tú, dilo.
19. Ruptura: retirar `anular` y el export `voidBooking` es incompatible. Se anota en el corte de `sdd-end-release` como `### Removed` del changelog; `git grep voidBooking -- test` no da nada, no hay tests previos que borrar.
15. El test de `anular` va en un fichero nuevo, `test/void-retired.test.js`: `bookings` es un array en memoria del módulo y cada fichero de test corre en su propio proceso, así el estado parte limpio y el orden de `cancel.test.js` no cuenta. La reserva de partida existe ya: `src/app.js:3` crea la de Norte el lunes al cargar el módulo. «La reserva sigue activa» se prueba con `cancelar Norte lun` → `cancelada Norte lun` justo después de `anular`.
16. El criterio «ningún documento vivo nombra `anular`» se comprueba con `git grep -niE "anular|Anulación" -- docs README.md PRODUCT.md .docs/sdd/capabilities` sin resultados; `ROADMAP.md` queda fuera (la 0011 lo nombra, y la 0012 es esta fila) y `CHANGELOG.md` también (historia). El tope de palabras de la guía no comprueba esto.
17. La capacidad integrada no recoge un escenario de «`anular` responde `salas`»: un comando retirado es un comando desconocido, y lo prueba el test, no un requisito.
- Política de modelos: revisores de la spec: dominio opus y técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza la guía — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): quitar «propia» amplía lo que dice el requisito → declarado en la decisión 12, con la definición de `PRODUCT.md` marcada para que el dev-lead dicte el texto.
- **Aceptado** — Crítico (dominio): la 0011 contradice la 0012 → decisión 14 y la fila 0011 con «Tras 0012» en el Scope.
- **Aceptado** — complemento del rol del responsable (dominio 3, 7) → decisión 13.
- **Aceptado** — éxito no comprobable (dominio 4, técnica 2) → criterio acotado y con comando, decisión 16.
- **Aceptado** — límite de 24 h sin tratar (dominio 5) → dicho en la decisión 12 como anterior a esta feature.
- **Aceptado** — «Anulación» confundía comando y concepto (dominio 6) → Términos y ADR reescrito.
- **Aceptado** — orden y estado compartido del test (técnica 1, 4, 5) → decisión 15, fichero nuevo.
- **Aceptado** — `voidBooking` es un export; propósito y fila 0012 sin dueño (técnica 7, 8) → tabla y Scope.
- **Aceptado** — pregunta de la 0011 sin resolver (técnica 9) → decisión 14.
- **Aceptado** — sin escenario del `REMOVED` (técnica 3) → decisión 17, sin escenario a propósito.
- **Segunda ronda (un revisor)**: aceptado — 0010 también `Tras 0012` (Crítico, decisión 14); definición de «Cancelación» sin texto (queda como pregunta del gate, decisión 12); comprobación del `git grep` (decisión 16 y «Dónde se prueba»); `src/app.js:32` citado; validación `agente` y ruptura (decisiones 18 y 19); propósito de la capacidad como paso del plan. **Rechazado** — Crítico: el test no tiene reserva de partida → falso, `src/app.js:3` la crea al cargar el módulo (decisión 15); y requisito «Comando desconocido» en `bookings` → comportamiento que ya tenía el producto, fuera de esta feature. No hay tercera ronda.
- **Rechazado** — técnica 4: un test del estado «cancelada» más allá del mensaje → `cancelar` no cambia en esta feature; el renombrado no añade comportamiento que probar.

## Intent

Hoy `salas` ofrece `anular`, que el responsable de sala usa para anular una reserva. El dev-lead lo retira: el comando desaparece del producto y de su documentación. Éxito: `anular` no hace nada que no haga un comando desconocido, `cancelar` no cambia, y ni la guía, ni el README, ni `PRODUCT.md`, ni la capacidad nombran `anular` (decisión 16). Sería un fracaso que se retirase el comando y la guía lo siguiera anunciando, o que `cancelar` dejase de funcionar.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; el delta de `bookings` (retira «Anular una reserva», renombra el requisito de cancelar); `docs/guia.md` (sin la línea de `anular`); `README.md` (sin `anular`); `PRODUCT.md` (sin el término «Anulación»); la línea de propósito de `bookings.md` (con `git grep anular` en ese fichero sin resultados); un test de que `anular` ya no anula, en `test/void-retired.test.js`; las filas 0010 y 0011 de `ROADMAP.md` con `0012` en `Tras` (decisión 14) y la 0012 pasada a hecha al cerrar.
- No entra: reescribir el texto de la 0010 o de la 0011; la definición de «Cancelación» de `PRODUCT.md` (decisión 12); un mensaje de «comando retirado»; una comprobación de quién es la reserva al cancelar; `CHANGELOG.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular`, export `voidBooking` y estado `voided` | `src/app.js:20-25`, `src/app.js:31` | Scope; decisión 3 |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Título «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9`; `CHANGELOG.md:20` (0.3.0) | delta (`REMOVED` + `ADDED`); el changelog es historia: decisión 8 |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 5, en el cierre |
| `anular` en la guía | `docs/guia.md:8` | Scope |
| `anular` en el README | `README.md:5` | Scope; decisión 6 |
| Término «Anulación» | `PRODUCT.md:14` | Scope; decisión 7 |
| Respuesta `anulada <sala> <día>` | `src/app.js:24` | desaparece con la función |
| Filas del roadmap que lo nombran | `ROADMAP.md:8` (0011), `ROADMAP.md:9` (0012) | la 0011: decisión 14 (`Tras 0012`); la 0012 es esta |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») se borra con la línea; ningún otro fichero la nombra (`git grep -n "0012"` fuera de `specs/`).

## Approach

- A. Borrar el comando y su función, sin alias ni aviso — un comando menos: `run` ya cae en `salas` para lo desconocido; cuesta que quien escriba `anular` no sepa por qué.
- B. Dejar un mensaje «anular ya no existe» — da una pista, pero añade una respuesta que nadie pidió y hay que mantenerla; en un producto de una sola persona usuaria no compensa.
- C. Mantener el código y solo quitarlo de la guía — deja código muerto y un comando que sigue anulando reservas: no cumple «el comando desaparece».
- Elegido: A — es lo que dice la fila («el comando anular desaparece») y lo más pequeño; B y C añaden o dejan lo que se quería quitar.

La reserva sigue activa tras `anular`; el estado `voided` desaparece del código.

## Dónde se prueba

- `anular` ya no existe: `run('anular', ['Norte', 'lun'])` en `test/void-retired.test.js` (fichero nuevo, decisión 15), con el estilo de los tests de cancelar actuales; comprueba `salas` y que `cancelar Norte lun` después aún responde `cancelada Norte lun`.
- Cancelar no cambia: los dos tests actuales de `test/cancel.test.js`, sin tocarlos.
- `anular` fuera de los documentos: un paso de la Task 2 que corre `git grep -niE "anular|Anulación" -- docs README.md PRODUCT.md .docs/sdd/capabilities` y espera cero resultados; `words.test.js` solo vigila el tope de palabras de la guía (sin cambio) y no prueba esto.
- Un comando desconocido responde `salas`: `src/app.js:32`, la rama por defecto de `run`; el test de `anular` lo fija.

## Términos y ADR

- Términos resueltos: «Anulación» deja de ser término del producto: retira el comando y también el concepto (la reserva que quita el responsable «por cualquier motivo»); si la 0011 lo recupera, lo definirá de nuevo.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: el dev-lead retira el comando `anular`; tras retirarlo, `anular Norte lun` responde `salas` y la reserva sigue activa.

#### REMOVED — Cancelar una reserva propia

- motivo: el requisito pasa a llamarse «Cancelar una reserva»; el título es la clave de fusión y un renombrado es `REMOVED` + `ADDED`.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (lo previsto resta 14 palabras: 42 → 28) |

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
