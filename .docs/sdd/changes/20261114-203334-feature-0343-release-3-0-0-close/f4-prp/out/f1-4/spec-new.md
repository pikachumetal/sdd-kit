---
id: 20261116-141455-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-16
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-16
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista cerrada: `salas cancelar Norte lun sala ocupada` cancela y responde `cancelada Norte lun: sala ocupada`. Sin motivo, o con uno fuera de la lista, no cancela y dice cuáles valen. Un comando nuevo, `salas canceladas`, enseña las canceladas con su motivo: `Norte lun 10:00-12:00: sala ocupada`. Por dentro, la reserva guarda un campo `reason` en memoria y el listado lo lee.

Validación: dev-lead — es un comando que usa una persona: el agente no se concede el atajo, y la frase de delegación no nombra `agente`.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~40 líneas en 4 ficheros
- Dominio (sonnet): si la spec mantiene la frontera de PRODUCT.md entre Cancelación y Anulación (el listado no enseña anuladas) y si «Un motivo ausente o fuera de la lista no cancela» cubre el caso de motivo en mayúsculas o con espacios de más (señal: capacidad nueva)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir una segunda lente técnica sobre el formato de salida, de poco riesgo con 4 ficheros pequeños

1. Motivos de la lista, literales: `cambio de planes`, `sala ocupada`, `otro` — los tres que pidió el dev-lead en su mensaje, tal cual.
2. El motivo es obligatorio: sin él no se cancela — «de una lista» + la fila del roadmap («se elige un motivo»); un motivo opcional dejaría canceladas sin dato.
3. El motivo se escribe tras la sala y el día, sin comillas necesarias: `cancelar Norte lun sala ocupada` (todo lo que sigue al día, unido con espacios); también vale entre comillas. Evita un formato nuevo (códigos, menús) en un CLI de un solo fichero.
4. Aviso literal ante motivo ausente o fuera de la lista: `motivo no válido: usa cambio de planes, sala ocupada u otro` — castellano (constitución, art. 4).
5. Se valida el motivo antes de buscar la reserva: `cancelar Sur mar` sin motivo da el aviso del motivo, no `sin reserva Sur mar`. Con motivo válido y sin reserva, sigue `sin reserva Sur mar`.
6. Respuesta al cancelar: `cancelada Norte lun: sala ocupada` (antes `cancelada Norte lun`): añade `: <motivo>`, mismo prefijo.
7. La comparación del motivo es exacta (sin normalizar mayúsculas ni espacios): `Sala ocupada` no vale. Es lo más simple y el aviso dice cuáles valen.
8. El listado de canceladas es un comando nuevo `canceladas` (la fila 0010 pide «el listado de canceladas», y hoy no existe ningún listado): una línea por cancelada, `<sala> <día> <franja>: <motivo>`; sin ninguna, `sin canceladas` (ver decisión 18 para separador y orden).
9. El listado solo incluye canceladas, no anuladas (`voided`): PRODUCT.md las distingue (Cancelación ≠ Anulación) y las anulaciones son de la 0011.
10. Capacidad nueva `booking-cancellation`: no hay capacidades; la cancelación es el primer comportamiento que se documenta. No documento el resto de comandos.
11. Enfoque: A (campo `reason` en la reserva y `canceladas` filtra sobre `bookings`), frente a B (lista aparte `cancellations`) y C (motivo como código numérico): ver Approach.
12. Queda fuera la regla de las 24 h de PRODUCT.md: hoy no está en el código y la fila no la pide.
13. Se actualizan los dos tests de `test/cancel.test.js`, que llamaban a `cancelar` sin motivo: la spec cambia ese comportamiento a propósito.
14. Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` en un temporal: 5 requisitos y 5 reglas añadidos, sin rechazos; solo comprueba que el delta se fusiona (no hay base viva con la que contrastarlo); `capabilities/` del repo intacto.
15. Argumentos sobrantes en `canceladas` (`canceladas x`) se ignoran, y no añado ayuda de uso: hoy el CLI no tiene `--help` y `run` ignora lo que no usa. En `cancelar` lo sobrante forma parte del motivo (`sala ocupada ya` no está en la lista) y por eso se rechaza.
16. Los tests de un fichero comparten estado en memoria y la única reserva semilla (Norte lun) solo puede cancelarse o anularse una vez por proceso: los escenarios se reparten en ficheros (`cancel.test.js` en orden: inválidos, sin reserva, éxito, ya cancelada · `cancel-comillas.test.js` · `canceladas.test.js` · `canceladas-anuladas.test.js`).
17. El código de salida no cambia: el aviso `motivo no válido…` se imprime con salida 0, como hoy `sin reserva …`; un script no distingue el fallo y no lo pide ninguna fila.
18. El separador entre líneas del listado es un salto de línea, y no prometo orden entre varias canceladas: con una sola reserva semilla no se puede probar.
19. La comparación del motivo (decisión 7) es exacta sobre el texto ya unido con un espacio: `sala  ocupada` (dos espacios) escrito suelto se une como `sala ocupada` y vale; entre comillas, con los dos espacios, no.

### Hallazgos de la segunda ronda (sin tercera ronda)

1. **Aceptado** (Crítico) — la semilla única impide probar las variantes en un mismo fichero → decisión 16 y cuatro ficheros de test.
2. **Aceptado** — orden «motivo antes que reserva» sin escenario → AND en «Un motivo ausente…» con `cancelar Sur mar`.
3. **Aceptado** — separador y orden del listado → decisión 18.
4. **Aceptado** — reserva anulada y luego `cancelar` → AND en «Cancelar sin reserva lo dice».
5. **Aceptado** — decisión 19.
6. **Aceptado** — `sin reserva <sala> <día>` añadido a Avisos.
7. **Aceptado** — decisión 17.
8. **Aceptado** — decisión 15 ampliada.

### Hallazgos de la review

1. **Rechazado** (Crítico) — el escenario de anuladas depende de `anular`, que «puede no existir» → `anular` ya existe en `src/app.js:23-27` (`voidBooking`, estado `voided`): el escenario usa comportamiento ya entregado; el revisor no leyó código. La decisión 16 dice cómo se prepara.
2. **Aceptado** (Crítico) — falta el escenario de `Sala ocupada` → añadido al requisito «Un motivo ausente o fuera de la lista no cancela».
3. **Aceptado** — comillas y unión de argumentos sin escenario → AND con `cancelar Norte lun "sala ocupada"` (un solo argumento) en el primer requisito.
4. **Aceptado** — PRODUCT.md define Cancelación con 24 h → anotado en «Términos y ADR» como pendiente, no resuelto aquí.
5. **Aceptado a medias** — ADDED es correcto (no hay capacidades vivas y el merge lo acepta); se añade el escenario de cancelar dos veces a «Cancelar sin reserva lo dice».
6. **Aceptado** — decisión 14 reescrita: solo comprueba la fusión.
7. **Aceptado** — firma `cancelBooking(room, day)` → `(room, day, reason)` añadida a la tabla; `git grep cancelBooking`: solo `run` la llama.
8. **Aceptado** — «Idioma de los nombres» precisado al texto de la interfaz.
9. **Aceptado** — «Límites» dice que no hay límite de longitud.
10. **Aceptado** — argumentos sobrantes y ayuda: decisión 15.
- Política de modelos: un revisor de spec (dominio, sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (sin módulo ni dependencia nueva) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`; al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-16)
- Parar tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy `salas cancelar Norte lun` cancela sin dejar rastro de por qué. Interesa saberlo para ver, al revisar las canceladas, si se cancela por cambios de plan o porque la sala estaba ocupada. Éxito: ninguna cancelada nueva sin motivo de la lista, y el motivo se ve en `salas canceladas`. Anti-objetivo: que un motivo mal escrito cancele igualmente y deje una cancelada con un motivo inventado. (El porqué de fondo no lo dijo nadie: lo deduzco de la fila del roadmap.)

## Scope

- Entra: `src/app.js` (`cancelBooking`, nuevo `listCancelled`, ruta `canceladas` en `run`), `test/cancel.test.js`, `test/cancel-comillas.test.js`, `test/canceladas.test.js` y `test/canceladas-anuladas.test.js` (los tres últimos, nuevos), `CHANGELOG.md` en el cierre.
- No entra: anulaciones (`anular`, 0011), la regla de 24 h, persistencia (las reservas siguen en memoria), motivos configurables, filtrar o ordenar el listado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Firma `cancelBooking(room, day)` → `cancelBooking(room, day, reason)` | `src/app.js:13`; `src/app.js:30` (único llamante: `git grep cancelBooking`) | Scope, Task 1 |
| Respuesta `cancelada <sala> <día>` → `cancelada <sala> <día>: <motivo>` | `src/app.js:17`; `test/cancel.test.js:6` | Scope y decisión 6; el test se actualiza en la Task 1 |
| `cancelar` sin motivo deja de cancelar | `src/app.js:30`; `test/cancel.test.js:6` y `:10` | decisiones 2 y 13; `ADDED` del delta |
| Menciones históricas de la cancelación | `CHANGELOG.md:14` y `:20` (versiones ya escritas) | no se tocan; la entrada nueva va en `Unreleased` al cierre |

- Filas que implementa: 0010 → `ROADMAP.md:7` (su estado lo actualiza el cierre) | sin más: comprobado con `git grep -niE "0010|motivo"` fuera de `.docs/sdd/specs`.

## Approach

- A: campo `reason` en la reserva que `cancelBooking` rellena, y `canceladas` filtra `bookings` por `status === 'cancelled'`. Cuesta una línea por sitio y no duplica datos: estado y motivo no pueden desincronizarse.
- B: lista aparte `cancellations`. Cuesta mantener dos fuentes de verdad (una reserva y su entrada) y no aporta nada hoy.
- C: motivo como código (`1`, `2`, `3`). Cuesta una tabla de equivalencias y se lee peor en el shell.
- Elegido: A, la mínima; sigue el patrón de `status` que ya tiene la reserva.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo inválido: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js` (en ese orden: los inválidos con la reserva aún activa, después sin reserva, éxito y ya cancelada). La variante entre comillas, en `test/cancel-comillas.test.js`.
- Listado: por `run('canceladas', [])`, en `test/canceladas.test.js` (cancelada) y `test/canceladas-anuladas.test.js` (anulada, y `cancelar` tras `anular`). Cada fichero corre en su proceso y aísla el estado en memoria.

## Términos y ADR

- Términos resueltos: ninguno. Pendiente, no resuelto aquí: PRODUCT.md define Cancelación como la anulación del cliente «antes de 24 h», y hoy `cancelar` no comprueba esa regla (fuera de Scope, decisión 12)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva exige un motivo de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun sala ocupada`
- THEN responde `cancelada Norte lun: sala ocupada`
- AND la reserva queda cancelada con ese motivo
- AND con el motivo en un solo argumento entre comillas (`cancelar Norte lun "sala ocupada"`) el resultado es el mismo

#### ADDED — Un motivo ausente o fuera de la lista no cancela

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `motivo no válido: usa cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa
- AND con `cancelar Norte lun vacaciones` responde lo mismo y la reserva sigue activa
- AND con `cancelar Norte lun Sala ocupada` (mayúscula) responde lo mismo: la comparación es exacta
- AND con `cancelar Sur mar` (sin motivo y sin reserva) responde `motivo no válido: usa cambio de planes, sala ocupada u otro`, no `sin reserva Sur mar`

#### ADDED — Cancelar sin reserva lo dice

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`
- AND con la reserva Norte lun ya cancelada, `cancelar Norte lun otro` responde `sin reserva Norte lun` y no cambia su motivo
- AND con la reserva Norte lun anulada (`anular Norte lun`), `cancelar Norte lun otro` responde `sin reserva Norte lun`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN la reserva Norte lun 10:00-12:00 cancelada con `sala ocupada`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00: sala ocupada`
- AND sin ninguna cancelada responde `sin canceladas`

#### ADDED — El listado de canceladas no incluye anuladas

- GIVEN la reserva Norte lun anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, campo `reason` de la reserva cancelada
- **Idioma de los nombres**: castellano en el texto de la interfaz (motivos, avisos, comando `canceladas`); los identificadores del código (`reason`, `listCancelled`) siguen en inglés
- **Límites**: lista cerrada de tres motivos: `cambio de planes`, `sala ocupada`, `otro`; sin límite de longitud, porque solo vale uno de los tres
- **Avisos**: `motivo no válido: usa cambio de planes, sala ocupada u otro` · `sin canceladas` · `sin reserva <sala> <día>`
- **Regla ante conflicto**: sin motivo válido no se cancela y la reserva sigue activa

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-16 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
