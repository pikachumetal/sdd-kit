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
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

🦆 Hoy cualquiera puede anular cualquier reserva con `anular Norte lun`. Con esta feature, `anular Norte lun --como responsable` anula y responde `anulada Norte lun`, y `anular Norte lun --como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa. Además aparece el listado `anuladas`: el responsable ve `Norte lun — anulada por responsable` y el cliente solo `Norte lun — anulada`. Por dentro, la reserva guarda quién la anuló.

Validación: dev-lead — es un comando que usa una persona y el permiso por rol solo se ve probándolo.

## Capacidades

- Nuevas: `bookings` — anular reservas según el rol y listar las anuladas.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular` y `anuladas`) · tamaño: ~60 líneas en 2 ficheros (`src/app.js`, `test/anular.test.js`)
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. Sin `--como`, `anular` responde como al cliente (`solo el responsable de sala puede anular`): ante la duda, se niega. Hoy `anular Norte lun` sin rol anula; esto lo cambia.
4. `anuladas` sin `--como` lista como al cliente, sin quién anuló.
5. Un único rol `responsable`, válido para cualquier sala: el roadmap dice «el responsable de cada sala», pero la app no tiene usuarios ni responsables por sala, y repartirlos sería otra feature.
6. `anuladas` sin ninguna anulada responde `sin anuladas`.
9. En `anular` el rol se comprueba antes que la existencia de la reserva; cualquier valor de `--como` que no sea `responsable` (`admin`, vacío) es cliente; con varias anuladas, `anuladas` las lista en el orden en que se anularon.
10. `anuladas` solo lista las anuladas por el responsable, no las canceladas con `cancelar`, y el cliente ve las de todas las salas, sin quién anuló.
7. Capacidad nueva `bookings` (slug en inglés, kebab-case): `capabilities/` está vacío, así que no hay requisito que modificar y el delta es `ADDED`.
8. Enfoque: A (flag `--como` en cada comando), frente a B (variable de entorno) y C (fichero de roles); ver Approach.
- Política de modelos: revisores de la spec: dominio opus y técnica sonnet, más una segunda ronda sonnet si se acepta un Crítico · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pase de coherencia: el primer `sdd capability merge` sobre una copia rechazó el delta (`bookings` sin fichero y sin declarar en «Nuevas»); corregido pasando de `MODIFIED` a `ADDED` y declarándola en «Nuevas». Resultado del segundo, sobre una copia de `.docs/sdd`: exit 0 — `bookings.md: añadido «Anular una reserva»`, `añadido «Listar las reservas anuladas»` y las cinco reglas añadidas.

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

Segunda ronda (sonnet, siete puntos), tras el Crítico aceptado:

- **Aceptado** — Crítico · Delta, «Anular una reserva» · ningún escenario se observaba por la salida (`queda anulada` / `sigue activa`) → ANDs que lo comprueban con `anuladas` y con repetir `anular`.
- **Aceptado** — Importante · Delta y Approach · casos sin escenario (`admin`, sin valor, `anular Sur mar --como cliente`, doble anulación) → escenarios y decisión 9.
- **Aceptado** — Importante · Reglas · idioma contra el slug `bookings` → excepción declarada en la regla.
- **Aceptado** — Importante · Approach · «en cada comando» prometía más que el Scope → «solo en `anular` y `anuladas`».
- **Aceptado** — Importante · Scope · efecto de la decisión 3 en los tests → Scope: `git grep` confirma que ningún test llama a `anular`.
- **Aceptado** — Importante · Reglas, «Avisos» → solo el rechazo es aviso; los otros son resultados.
- **Aceptado** — Importante · Delta · canceladas y alcance del cliente en `anuladas` → decisión 10 y AND.
- **Aceptado** — Menor · cabecera de review · tamaño real: 2 ficheros → corregido.
- **Rechazado** — Menor · frontmatter · aprobador «Laura» → el nombre del dev-lead lo fija el proyecto, no esta spec.
- **Aceptado** — Menor · Hallazgos · la decisión 4 no estaba enlazada al Crítico → enlazada con el AND sin `--como` del listado.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: `anular` con `--como cliente` nunca cambia una reserva, y ningún listado que vea el cliente dice quién anuló. Fracaso aunque funcione: que el cliente pueda deducir quién anuló.

## Scope

- Entra: `anular` con `--como` (`src/app.js`, `voidBooking` y `run`), el comando nuevo `anuladas` y guardar quién anuló.
- Entra: `test/anular.test.js` nuevo. Hoy ningún test llama a `anular` (comprobado con `git grep -n anular -- test`), así que ninguno existente se rompe.
- No entra: `cancelar`, responsables por sala, usuarios o login.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin rol: hoy anula | `src/app.js:20-25`, `src/app.js:31` | delta (`ADDED`, escenario sin `--como`) y decisión 3 |
| estado `voided` sin quién anuló | `src/app.js:23` | Scope (guarda quién anuló) |
| término «Anulación» | `PRODUCT.md:14` | no cambia: ya dice que la anula el responsable de sala |

- Filas que implementa: 0011 → `ROADMAP.md:8` (la fila; se salda al cerrar) | sin más ficheros que la nombren: comprobado con `git grep -n 0011`

## Approach

- A: flag `--como <cliente|responsable>`, solo en `anular` y `anuladas` — una línea de parseo, se prueba por `run(...)` como el resto.
- B: variable de entorno `SALAS_ROL` — el rol queda fuera de la orden y es más fácil olvidarlo puesto.
- C: fichero de roles — pide una gestión de usuarios que la app no tiene.
- Elegido: A — es la única que se ve en la propia orden y no añade estado.

Sin `--como`, o con un valor que no sea `responsable`, el rol es cliente.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND repetir `anular Norte lun --como responsable` responde `sin reserva Norte lun`
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y `anuladas --como responsable` responde `sin anuladas`
- AND sin `--como`, o con `--como admin`, responde `solo el responsable de sala puede anular` y `anuladas --como responsable` responde `sin anuladas`
- AND si no hay reserva activa en Sur el mar, `anular Sur mar --como responsable` responde `sin reserva Sur mar`
- AND `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`: el rol se comprueba antes que la existencia

#### ADDED — Listar las reservas anuladas

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND `anuladas` sin `--como` lista `Norte lun — anulada`
- AND sin ninguna anulada, `anuladas` responde `sin anuladas`
- AND una reserva cancelada con `cancelar` no aparece en `anuladas`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, en cada reserva (la app no tiene base de datos)
- **Idioma de los nombres**: castellano; el slug `bookings` es la excepción en inglés, porque un slug de capacidad va en inglés kebab-case
- **Límites**: no aplica
- **Avisos**: `solo el responsable de sala puede anular` (`sin reserva …` y `sin anuladas` son resultados, no avisos)
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
