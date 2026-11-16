---
id: 20261116-111229-feature-0012-libres-planta
feature: 0012
title: Filtrar libres por planta
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` enseña todas las salas libres de la oficina. Con `libres 10:00-12:00 --planta 2` solo enseñará las de la planta 2 (con las salas actuales, `Sur`); sin `--planta` todo sigue como hoy: `Sur`, o `Norte, Sur` si ninguna está reservada. Para eso cada sala pasa a tener una planta anotada en el código, y ese dato lo he inventado yo: está en ✋ 1 para que lo corrijas.

Validación: dev-lead — es una opción nueva de la línea de comandos que una persona usa: lo que sale por pantalla lo mira quien la usa.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) con los siete puntos — señales: capacidad nueva · tamaño: ~15 líneas de código en 2 ficheros
- Dominio+técnica (sonnet): si los escenarios de `room-availability` fijan el parseo de `--planta` y su salida, y si la planta inventada de ✋ 1 arrastra los THEN (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar los bordes del parseo de argumentos y el contrato de salida

1. **Planta de cada sala (pendiente de ti)**: el código no guarda hoy ninguna planta. Propongo `Norte` = planta 1 y `Sur` = planta 2, solo para poder distinguirlas; dime las reales si son otras y reescribo escenarios y mensajes.
2. Capacidad nueva `room-availability` (no hay `capabilities/`): documenta el comportamiento que `libres` ya tiene (primer requisito, sin cambio) y añade el filtro; slug en inglés kebab-case.
3. Sintaxis: `libres <franja> --planta <n>`, con el valor como argumento aparte (no `--planta=2`). `--planta` puede ir antes o después de la franja.
4. **Interpretación de tu frase**: «sin `--planta`, lista todas las salas» lo entiendo como todas las salas **libres** en la franja, de cualquier planta, igual que hoy; no pasa a listar también las reservadas. Si querías lo segundo, dímelo.
5. La planta que se pide se compara como texto con la de cada sala: `abc`, `2.5` o `02` no coinciden con ninguna. Errores, literales: `planta desconocida: <valor>` si ninguna sala está en esa planta; `falta el valor de --planta` si no hay valor tras la opción; `--planta solo se admite una vez` si se repite.
6. Una planta que existe pero sin salas libres devuelve cadena vacía, como hoy «ninguna libre».
7. Sin franja (`libres --planta 2`) no se inventa un error: se comporta como hoy `libres` sin franja (ninguna reserva coincide) y filtra por planta.
8. Los errores salen por stdout y el proceso termina con código 0, como el resto de respuestas de texto de hoy (`sin reserva Norte lun`); no cambia el contrato de salida.
9. Enfoque: A (salas como objetos con su planta), frente a B (tabla aparte sala→planta) (ver Approach).
10. «Planta» se añade a la Terminology de `PRODUCT.md` (término nuevo del dominio).
- Política de modelos: revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`.
- Delta comprobado sobre una copia con `sdd capability merge`: añadidos «Salas libres por franja», «Filtrar libres por planta», «Libres con planta no válida».

### Hallazgos de la review

- **Aceptado** — escenario sin reservas ausente → añadido `libres 14:00-16:00` → `Norte, Sur` al primer requisito.
- **Rechazado** (Crítico) — la planta Norte=1/Sur=2 es inventada → va como ✋ 1 «pendiente de ti»: el dato no existe en el proyecto ni lo dijiste, y la aprobación de la spec es el momento de validarlo; si cambia, solo cambian los datos de los GIVEN y los tests.
- **Aceptado** — formato de planta no entero → ✋ 5 (comparación como texto) y escenario `--planta abc`.
- **Aceptado** — parseo sin cubrir → ✋ 5 (repetida), ✋ 7 (sin franja) y escenarios.
- **Aceptado** — código de salida y canal → ✋ 8.
- **Aceptado** — cinco reglas → «Reglas de la capacidad» en el delta.
- **Aceptado** — reinterpretación presentada como obvia → ✋ 4, con la pregunta abierta.
- **Aceptado** — «Planta» en `PRODUCT.md` → ✋ 10 y Scope.
- **Aceptado** — línea de CHANGELOG fuera del Scope (la hace el corte) → movida a «No entra».
- **Aceptado** — restos de plantilla → limpiados.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres de la oficina; quien busca sala en una planta concreta tiene que descartar a ojo. Se quiere poder pedir solo las de una planta. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo las salas libres de la planta 2, y todo uso sin la opción da exactamente la salida de hoy. Fracaso aunque funcione: que cambie la salida de `libres` sin `--planta`, o que una planta mal escrita parezca «ninguna libre».

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala como dato; los tres mensajes de error; tests; el término «Planta» en `PRODUCT.md`.
- No entra: filtrar otros comandos (`reservar`, `cancelar`); plantas por nombre (`baja`, `primera`); varias plantas a la vez; validar el formato de franja (deuda ya anotada en `debt.md`); la línea de `CHANGELOG.md` (la escribe el corte de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de objetos `{ name, planta }` | `src/app.js:2` (definición), `src/app.js:6` (único uso, `freeRooms`) | Approach: se adapta `freeRooms`; no afecta a la salida |
| `freeRooms(slot)` pasa a aceptar planta; `run('libres')` deja de leer `params[0]` a ciegas | `src/app.js:5`, `src/app.js:28` | Scope + requisito ADDED «Filtrar libres por planta» |

- Filas que implementa: nada: comprobado con `git grep -niE "libres|rooms|planta"` (solo `CHANGELOG.md:10`, `src/app.js` y `test/app.test.js:5-6`, que sigue valiendo).

## Approach

- A: `rooms` como objetos `{ name, planta }` — un solo sitio con el dato; toca `freeRooms`.
- B: tabla aparte `plantas = { Norte: 1, Sur: 2 }` — no toca `rooms`, pero el dato queda duplicado en dos listas que pueden desincronizarse.
- Elegido: A — una sala nueva no puede olvidar su planta.

`run('libres', params)` separa `--planta <n>` del resto de argumentos y trata el primer argumento restante como franja.

## Dónde se prueba

- Libres con y sin `--planta`, y los errores: por `run('libres', [...])`, como el test actual de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: **planta** — piso de la oficina donde está una sala; no se llama «piso» ni «nivel».
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Salas libres por franja

- GIVEN reserva activa de `Norte` en `10:00-12:00`
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`
- AND `libres 14:00-16:00` responde `Norte, Sur`

#### ADDED — Filtrar libres por planta

- GIVEN `Norte` en la planta 1, `Sur` en la planta 2, y reserva activa de `Norte` en `10:00-12:00`
- WHEN `libres 10:00-12:00 --planta 2`
- THEN responde `Sur`
- AND `libres 10:00-12:00 --planta 1` responde cadena vacía
- AND `libres --planta 2 10:00-12:00` responde `Sur` (la opción puede ir antes)
- AND `libres 14:00-16:00 --planta 1` responde `Norte`
- AND `libres --planta 2` (sin franja) responde `Sur`

#### ADDED — Libres con planta no válida

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2
- WHEN `libres 10:00-12:00 --planta 3`
- THEN responde `planta desconocida: 3`
- AND `libres 10:00-12:00 --planta abc` responde `planta desconocida: abc`
- AND `libres 10:00-12:00 --planta` responde `falta el valor de --planta`
- AND `libres 10:00-12:00 --planta 1 --planta 2` responde `--planta solo se admite una vez`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la lista `rooms` de `src/app.js`, con la planta de cada sala
- **Idioma de los nombres**: castellano (`libres`, `--planta`, mensajes)
- **Límites**: no aplica (sin tope de plantas)
- **Avisos**: `planta desconocida: <valor>` · `falta el valor de --planta` · `--planta solo se admite una vez`
- **Regla ante conflicto**: `--planta` repetido es error, no gana ninguna

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
