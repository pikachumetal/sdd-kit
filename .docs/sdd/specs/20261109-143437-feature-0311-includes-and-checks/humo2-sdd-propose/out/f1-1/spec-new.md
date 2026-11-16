---
id: 20261109-200152-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-09
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-09
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela sin preguntar por qué. Con esto, `cancelar Norte lun --motivo sala-ocupada` guarda el motivo y responde `cancelada Norte lun (sala ocupada)`; sin motivo, o con uno que no está en la lista, no cancela y dice cuáles valen. Un comando nuevo, `canceladas`, lista las canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda una clave de motivo y el listado la traduce a texto.

Validación: dev-lead — es un comando que usa una persona; la frase de delegación no concede validación por el agente.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~45 líneas en 2 ficheros
- Dominio (sonnet): si «cancelar sin motivo no cancela» rompe algo que `cancelar` hace hoy, y si `canceladas` deja fuera las anuladas (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar el cambio de comportamiento de `cancelar` sin motivo, que antes cancelaba

1. Forma de elegir: argumento `--motivo <clave>` de `cancelar`, no pregunta interactiva — la herramienta es de una línea y se prueba con `run(cmd, params)`.
2. Claves de la lista: `cambio-de-planes`, `sala-ocupada`, `otro`; texto que se muestra: `cambio de planes`, `sala ocupada`, `otro` — kebab-case en el argumento, castellano en pantalla (constitution, art. 4).
3. El motivo es obligatorio: `cancelar Norte lun` sin `--motivo` no cancela y responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`. Cambia el comportamiento actual (cancelaba sin más).
4. Motivo fuera de la lista (`--motivo lluvia`): no cancela y responde `motivo no válido: lluvia; elige cambio-de-planes, sala-ocupada u otro`.
5. Se valida el motivo antes de buscar la reserva: `cancelar Sur mar` sin motivo responde `falta el motivo…` aunque no haya reserva.
6. Respuesta al cancelar: `cancelada Norte lun (cambio de planes)`.
7. Listado: comando nuevo `canceladas`, porque hoy no existe ningún listado de canceladas; una línea por reserva, `<sala> <día> <franja> · <texto del motivo>`; sin ninguna, `sin canceladas`.
8. `canceladas` no incluye las anuladas (`voided`, las de `anular`, que ya existe): son otra cosa (PRODUCT.md, Anulación).
9. `otro` no lleva texto libre — YAGNI; si hace falta, otra fila.
10. Enfoque: A, frente a B y C (ver Approach).
11. Capacidad nueva `booking-cancellation` (inglés, kebab-case): el proyecto aún no tiene `capabilities/`; la crea el cierre al fusionar el delta.
12. Dos tasks previstas, no se parte la feature: Task 1, cancelar con motivo (decisiones 1-6, 13-14); Task 2, comando `canceladas` (7-8).
13. Parseo: `--motivo <clave>` va tras sala y día (`cancelar Norte lun --motivo otro`); `--motivo` sin valor cuenta como sin motivo. El flag se busca solo después de sala y día: `cancelar --motivo otro Norte lun` toma `--motivo` por sala y `otro` por día, no ve motivo y responde `falta el motivo: …` (decisión 5); no cancela nada ni se avisa del orden. Argumentos de más se ignoran; con `--motivo` repetido vale el primero. Una reserva ya cancelada no está activa: `cancelar` responde `sin reserva …`, también con motivo válido.
14. La reserva guarda `reason` con la clave; `cancelBooking(room, day)` pasa a `cancelBooking(room, day, reason)`: es un export del propio fichero, sin más consumidor que `run` y los tests. Las canceladas anteriores a este cambio no existen (memoria), así que no hay migración.
15. `canceladas` muestra la franja guardada de cada reserva; el orden no se fija.
16. Límite aceptado: las reservas viven en memoria (operations.md), así que `canceladas` solo ve lo cancelado en el mismo proceso; en la línea de comandos, un `cancelar` y un `canceladas` por separado dan `sin canceladas`. Persistir queda fuera, es otra feature.
17. `cancelar` pasa de ADDED a la capacidad nueva, no MODIFIED: no hay `capabilities/` donde modificar; la ruptura con el comportamiento anterior está en la tabla «Lo que se retira o cambia de forma» y en la decisión 3.
18. PRODUCT.md define Cancelación como la que se hace «antes de 24 h»; el código no lo aplica hoy ni esta feature lo añade: la capacidad se llama `booking-cancellation` y describe lo que hace el comando, y el cierre, al escribir el término «Motivo», no toca esa definición.
19. Comprobado que nada del repo llama a `cancelar` salvo `run` y los tests (`git grep` en `scripts/`, `package.json`, `README.md`): el cambio de comportamiento no rompe scripts propios; el changelog del cierre lo dirá.
20. `anular` sigue sin motivo y no cambia (la 0011 trata quién anula).
21. Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: «añadido» para cada uno de los 8 requisitos en `booking-cancellation.md`, sin rechazos.
- Política de modelos: sin revisor de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high; Arquitectura no aplica · sin otros despachos en paralelo · el proyecto no fija `control.maxParallelAgents`

### Hallazgos de la review

Dos rondas, con un revisor de dominio (sonnet) cada una. La segunda, por el Crítico aceptado de la primera.

Ronda 1, diez hallazgos:
- **Aceptado** — Crítico: `canceladas` solo ve el proceso actual → decisión 16 y GIVEN del escenario «Listado de canceladas» en el mismo proceso.
- **Aceptado** — «regla de 24 h» no está en el código → quitada del Scope; queda como nota en «No entra».
- **Aceptado** — ADDED vs MODIFIED → decisión 17 y fila de la tabla.
- **Aceptado** — faltan escenarios (motivo válido sin reserva, `--motivo` sin valor, ya cancelada, inválido sin reserva) → decisión 13 y escenarios nuevos.
- **Aceptado** — review contradictoria → este bloque.
- **Aceptado** — decisiones en el cuerpo → 14, 15 y 18.
- **Aceptado** — nombrar las tasks → decisión 12.
- **Aceptado** — líneas citadas verificadas (`test/cancel.test.js:6` y `:10`, `roadmap.md:7`, `changelog.md:20`, `src/app.js:17` y `:30`); `voidBooking` intacto → decisión 18.
- **Rechazado** — añadir «Motivo» a PRODUCT.md ahora → lo escribe el cierre, como dice «Términos y ADR».
- **Rechazado** — control de rol de quién cancela → fuera de alcance y no cambia con esta feature; anotado en «No entra».

Ronda 2, diez hallazgos (sin tercera ronda):
- **Aceptado** — escenarios mezclados → separados en «Sin reserva activa», «Ya cancelada», «El motivo se valida antes de buscar la reserva» y «El motivo es obligatorio».
- **Aceptado** — discrepancia con las 24 h de PRODUCT.md → decisión 18.
- **Aceptado** — scripts que llamen a `cancelar` → decisión 19, comprobado.
- **Aceptado** — parseo con `--motivo` fuera de sitio → decisión 13.
- **Aceptado** — orden del listado sin escenario → decisión 15 deja de fijarlo.
- **Aceptado** — salida del merge citada → decisión 21; la línea «un revisor / sin revisor» es la opción mínima del bloque, no una contradicción.
- **Rechazado** — `cancelar` sin sala ni día → ya hoy responde `sin reserva undefined undefined`; fuera de alcance.
- **Rechazado** — mover `CANCEL_REASONS` a la decisión 2 → es del Approach, no un valor de usuario.
- **Rechazado** — `status: approved` frente a validación del dev-lead → son pasos distintos: la validación es la del cierre.


### Decisiones tomadas con el dev-lead

- Apruebo la spec por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Roadmap 0010 y la lista pedida — «Añade un motivo al cancelar una reserva, de una lista: cambio de planes, sala ocupada, otro.»

## Intent

Hoy se cancela sin dejar rastro del porqué. Se quiere elegir uno de tres motivos al cancelar y verlo después en el listado de canceladas, dentro del mismo proceso (las reservas viven en memoria). Éxito: ninguna reserva queda cancelada sin motivo de la lista. Fracaso aunque funcione: que `cancelar` siga cancelando sin motivo o con uno inventado.

## Scope

- Entra: `--motivo` en `cancelar` con validación, y el comando `canceladas`, en `src/app.js`; tests en `test/cancel.test.js`.
- No entra: texto libre en `otro`, motivo al anular (0011), persistencia (decisión 16), filtros del listado, quién puede cancelar y la regla de las 24 h de PRODUCT.md, que el código no aplica hoy.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:6` y `:10`, `.docs/sdd/changelog.md:20` (histórico) | decisión 3; los tests pasan a llevar `--motivo`; el changelog no se toca |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`, `test/cancel.test.js:6` | decisión 6 |

- Filas que implementa: 0010 → `roadmap.md:7` la nombra; el cierre la mueve a hecha | `git grep` de «0010» y «motivo» fuera de `specs/`: solo el roadmap.

## Approach

- A — `--motivo <clave>` validado contra una lista fija en `src/app.js` — cabe en el fichero único y se prueba por `run`.
- B — pregunta interactiva por el motivo — pide stdin y rompe `run(cmd, params)` como costura de pruebas.
- C — motivo opcional con valor por defecto `otro` — la lista dejaría de ser una elección y no se distinguiría quien eligió `otro` de quien no eligió.
- Elegido: A — es lo único que obliga a elegir y se prueba como los tests de cancelar actuales.

La reserva guarda `reason` con la clave; una constante `CANCEL_REASONS` mapea clave → texto.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo no válido: `run('cancelar', …)` en `test/cancel.test.js`, como los tests actuales.
- Listado `canceladas`: `run('canceladas', [])` en `test/canceladas.test.js`, un fichero propio: cada fichero corre en su proceso, con la reserva de Norte lun intacta (las reservas viven en memoria y `reservar` no crea ninguna; con una sola reserva, el caso «cancelada y anulada a la vez» no se puede montar y por eso son dos escenarios).

## Términos y ADR

- Términos resueltos: Motivo — una de `cambio-de-planes`, `sala-ocupada`, `otro`.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN una reserva activa de Norte el lun
- WHEN se ejecuta `cancelar Norte lun --motivo cambio-de-planes`
- THEN responde `cancelada Norte lun (cambio de planes)` y la reserva queda cancelada con ese motivo

#### ADDED — El motivo es obligatorio

- GIVEN una reserva activa de Norte el lun
- WHEN se ejecuta `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

#### ADDED — El motivo se valida antes de buscar la reserva

- GIVEN ninguna reserva activa de Sur el mar
- WHEN se ejecuta `cancelar Sur mar`, sin motivo, o `cancelar Sur mar --motivo` sin valor
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- AND con `cancelar Sur mar --motivo lluvia` responde `motivo no válido: lluvia; elige cambio-de-planes, sala-ocupada u otro`

#### ADDED — Sin reserva activa no se cancela

- GIVEN ninguna reserva activa de Sur el mar
- WHEN se ejecuta `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Una reserva ya cancelada no se cancela otra vez

- GIVEN Norte lun ya cancelada
- WHEN se ejecuta `cancelar Norte lun --motivo otro`
- THEN responde `sin reserva Norte lun` y el motivo guardado no cambia

#### ADDED — Solo valen los motivos de la lista

- GIVEN una reserva activa de Norte el lun
- WHEN se ejecuta `cancelar Norte lun --motivo lluvia`
- THEN responde `motivo no válido: lluvia; elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

#### ADDED — Listado de canceladas

- GIVEN, en el mismo proceso, Norte lun 10:00-12:00 cancelada con `sala-ocupada`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`

#### ADDED — El listado no incluye las anuladas ni las activas

- GIVEN, en el mismo proceso, Norte lun anulada con `anular Norte lun`
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`
- AND con Norte lun activa, responde `sin canceladas`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-09 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
