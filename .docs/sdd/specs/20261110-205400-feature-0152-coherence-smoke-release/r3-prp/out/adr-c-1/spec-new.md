---
id: 20261111-191339-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `salas libres 14:00-16:00` te dice qué salas están libres a esa hora, sin importar en qué planta están. Con esta feature puedes añadir `--planta 1` y solo te enseña las de esa planta: `salas libres 14:00-16:00 --planta 1` responde `Norte`. Si no pones `--planta`, todo sigue igual y ves todas las salas libres. Para poder filtrar, cada sala pasa a tener una planta (Norte en la 1, Sur en la 2), y ese reparto lo he puesto yo: míralo en ✋.

Validación: dev-lead — es un comando que usa una persona, y el reparto de plantas de las salas es un dato que solo él puede confirmar.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) con los siete puntos — señales: capacidad nueva (`room-availability`), dato nuevo (planta de cada sala, en memoria) · tamaño: ~20 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Revisor único (sonnet): bordes de argumentos de «Libres filtradas por planta» y de «Planta no válida», y si el reparto Norte 1 / Sur 2 sirve al producto (señal: dato nuevo)
- Mínimo razonable: sin revisión quedan sin mirar esos bordes

1. **Planta de cada sala**: Norte → planta 1, Sur → planta 2. Nadie dijo qué planta tiene cada sala; es dato inventado y hay que sustituirlo por el real si no es este. Se pone una sala en cada planta para que el filtro distinga. Va como constante en `src/app.js`, en memoria (ADR 0003).
2. **Forma del valor**: `--planta <n>` con un entero, en argumento separado (`--planta 2`). `--planta=2` no se admite, y responde planta no válida (decisión 5).
3. **Posición de la bandera**: `--planta <n>` vale antes o después de la franja (`libres --planta 2 14:00-16:00` = `libres 14:00-16:00 --planta 2`). La única bandera de `libres` es `--planta`; la franja es el primer argumento que no es `--planta` ni su valor. Cualquier otro argumento (`--otra`) se ignora, como hoy.
4. **Sin salas que enseñar**: con una planta que no existe (`--planta 9`) o sin salas libres en ella, la salida es vacía, como hoy cuando no queda ninguna libre; no hay texto distinto para «planta inexistente». Riesgo aceptado: una planta bien escrita pero inexistente se ve igual que «ninguna libre»; el dev-lead lo valida.
5. **Planta ausente o no válida**: una planta válida es un entero positivo escrito solo con dígitos (`1`, `2`, `01`). `--planta` sin valor, con `alta`, `0`, `-1`, `1.5`, con una franja como valor (`libres --planta 14:00-16:00`) o repetido (`--planta 1 --planta 2`), o escrito `--planta=2`, responde `planta no válida: usa --planta <número entero>` y no lista nada. Literal inventado por mí. Se comprueba antes de leer la franja y también sin franja.
6. **Salida**: como hoy, texto normal por la salida estándar, salas en el orden de `rooms` separadas por `, `, sin ordenar y sin mostrar la planta; el aviso de planta no válida sale igual, sin código de salida propio. Sin franja, `libres` se comporta como hoy: ninguna reserva coincide y lista todas; con `--planta` válida, lista las de esa planta (`libres --planta 1` → `Norte`). La falta de franja no se avisa: queda fuera de esta feature.
7. **Nueva capacidad `room-availability`**: no existía ninguna capacidad en el proyecto; la creo para este comportamiento. Documenta también «sin `--planta` lista todas»: es comportamiento que ya existe y viene de lo que dijiste; su requisito es de regresión, no demuestra la feature. No documenta el resto de `libres` (franjas, días).
8. **Enfoque**: A, frente a B y C (ver Approach).
9. **Delta probado** con `sdd capability merge` sobre una copia de `.docs/sdd` fuera del repo: sin rechazos (exit 0); `capabilities/` del repo no cambia.
- Política de modelos: un revisor de la spec en sonnet (por tamaño pequeño y sin `MODIFIED`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — capacidad sobre comportamiento preexistente y escenario «sin planta» que pasa sin código nuevo → marcado como requisito de regresión (decisión 7)
- **Aceptado** — qué es una planta válida, franja como valor, repetida, 0, negativos, decimales → decisión 5 y escenarios de «Planta no válida»
- **Aceptado** — franja ausente y orden de validación → decisión 6 y Scope; la planta se comprueba antes de leer la franja
- **Aceptado** — contradicción Intent/decisión 4 → el Intent distingue planta mal escrita (aviso) de planta inexistente (vacío)
- **Aceptado** — salida, separador, orden, código de salida → decisión 6
- **Aceptado** — «Límites» y «Regla ante conflicto» sin motivo, y apoyo en `--cada-semana` → reglas rellenadas
- **Aceptado** — líneas sin símbolos → añadidos `run`, `rooms`, `freeRooms` a la tabla
- **Rechazado** — banderas desconocidas como `--cada-semana` en `libres` → fuera de Scope, no se promete nada
- **Rechazado** — `approvers: TBD` y política de modelos en ✋ → lo exige la plantilla, y el aprobador se rellena al aprobar
- **Rechazado** — añadir «Planta» a PRODUCT.md y separar datos de prueba → lo escribe el cierre desde «Términos»; el reparto va a validación del dev-lead (decisión 1)

### Hallazgos de la segunda ronda

- **Aceptado** — `libres --planta 14:00-16:00` y `libres --planta 1` sin franja ambiguos → la planta se valida primero (decisión 5) y la salida sin franja queda escrita con escenario (decisión 6)
- **Aceptado** — regresión mezclaba reservas y planta, y `01` bajo un THEN de aviso → regresión solo con `14:00-16:00`; `01` pasa a «Libres filtradas por planta»
- **Aceptado** — «bandera» sin definir → solo `--planta` lo es; lo demás se ignora (decisión 3)
- **Aceptado** — `--planta 9` igual que «ninguna libre» → riesgo aceptado y puesto a validar (decisión 4)
- **Aceptado** — `--planta=2` sin salida y referencia a `--cada-semana`; resultado numérico del merge; revisores y Planta como término → decisiones 2, 9 y 1, y bloque de review

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` para esta feature — «Perfil delegate»

## Intent

Hoy `libres <franja>` lista todas las salas libres de todas las plantas. Quien está en una planta no quiere recorrer las demás: quiere ver solo las suyas. Éxito: `salas libres 14:00-16:00 --planta 1` enseña solo las libres de la planta 1, y `salas libres 14:00-16:00` sigue enseñando las mismas que hoy. Fracaso, aunque funcione técnicamente: que añadir `--planta` cambie lo que responde el comando sin ella, o que una planta mal escrita (`alta`, `0`) parezca «ninguna sala libre». Una planta bien escrita pero inexistente (`9`) sí responde vacío (decisión 4).

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala como dato; leer la franja saltando `--planta` y su valor; `libres --planta <n>` sin franja (decisión 6); el mensaje de planta no válida.
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; mostrar la planta de cada sala en la salida; más salas o más plantas; el filtro por día en `libres` (hoy `libres` ignora el día); entradas en `CHANGELOG.md` (las escribe el corte de `sdd-end-release`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `libres` lee la franja como `params[0]` | `run`, `src/app.js:28` | Scope: pasa a «primer argumento que no es bandera ni su valor» (decisión 3) |
| `rooms` como lista de nombres | `rooms` y `freeRooms`, `src/app.js:2`, `src/app.js:5` | Scope: cada sala lleva su planta (decisión 1) |

- Filas que implementa: nada: comprobado con `git grep -n "0012" -- . ':!.docs/sdd/specs'` (sin resultados). `git grep -i -E "libres|planta"` fuera de `specs/` solo da `src/app.js`, `test/app.test.js` y `CHANGELOG.md:10` (que describe `libres` sin filtro y sigue cierto).

## Approach

- A — constante `rooms` con objetos `{ name, floor }` y `freeRooms(slot, floor)` que filtra por `floor` si llega — un cambio en `freeRooms` y en `run`; se prueba por `run('libres', …)` como hoy.
- B — mapa aparte `floors = { Norte: 1, Sur: 2 }` y filtro sobre `rooms` — mantiene `rooms` igual, pero deja dos estructuras que sincronizar al añadir una sala.
- C — leer la bandera en `app.js` antes de llamar a `run` — rompe que `run` sea la costura de los tests: el parseo quedaría sin probar.
- Elegido: A — una sola fuente de verdad para sala y planta, y el parseo vive dentro de `run`, que es donde ya se prueba.

Partes del cómo: `run` separa de `params` la bandera `--planta` y su valor; lo que queda es la franja (el primero). Valida el valor antes de listar (decisión 5). `freeRooms` recibe la planta opcional; sin ella no filtra.

## Dónde se prueba

- `libres` con y sin `--planta`, bandera antes y después, planta inexistente y planta no válida: por `run('libres', [...])` en `test/app.test.js`, como el test actual de `libres`.

## Términos y ADR

- Términos resueltos: **Planta** — el piso del edificio donde está una sala; cada sala tiene una. _Evitar_: floor, nivel. Se escribe en PRODUCT.md al cerrar, y el reparto Norte 1 / Sur 2 lo valida el dev-lead (decisión 1).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin planta listan todas las salas

> Requisito de regresión: documenta lo que `libres` ya hace.

- GIVEN salas Norte (planta 1) y Sur (planta 2), y una reserva activa de Norte en `10:00-12:00`
- WHEN `libres 14:00-16:00`
- THEN responde `Norte, Sur`

#### ADDED — Libres filtradas por planta

- GIVEN salas Norte (planta 1) y Sur (planta 2), y una reserva activa de Norte en `10:00-12:00`
- WHEN `libres 14:00-16:00 --planta 1`
- THEN responde `Norte`
- AND `libres 14:00-16:00 --planta 2` responde `Sur`
- AND `libres --planta 2 14:00-16:00` responde `Sur`
- AND `libres 10:00-12:00 --planta 1` responde vacío, porque Norte está reservada
- AND `libres 14:00-16:00 --planta 9` responde vacío
- AND `libres 14:00-16:00 --planta 01` responde `Norte`
- AND `libres --planta 1` (sin franja) responde `Norte`

#### ADDED — Planta no válida

- GIVEN salas Norte (planta 1) y Sur (planta 2)
- WHEN `libres 14:00-16:00 --planta alta`
- THEN responde `planta no válida: usa --planta <número entero>` y no lista salas
- AND `libres 14:00-16:00 --planta` (sin valor) responde lo mismo
- AND también responden lo mismo `--planta 0`, `--planta -1`, `--planta 1.5`, `libres --planta 14:00-16:00` y `libres 14:00-16:00 --planta 1 --planta 2` y `libres 14:00-16:00 --planta=2`


#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta de cada sala es una constante del código, en memoria (ADR 0003)
- **Idioma de los nombres**: la opción y el mensaje van en castellano (`--planta`)
- **Límites**: sin tope de planta: vale cualquier entero positivo; una planta sin salas da salida vacía
- **Avisos**: `planta no válida: usa --planta <número entero>`
- **Regla ante conflicto**: `--planta` repetido es planta no válida

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
