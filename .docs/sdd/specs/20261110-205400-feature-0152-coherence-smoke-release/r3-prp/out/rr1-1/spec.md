---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

🦆 Hoy cualquiera puede anular cualquier reserva: `anular Norte lun` responde `anulada Norte lun` sea quien sea. Con esta feature, `anular Norte lun --como responsable` sigue anulando, y `anular Norte lun --como cliente` responde `solo el responsable de sala puede anular` y deja la reserva. Además hay un listado nuevo, `anuladas`: el responsable ve `Norte lun — anulada por responsable` y el cliente ve `Norte lun — anulada`, sin quién fue. Por dentro, el rol se lee del argumento `--como` y la reserva anulada guarda ese rol.

Validación: dev-lead — es un permiso que usa una persona y conviene probarlo a mano con los dos roles.

## Capacidades

- Nuevas: `reservas` — anular una reserva según el rol y ver las anuladas.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservas`), contrato público (la salida de `anular` y el listado `anuladas`), reglas de visibilidad o permiso (el cliente no anula ni ve quién anuló), datos (quién anuló) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló, y qué pasa sin `--como` (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual de `anular` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. **Capacidad nueva `reservas`** (slug en castellano, como pide `PRODUCT.md`, que evita «booking»): ninguna capacidad describe hoy las reservas, así que el delta es `ADDED`, no `MODIFIED`.
4. **`anuladas` es un comando nuevo**: hoy no existe. Su salida, una línea por reserva anulada, es `<sala> <día> — anulada por responsable` o `<sala> <día> — anulada`; sin ninguna, responde `sin anuladas`.
5. **Sin `--como`, el rol es `cliente`**: ante la duda, el permiso más bajo. `anular Norte lun` a secas ya no anula.
6. **«Responsable de sala» es un rol único, no uno por sala**: el roadmap dice «el responsable de cada sala», pero la app no tiene usuarios ni salas con dueño. Si el dev-lead quiere un responsable distinto por sala, es otra feature.
7. **Enfoque**: `--como` leído en `run`, frente a un fichero de roles o una variable de entorno (ver Approach).
8. **El permiso se comprueba antes que la existencia**: `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`, igual exista o no la reserva, para no contar al cliente qué reservas hay.
9. **`--como` va al final y solo admite `cliente` o `responsable`**: `anular Norte lun --como admin`, o `--como` sin valor, responde `rol no válido: usa cliente o responsable` y no anula.
10. **`anuladas` sin `--como` es `cliente`** (como en la decisión 5); solo lista las anuladas, no las canceladas, en el orden en que se anularon.
11. **Límite conocido**: `--como` lo escribe quien llama, así que esto es un control de la interfaz, no de seguridad: cualquiera puede poner `--como responsable`. Sin usuarios ni autenticación (No entra), no hay otra cosa que comprobar.
12. **Quién valida**: `PRODUCT.md` dice que solo hay una persona; el dev-lead que aprueba es esa persona, y el nombre que figura en las aprobaciones es el del roadmap, no un dato mío.
- Política de modelos: dominio opus y técnica sonnet en paralelo para la review de la spec (segunda ronda con un revisor sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

- **Segunda ronda (sonnet, 10 hallazgos, ninguno Crítico)** — Aceptados todos: orden permiso/existencia (decisión 8), `--como` inválido y posición (9), `anuladas` sin rol, canceladas y orden (10), el permiso es de interfaz (11, y Avisos), slug `reservas` y nombres internos (regla de idioma), «de Ana» fuera del GIVEN, `voidedBy` observable solo por `anuladas`, «sin ficheros de código nuevos», aprobador (12), filas añadidas a «Lo que se retira».

### Correcciones de la pasada de coherencia

- `reservas` no tiene fichero en `capabilities/`: `sdd capability merge` sobre una copia rechazaba el `MODIFIED` («no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»»). Pasa a «Nuevas» con `ADDED` y decisión 3.
- `anuladas` no existe en el código: pasa a requisito propio (decisión 4), y su caso sin resultados queda fijado.
- Sin `--como` el THEN no decía nada: decisión 5.
- «Cada sala» del roadmap frente a un rol único: decisión 6.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: `anular Norte lun --como cliente` no cambia nada y lo dice; con `--como responsable` anula y la reserva guarda quién la anuló. Fracaso aunque funcione: que el cliente pueda deducir quién anuló desde `anuladas`. Es un control de la interfaz, no de seguridad: `--como` lo escribe quien llama (decisión 11).

## Scope

- Entra: `anular` con `--como`, el rol por defecto, y el listado nuevo `anuladas` con quién anuló según el rol de quien mira.
- No entra: `cancelar` (sigue sin rol), responsables por sala, usuarios o autenticación.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin `--como` deja de anular | `src/app.js:20-24` (`voidBooking`), `src/app.js:31` | delta, decisión 5 |
| `anuladas` hoy cae en `return 'salas'` | `src/app.js:32` | alta, no cambio de forma: delta «Ver las reservas anuladas», decisión 4 |
| el estado `voided` gana `voidedBy` | `src/app.js:23` | alta de dato: Reglas de la capacidad |

- Filas que implementa: 0011 → `ROADMAP.md:8` la nombra y la cierra el archivo, sin cambio de texto aquí.

## Approach

- `--como` leído en `run` y pasado a `voidBooking` y al listado — cabe en `src/app.js`, sin ficheros de código nuevos (solo `test/anular.test.js`); el rol viaja en cada llamada.
- Fichero de roles — pide un formato y una ruta, y la app no tiene usuarios a los que asignarlos.
- Variable de entorno — esconde el rol fuera de la línea de comandos, y los tests se pisarían entre sí.
- Elegido: `--como` en `run` — el rol se ve en cada comando, se prueba por `run(...)` como `cancelar`, y no inventa infraestructura.

La reserva anulada guarda `voidedBy` con el rol que anuló; `anuladas` lo enseña solo si quien mira es `responsable`.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Términos y ADR

- Términos resueltos: responsable — el rol que puede anular reservas de cualquiera; cliente — el rol que no puede.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `reservas`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada (quién anuló se observa en «Ver las reservas anuladas»)
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` se trata como `cliente`
- AND `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`, haya o no reserva
- AND `anular Norte lun --como admin` responde `rol no válido: usa cliente o responsable` y la reserva sigue activa
- AND sin reserva activa, `anular Sur mar --como responsable` responde `sin reserva Sur mar`

#### ADDED — Ver las reservas anuladas

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND `anuladas` sin `--como` lista `Norte lun — anulada`
- AND una reserva cancelada con `cancelar` no sale en `anuladas`
- AND con varias anuladas salen en el orden en que se anularon
- AND sin ninguna anulada, `anuladas` responde `sin anuladas`

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: en memoria, en cada reserva (`status` y `voidedBy`); la app no persiste.
- **Idioma de los nombres**: castellano en comandos, salidas y valores de `--como`; los nombres internos del código (`status`, `voidedBy`) siguen en inglés, como los actuales (`voided`, `findBooking`).
- **Límites**: `--como` va tras la sala y el día, y solo admite `cliente` o `responsable`.
- **Avisos**: `solo el responsable de sala puede anular`; `rol no válido: usa cliente o responsable`. Es un control de interfaz: `--como` lo escribe quien llama.
- **Regla ante conflicto**: anular una reserva que ya no está activa responde `sin reserva <sala> <día>`.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
