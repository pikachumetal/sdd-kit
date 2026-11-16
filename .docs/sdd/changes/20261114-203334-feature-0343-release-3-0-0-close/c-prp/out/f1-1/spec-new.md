---
id: 20261115-203316-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-15
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-15
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y ya. Con esto, cancelar exige decir por qué, de una lista cerrada: `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun (motivo: sala ocupada)`. Si falta el motivo o no está en la lista, no cancela y dice cuáles valen. Un comando nuevo, `canceladas`, enseña lo cancelado con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda una clave de motivo junto a su estado.

Validación: dev-lead — es comportamiento que se usa desde la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si los THEN de «Cancelar exige un motivo de la lista» y «Listar las canceladas» cubren el borde de `anular` (no debe aparecer en `canceladas`) y si el motivo obligatorio contradice «Cancelación» de `PRODUCT.md` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si el motivo obligatorio rompe la reserva semanal o `anular`

1. Capacidad nueva `booking-cancellation` (inglés kebab-case): hoy no hay ninguna en `capabilities/`, y esta recoge también la cancelación que ya existe, porque el motivo la cambia entera.
2. El motivo es **obligatorio**, no opcional con `otro` por defecto: un valor por defecto perdería justo la información que se quiere guardar.
3. Sintaxis: `cancelar <sala> <día> --motivo <clave>`, con las claves `cambio-de-planes`, `sala-ocupada`, `otro`. Claves sin espacios ni tildes para la terminal; en pantalla salen como «cambio de planes», «sala ocupada», «otro».
4. Textos: éxito `cancelada Norte lun (motivo: sala ocupada)`; falta el motivo `falta el motivo: usa cambio-de-planes, sala-ocupada u otro`; motivo desconocido `motivo no válido «x»: usa cambio-de-planes, sala-ocupada u otro`.
5. El motivo se valida **antes** de buscar la reserva: `cancelar Sur mar` sin motivo dice que falta el motivo, no `sin reserva Sur mar`.
6. Listado: el roadmap dice que «el listado de canceladas lo enseña», pero ese listado no existe. Lo creo como `canceladas` (sin argumentos): una línea por reserva cancelada, `<sala> <día> <franja> · <motivo en pantalla>`, en orden de cancelación; sin ninguna, `sin canceladas`. Si no lo quieres, se quita la Task 2 y el motivo queda guardado sin verse.
7. `anular` no cambia: no pide motivo y sus reservas no salen en `canceladas` (el motivo de la anulación es la 0011).
8. Los tests actuales de `cancelar` (`test/cancel.test.js`) llaman sin motivo, así que pasan a llevarlo; es un cambio de esos tests, no una regresión.
9. El dato vive en memoria, en un campo `reason` de la reserva, como el resto (`operations.md`).
10. Enfoque: A, un campo `reason` en la reserva, frente a B, una lista aparte de cancelaciones, y C, motivo opcional (ver Approach).
11. Validación: dev-lead, que además es el único usuario según `PRODUCT.md`.
12. `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal: 5 requisitos y 5 reglas añadidos, salida 0; `sdd capability check --artifact`: «Capacidades válidas: 1».
### Hallazgos de la review

- **Aceptado** — «Cancelación» sin aclarar → Términos resueltos dice que no cambia y que la regla de 24 h no se aplica aquí.
- **Aceptado** — Intent no dice quién usa `canceladas` ni por qué excluye `anular` → Intent lo aclara (deliberado, la 0011).
- **Aceptado** — franja sin origen → el GIVEN de «Listar las canceladas» fija las franjas.
- **Aceptado** — el orden no se distinguía del de creación → el escenario cancela en orden inverso al de creación.
- **Aceptado** — `--motivo` sin valor → AND en «Cancelar sin motivo válido»: `falta el motivo`.
- **Aceptado** — validar el motivo antes de buscar la reserva no tenía escenario → requisito nuevo «El motivo se valida antes de buscar la reserva».
- **Aceptado** — cancelar dos veces → AND en «Cancelar una reserva que no existe lo dice»; `anular` se cita con su sintaxis actual (`anular <sala> <día>`).
- **Rechazado** — dar un valor real a «Regla ante conflicto» → «no aplica» es respuesta válida de la plantilla y aquí no hay dos vías para el mismo dato.
- **Rechazado** — comprobar `reservar` y `libres` → no leen `reason`, y el gate corre `node --test` entero.
- **Rechazado** — decisión duplicada → son dos líneas distintas (aprobación y parada), cada una con su frase literal.

- Política de modelos (solo en `delegate`): un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-15)
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para.»
- Lista de motivos — «cambio de planes, sala ocupada, otro»

## Intent

Al cancelar una reserva no queda por qué. Con el motivo guardado y visible, quien gestiona las salas ve si las cancelaciones son por planes que cambian o por salas ocupadas. `canceladas` es para quien usa la herramienta (el único usuario, según `PRODUCT.md`); las anulaciones quedan fuera adrede: su motivo es la 0011. Éxito: toda reserva cancelada tiene un motivo de la lista y `canceladas` lo enseña. Fracaso aunque funcione: que cancelar sin motivo siga posible, o que un motivo inventado quede guardado.

## Scope

- Entra: `cancelar` con `--motivo` obligatorio y validado; guardar el motivo; el comando `canceladas`.
- No entra: motivo en `anular` (0011) · otros motivos o motivos configurables · aplicar la regla de «antes de 24 h» de `PRODUCT.md` · cambiar `libres` o `reservar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18` y `:30`; `test/cancel.test.js:5-11`; `CHANGELOG.md:20` («Cancelar una reserva propia», entrada histórica) | decisión 2 y delta `ADDED`; los dos tests pasan a llevar `--motivo`; el changelog se deja, es historia |
| Salida `cancelada Norte lun` | `src/app.js:17`; `test/cancel.test.js:6` | decisión 4: pasa a `cancelada Norte lun (motivo: …)` |

- Filas que implementa: 0010 → `ROADMAP.md:7` (la fila que la define; pasa a hecha al cerrar) | `git grep -n -i -E "cancel|0010|motivo"` fuera de las carpetas de evidencia: solo `ROADMAP.md`, `PRODUCT.md` (términos, sin cambio), `CHANGELOG.md`, `src/app.js` y `test/cancel.test.js`.

## Approach

- A. Campo `reason` en la reserva — una línea más en `cancelBooking`; `canceladas` filtra `status === 'cancelled'`. Lo más pequeño y coherente con el modelo de memoria actual.
- B. Lista aparte de cancelaciones — separa el histórico, pero duplica sala y día y hay que mantener dos estructuras alineadas. Sin motivo para ello hoy.
- C. Motivo opcional con `otro` por defecto — no rompe la llamada actual, pero pierde la información y contradice «se elige un motivo».
- Elegido: A — es el cambio mínimo y no crea una segunda fuente de verdad.

Partes del cómo: `cancelBooking(room, day, reason)` valida `reason` contra `['cambio-de-planes', 'sala-ocupada', 'otro']`, guarda la clave y devuelve el texto. `run` extrae el valor tras `--motivo`. Las etiquetas de pantalla salen de un mapa clave → texto. `canceladas` recorre las reservas en orden.

## Dónde se prueba

- Cancelar con motivo, motivo ausente o inválido y `sin reserva`: por `run('cancelar', …)`, como los tests de `test/cancel.test.js`.
- `canceladas`: por `run('canceladas', [])`, en el mismo fichero; `anular` se prueba ahí que no aparece.

## Términos y ADR

- Términos resueltos: «Cancelación» no cambia de significado (la que hace el propio cliente); el motivo se pide en `cancelar` y la regla de «antes de 24 h» no se aplica aquí (No entra)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa Norte lun
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (motivo: sala ocupada)` y la reserva queda cancelada con ese motivo
- AND con `cambio-de-planes` el texto es `cambio de planes`, y con `otro`, `otro`

#### ADDED — Cancelar sin motivo válido no cancela

- GIVEN la reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `falta el motivo: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND `cancelar Norte lun --motivo` (sin valor) responde `falta el motivo: usa cambio-de-planes, sala-ocupada u otro`
- AND `cancelar Norte lun --motivo aburrimiento` responde `motivo no válido «aburrimiento»: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

#### ADDED — El motivo se valida antes de buscar la reserva

- GIVEN que no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar`
- THEN responde `falta el motivo: usa cambio-de-planes, sala-ocupada u otro`, no `sin reserva Sur mar`
- AND `cancelar Sur mar --motivo aburrimiento` responde `motivo no válido «aburrimiento»: usa cambio-de-planes, sala-ocupada u otro`

#### ADDED — Cancelar una reserva que no existe lo dice

- GIVEN que no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`
- AND cancelar dos veces Norte lun con motivo: la segunda responde `sin reserva Norte lun`

#### ADDED — Listar las canceladas con su motivo

- GIVEN las reservas Norte lun 10:00-12:00 y Sur mar 14:00-16:00 (creadas en ese orden), Sur mar cancelada antes con `otro`, después Norte lun con `sala-ocupada`, y Norte mié 09:00-10:00 anulada con `anular Norte mié`
- WHEN `canceladas`
- THEN responde dos líneas en orden de cancelación, `Sur mar 14:00-16:00 · otro` y `Norte lun 10:00-12:00 · sala ocupada`, sin la anulada
- AND sin ninguna cancelada responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en el campo `reason` de la reserva
- **Idioma de los nombres**: claves en castellano sin tildes ni espacios (`cambio-de-planes`); mensajes en castellano
- **Límites**: tres motivos, cerrados; no hay motivos libres
- **Avisos**: `falta el motivo: …` y `motivo no válido «…»: …`, con la lista de claves
- **Regla ante conflicto**: no aplica

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-15 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
