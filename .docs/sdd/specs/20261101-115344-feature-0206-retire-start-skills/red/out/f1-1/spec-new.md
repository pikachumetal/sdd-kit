---
id: 20261101-121947-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-01
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-01
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y no deja rastro de por qué. Con esta feature hay que decir el motivo, uno de tres: «cambio de planes», «sala ocupada» u «otro» (`cancelar Norte lun sala ocupada`). Sin motivo, o con uno que no está en la lista, la reserva no se cancela y se dice cuáles valen. Un comando nuevo, `canceladas`, lista las canceladas con su motivo: `Norte lun 10:00-12:00 · motivo: sala ocupada`.

Validación: dev-lead — es una CLI que se usa a mano; lo que importa es cómo se lee lo que escribe en la terminal.

## Capacidades

- Nuevas: `bookings` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`bookings`) · tamaño: ~60 líneas en 3 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo la forma de los textos de error, que la validación del dev-lead ve ejecutándolos.

1. Capacidad nueva `bookings`: `capabilities/` está vacío, así que el delta describe solo lo que añade esta feature, no el resto de reservas — el nombre es un sustantivo del dominio en inglés kebab-case.
2. El motivo es el tercer argumento de `cancelar`: `cancelar <sala> <día> <motivo>`; el roadmap solo dice «se elige de una lista», la sintaxis es mía.
3. Los tres motivos se escriben tal cual los dijiste, en minúscula y sin normalizar: `cambio de planes`, `sala ocupada`, `otro`; `Otro` no vale.
4. El motivo puede ir con o sin comillas: lo que sigue al día se une con espacios, así `cancelar Norte lun sala ocupada` funciona sin comillas.
5. Sin motivo: `indica un motivo: cambio de planes, sala ocupada, otro`, y la reserva sigue activa.
6. Motivo fuera de la lista: `motivo no válido: <lo escrito>; usa: cambio de planes, sala ocupada, otro`, y la reserva sigue activa.
7. Si no hay reserva, manda `sin reserva <sala> <día>` aunque falte o sobre el motivo: se comprueba la reserva antes que el motivo, y así el comportamiento de hoy no cambia.
8. La confirmación de una cancelación correcta no cambia: `cancelada Norte lun`, sin repetir el motivo.
9. El listado de canceladas no existe hoy (el roadmap habla de él como si sí): lo creo como comando `canceladas`, una línea por reserva `<sala> <día> <franja> · motivo: <motivo>`, en el orden en que están las reservas, y `sin canceladas` si no hay ninguna.
10. Las anuladas (`anular`) no salen en `canceladas`: son otra cosa en `PRODUCT.md` y su motivo es la fila 0011.
11. No hay migración: las reservas viven en memoria, ninguna cancelación anterior sobrevive a un reinicio.
12. Repaso de coherencia hecho: `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal añadió los 7 requisitos a `bookings.md` sin rechazar nada; `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin módulo ni dependencia nueva) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Los tres motivos de la lista: cambio de planes, sala ocupada, otro — «Añade un motivo al cancelar una reserva, de una lista: cambio de planes, sala ocupada, otro.»
- La spec queda aprobada por delegación y el agente para al tener el commit de la Task 1 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-01)

## Intent

Hoy cancelar una reserva no dice por qué, y no hay forma de ver las canceladas. Importa para saber si las salas se cancelan por cambio de planes o porque estaban ocupadas. Éxito: toda cancelación nueva lleva uno de los tres motivos y `canceladas` los enseña. Sería un fracaso que una cancelación entrara sin motivo, o que un motivo mal escrito cancelara igualmente.

## Scope

- Entra: elegir el motivo al cancelar, rechazar la cancelación sin motivo o con uno fuera de la lista, y el comando `canceladas`.
- No entra: motivos configurables o añadidos por el usuario; el motivo de las anulaciones (fila 0011); la regla de las 24 h de `PRODUCT.md`; persistencia entre ejecuciones; repetir el motivo en la confirmación.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js` (`run`, `cancelBooking`); `test/cancel.test.js`, test «cancelar una reserva activa» | delta `ADDED` «Cancelar exige un motivo de la lista»; Task 1 reescribe ese test con motivo |
| Término «motivo» | `PRODUCT.md` (Terminology), sin entrada hoy | Términos resueltos; lo escribe el cierre |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` (pasa a 🔄 en la apertura y a ✅ en el cierre) y `.docs/sdd/changelog.md` (entrada del cierre) | comprobado con `grep -rn 0010 .docs PRODUCT.md README.md`: solo el roadmap la nombra.

## Approach

Una CLI en un solo fichero: `cancelar` valida el motivo contra la lista antes de cancelar y guarda el motivo en la reserva; `canceladas` lee las reservas con estado `cancelled`. Los detalles de código son del plan.

## Dónde se prueba

- Cancelar con, sin y con mal motivo: por `run('cancelar', …)` de `src/app.js`, como los tests de `test/cancel.test.js` actuales; que la reserva sigue activa se ve con `run('libres', ['10:00-12:00'])`.
- `canceladas`: por `run('canceladas', [])`, en `test/cancel.test.js` (tras cancelar) y `test/canceladas.test.js` (listado vacío y anulada), cada fichero en su proceso con su propia memoria.

## Términos y ADR

- Términos resueltos: motivo — la razón de una cancelación, una de `cambio de planes`, `sala ocupada`, `otro`. _Evitar_: causa, razón.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva Norte lun 10:00-12:00 activa
- WHEN `cancelar Norte lun sala ocupada`
- THEN la salida es `cancelada Norte lun`
- AND `libres 10:00-12:00` pasa de `Sur` a `Norte, Sur`

#### ADDED — Cancelar sin motivo no cancela

- GIVEN la reserva Norte lun 10:00-12:00 activa
- WHEN `cancelar Norte lun`
- THEN la salida es `indica un motivo: cambio de planes, sala ocupada, otro`
- AND `libres 10:00-12:00` sigue siendo `Sur`

#### ADDED — Un motivo fuera de la lista no cancela

- GIVEN la reserva Norte lun 10:00-12:00 activa
- WHEN `cancelar Norte lun vacaciones`
- THEN la salida es `motivo no válido: vacaciones; usa: cambio de planes, sala ocupada, otro`
- AND `libres 10:00-12:00` sigue siendo `Sur`
- AND `cancelar Norte lun Otro` también se rechaza, con `motivo no válido: Otro; usa: cambio de planes, sala ocupada, otro`

#### ADDED — Sin reserva se dice antes que el motivo

- GIVEN no hay reserva activa de Sur el mar
- WHEN `cancelar Sur mar`
- THEN la salida es `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN Norte lun 10:00-12:00 cancelada con el motivo `sala ocupada`
- WHEN `canceladas`
- THEN la salida es `Norte lun 10:00-12:00 · motivo: sala ocupada`

#### ADDED — Sin canceladas el listado lo dice

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN la salida es `sin canceladas`

#### ADDED — Las anuladas no salen en el listado de canceladas

- GIVEN Norte lun 10:00-12:00 anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN la salida es `sin canceladas`

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-01 | aprobada: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
