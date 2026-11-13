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

🦆 Hoy cualquiera que escriba `anular Norte lun` anula la reserva. Después de esto, `anular Norte lun --como responsable` la anula y `--como cliente` responde «solo el responsable de sala puede anular» y la deja activa. Además aparece el comando `anuladas`, que lista `Norte lun — anulada por responsable` solo a quien declara ser responsable. `--como` es una declaración, no un login: la app no tiene usuarios, así que protege de errores, no de alguien que mienta.

Validación: dev-lead — es comportamiento que una persona usa desde la terminal.

## Capacidades

- Nuevas: `bookings` — anular una reserva según el rol declarado y listar las anuladas. Hoy no hay `capabilities/`: la capacidad nace con el comportamiento vigente de `anular` más este cambio.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (despachados) — señales: permiso por rol, datos (quién anuló), contrato público (la salida de `anular`, comando nuevo `anuladas`), capacidad nueva · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): qué NO puede hacer el cliente y que el rol no se pierda frente al roadmap (señal: permiso)
- Técnica (sonnet): que cada THEN pase solo con el comportamiento (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. **Capacidad nueva `bookings`** (no `reservas`): el slug es nombre de fichero y va en inglés kebab-case; el contenido va en castellano. Como no existe `capabilities/`, el delta es `ADDED`, no `MODIFIED`.
2. **El rol sale de `--como <cliente|responsable>`**: la app no tiene usuarios. Es una declaración sin verificar; el permiso evita equivocaciones, no suplantaciones.
3. **Un solo rol «responsable», no por sala**: la fila de ROADMAP dice «el responsable de cada sala», pero la app no sabe qué sala lleva cada persona. ⚠ Esto recorta lo que decía el roadmap: si quieres rol por sala, es otra feature. Al aprobar, la fila 0011 se alinea («solo el responsable de sala anula…»).
4. **`--como` es obligatorio en `anular`**: va tras la sala y el día (`anular Norte lun --como responsable`). Sin él, sin valor, o con un valor distinto de `cliente`/`responsable`, responde `indica --como cliente o --como responsable` y no toca nada. Rompe a quien hoy llama `anular` a secas; en esta app solo lo usas tú. En `anuladas`, un `--como` ausente, sin valor o inválido se trata como la vista de cliente (no da error).
5. **Orden de comprobaciones**: primero el rol, luego si hay reserva activa. Un cliente sobre una reserva inexistente recibe el rechazo de permiso, no `sin reserva`.
6. **Literales**: `anulada <sala> <día>` (ya existe), `solo el responsable de sala puede anular`, `indica --como cliente o --como responsable`, `sin reserva <sala> <día>` (ya existe), `sin anuladas`.
7. **`anuladas` es un comando nuevo** (no existe hoy). Lista todas las anuladas, en el orden en que se reservaron (el del almacén), una por línea: `<sala> <día> — anulada por responsable` (raya larga) con `--como responsable`; con `--como cliente` o sin `--como`, `<sala> <día> — anulada` (el cliente no ve quién anuló). No lista las canceladas.
8. **«Quién anuló» es el rol, no una persona**: se guarda `voidedBy: 'responsable'` en la reserva, en memoria. Como solo el responsable puede anular, el valor es siempre el mismo y ningún test lo distingue de un literal fijo. ⚠ A validar: lo guardo porque el brief pide «guarda quién anuló» y deja la puerta a identidades; si prefieres el literal fijo, se quita el campo.
9. **`cancelar` queda abierto**: no tiene rol y cualquiera puede seguir liberando una reserva con él. El éxito del Intent se limita a `anular`; cerrar `cancelar` sería otra feature.
10. Enfoque: A, frente a B y C (ver Approach).
11. **Texto de la fila 0011 del ROADMAP** tras aprobar: «solo el responsable de sala anula reservas de otras personas» (sin «de cada»). PRODUCT.md no cambia: su «responsable de sala» se lee como rol único.

### Hallazgos de la review

Segunda ronda (un revisor Sonnet, por haber aceptado Críticos; sin tercera):

- **Aceptado** — Crítico: orden de `anuladas` contradictorio → orden de reserva (decisión 7) y escenario con dos anuladas.
- **Aceptado** — Importante: escenario de listado mezclaba tres comportamientos → tres escenarios, uno con cancelada excluida.
- **Aceptado** — Importante: el orden rol→reserva no lo probaba nadie → escenario «El rol se comprueba antes que la reserva».
- **Aceptado** — Importante: cancelada sin cubrir → añadida al escenario «lo que no está activo».
- **Aceptado** — Importante: `cancelar` sin rol contradice «nunca anula» → decisión 9 y Intent limitado a `anular`; fuera la frase «su propia reserva».
- **Aceptado** — Importante: `voidedBy` indistinguible de un literal → marcado «a validar» en la decisión 8.
- **Aceptado** — Importante: `--como` sin valor, posición, `anuladas` con valor inválido → decisión 4 y escenarios.
- **Aceptado** — Menor: gate y aislamiento de estado → «Dónde se prueba»; texto exacto de la fila del ROADMAP y PRODUCT.md → decisión 11; reglas (identificadores, volatilidad) → «Reglas de la capacidad».
- **Rechazado** — Importante: `--como` repetido → no se especifica: caso fuera de uso real de una app de un solo usuario; el plan toma el primer valor.

- **Aceptado** — Crítico: `MODIFIED` sobre una capacidad inexistente → pasa a `ADDED` en capacidad nueva `bookings` (decisión 1).
- **Rechazado** — Menor: renombrar la capacidad a `reservas` → el slug va en inglés por regla del kit; el contenido sí va en castellano.
- **Aceptado** — Crítico: el rol de roadmap era «por sala» → declarado en decisión 3 como recorte, con la alineación de la fila.
- **Aceptado** — Crítico: `--como` no autentica → Intent, Scope y decisión 2 lo dicen.
- **Aceptado** — Crítico: un solo escenario mezclaba tres comportamientos → cinco escenarios, cada uno con su GIVEN/WHEN/THEN.
- **Aceptado** — Crítico: sin `--como` o con valor inválido → escenario y decisión 4.
- **Aceptado** — Crítico: «sigue activa» solo se leía en la respuesta → se comprueba con `libres 10:00-12:00`; añadidos «ya anulada» y «inexistente».
- **Aceptado** — Importante: decisiones sin listar (literales, formato de `anuladas`, `--como` obligatorio) → decisiones 4–8.
- **Aceptado** — Importante: qué ve el cliente en `anuladas` → decisión 7 y escenario 5.
- **Aceptado** — Importante: `anuladas` no existía → decisión 7, ADDED; dónde se guarda el dato → decisión 8.
- **Aceptado** — Importante: reglas de la capacidad → bloque añadido.
- **Aceptado** — Importante: conflictos (ya anulada, inexistente, cancelada) → escenario 4.
- **Aceptado** — Menor: nombres de ejemplo → el GIVEN ya no nombra a nadie.
- **Aceptado** — Menor: `test/anular.test.js` y mapa escenario→test → «Dónde se prueba».
- **Aceptado** — Menor: forma de `--como` → solo `--como <valor>`, tras sala y día.

## Intent

Hoy cualquiera anula cualquier reserva. Debe poder anular solo quien se declara responsable de sala, y el listado `anuladas` debe decir que la anuló un responsable. Éxito, limitado a `anular` (`cancelar` sigue abierto, decisión 9): `--como cliente` nunca anula, nunca ve quién anuló, y la reserva sigue ocupando la sala. Fracaso aunque funcione: que un `anular` sin `--como` siga anulando. Límite asumido: `--como` no autentica.

## Scope

- Entra: `anular <sala> <día> --como <cliente|responsable>`, el comando `anuladas [--como <rol>]`, y alinear la fila 0011 del ROADMAP (decisión 3).
- No entra: `cancelar`, autenticación o usuarios, responsable por sala, identidad de quien anula.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin rol deja de anular | `src/app.js:20-24`, `src/app.js:31` | delta, escenario 3 · decisión 4 |
| «el responsable de cada sala» (rol por sala) | `ROADMAP.md:8` | Scope (alinear fila) · decisión 3 |
| Término «Anulación» | `PRODUCT.md:14` | sin cambio: ya dice «la anula el responsable de sala» |

- Filas que implementa: 0011 → ningún otro fichero la nombra: comprobado con `git grep -n "0011"`.

## Approach

- A — el rol entra por `--como` y la comprobación vive en `voidBooking(room, day, role)` — cuesta un parámetro más en una función; se prueba por `run`.
- B — variable de entorno `SALAS_ROL` — oculta el rol, peor para probarlo y para ver qué pasa en la terminal.
- C — fichero de configuración con el rol de cada persona — es inventar usuarios, que la app no tiene.
- Elegido: A — el rol queda visible en cada orden y encaja con `run(cmd, params)` actual.

Partes del cómo: `run` extrae `--como <valor>` de `params`; `voidBooking` valida rol → permiso → reserva activa, y guarda `voidedBy`; `anuladas` recorre las reservas con estado `voided` en el orden del array.

## Dónde se prueba

- Todo por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`. Escenarios 1–2 y 5 comprueban el estado con `run('libres', ['10:00-12:00'])` y `run('anuladas', …)`.
- Ficheros: `src/app.js`, `test/anular.test.js`, `ROADMAP.md`. Gate: `node --test && node scripts/lint.mjs` (el de `operations.md`). Como las reservas son un array de módulo que `anular` muta, cómo se aísla el estado entre tests lo resuelve el plan.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva como responsable

- GIVEN la reserva activa de Norte el lun, de 10:00-12:00
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — El cliente no anula

- GIVEN la reserva activa de Norte el lun, de 10:00-12:00
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `libres 10:00-12:00` responde `Sur`

#### ADDED — Anular exige un rol válido

- GIVEN la reserva activa de Norte el lun, de 10:00-12:00
- WHEN `anular Norte lun` o `anular Norte lun --como admin`
- THEN responde `indica --como cliente o --como responsable`
- AND `libres 10:00-12:00` responde `Sur`

#### ADDED — Anular lo que no está activo

- GIVEN Norte lun ya anulada, Norte mar cancelada y Sur mie sin reserva
- WHEN `anular Norte lun --como responsable`, `anular Norte mar --como responsable` y `anular Sur mie --como responsable`
- THEN responden `sin reserva Norte lun`, `sin reserva Norte mar` y `sin reserva Sur mie`

#### ADDED — El rol se comprueba antes que la reserva

- GIVEN Sur mie sin reserva
- WHEN `anular Sur mie --como cliente`, `anular Sur mie --como admin` y `anular Sur mie --como`
- THEN responden `solo el responsable de sala puede anular`, `indica --como cliente o --como responsable` y `indica --como cliente o --como responsable`

#### ADDED — Listar las anuladas como responsable

- GIVEN Norte lun y Sur mar anuladas, y Norte mie cancelada
- WHEN `anuladas --como responsable`
- THEN responde dos líneas, en el orden en que se reservaron: `Norte lun — anulada por responsable` y `Sur mar — anulada por responsable`
- AND no aparece Norte mie

#### ADDED — Listar las anuladas sin ser responsable

- GIVEN Norte lun anulada
- WHEN `anuladas --como cliente`, `anuladas` y `anuladas --como admin`
- THEN las tres responden `Norte lun — anulada`

#### ADDED — Sin anuladas

- GIVEN ninguna reserva anulada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`

#### Reglas de la capacidad — `bookings`

- **Dónde viven los datos**: en memoria, en la reserva (`voidedBy`).
- **Idioma de los nombres**: castellano en los textos; `--como`, `cliente` y `responsable` son identificadores del contrato del comando.
- **Límites**: no aplica (`anuladas` no pagina); el estado vive en memoria y se pierde al terminar el proceso.
- **Avisos**: los literales de la decisión 6.
- **Regla ante conflicto**: sin reserva activa (inexistente, ya anulada o cancelada) → `sin reserva <sala> <día>`; rol y permiso se comprueban antes.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
