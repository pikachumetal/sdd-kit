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

🦆 Hoy cualquiera puede anular cualquier reserva con `anular Norte lun`. Después de esto, `anular Norte lun --como responsable` anula la reserva de Norte del lunes, y con `--como cliente` (o sin `--como`) responde `solo el responsable de sala puede anular` y la deja activa. Además hay un comando nuevo, `anuladas`, que lista las anuladas: el responsable ve quién anuló (`Norte lun — anulada por responsable`) y el cliente solo ve que está anulada (`Norte lun — anulada`). Por dentro, `voidBooking` recibe el rol y `anuladas` es un comando nuevo de `run`.

Validación: dev-lead — es lo que usa una persona desde la terminal: el mensaje de rechazo y el listado los tiene que ver ella.

## Capacidades

- Nuevas: `bookings` — reservas de salas; de momento solo cubre anular y listar las anuladas (cancelar y libres siguen sin capacidad).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso (responsable/cliente), datos (quién anuló), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 2 ficheros (`src/app.js`, `test/anular.test.js`)
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló, y que sin `--como` no se anule (señal: permiso)
- Técnica (sonnet): que `voidBooking` y `run` admitan el rol sin romper `cancelar` ni `libres`, y que el estado en memoria alcance para `anuladas` (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. Capacidad nueva `bookings` (slug en inglés por la regla 1 de `capability-template.md`, aunque `PRODUCT.md` evite «booking» en el lenguaje del producto; contenido en castellano): hoy `capabilities/` está vacío y no hay donde modificar, así que `anular` y `anuladas` entran como `ADDED`. Pendiente de tu visto bueno al slug.
2. El rol sale de `--como <cliente|responsable>`, que va siempre al final, en `anular` y en `anuladas`: la app no tiene usuarios.
3. **Sin `--como` es cliente** (y `--como` sin valor cuenta como rol no válido, decisión 4): `anular Norte lun` deja de anular (cambia lo de hoy) y responde `solo el responsable de sala puede anular`. Es el valor seguro; lo contrario dejaría anular a cualquiera sin querer.
4. Un valor de `--como` que no es `cliente` ni `responsable` (`--como jefe`, o `--como` sin valor) responde `rol no válido: usa cliente o responsable` y no anula. El orden de comprobación es: rol válido, permiso, existencia de la reserva.
5. El cliente no anula nunca, tampoco una reserva suya: según `PRODUCT.md` lo suyo es cancelar. Por eso «de otros» no se modela: no hay dueño de la reserva en el código ni hace falta.
6. «Responsable de cada sala» (roadmap) se queda en «el responsable»: sin usuarios no hay forma de saber de qué sala lo es; cualquier `--como responsable` anula en cualquier sala.
7. El permiso va antes que mirar si hay reserva: `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`, no `sin reserva Sur mar`. Anular una ya anulada responde `sin reserva <sala> <día>` (hoy `findBooking` solo ve las activas) y no pisa quién la anuló.
8. `anuladas` es un comando nuevo, no existía. Formato de cada línea, mío: `<sala> <día> — anulada por responsable` para el responsable y `<sala> <día> — anulada` para el cliente; varias, una por línea en el orden en que se anularon (no se prueba: hoy solo existe la reserva Norte lun y no hay forma de crear otra); sin ninguna, `sin anuladas`; sin `--como`, como cliente (no enseña quién anuló); un rol no válido, el mismo `rol no válido: usa cliente o responsable`.
9. Las reservas viven en memoria y cada `node src/app.js …` arranca de cero: por la línea de comandos `anuladas` saldrá siempre vacío hasta que haya persistencia. Se prueba solo con `run()` en el mismo proceso; persistir no entra.
10. «Quién anuló» es el rol (`responsable`), no una persona: hoy es el único que puede anular y la app no tiene usuarios.
11. Enfoque: A, frente a B y C (ver Approach).
- Política de modelos: revisores de la spec — dominio opus y técnica sonnet, o un revisor con los siete puntos si el reparto no se confirma · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 8.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 2).

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Importante · Delta · faltaban anular ya anulada, `--como` sin valor y rol inválido sobre sala sin reserva → ANDs nuevos y orden rol, permiso, existencia (decisiones 4 y 7).
- **Aceptado** — Importante · Reglas de la capacidad · faltaban las cinco → sección añadida al delta.
- **Rechazado** — Importante · «varias anuladas» sin escenario → no se puede montar: solo existe la reserva Norte lun; la frase queda dicha en la decisión 8 como no probada.
- **Aceptado** — Importante · Dónde se prueba · el estado en memoria se comparte entre tests → cada escenario se observa con `anuladas --como responsable` y el plan decide cómo partir de cero.
- **Aceptado** — Importante · Intent · prometía ver qué se anuló desde la terminal → Intent rebajado: verificable con `run()` en un proceso (decisión 9).
- **Rechazado** — Importante · slug `bookings` frente al glosario → la regla 1 de `capability-template.md` pide el slug en inglés; el glosario rige el texto del producto (decisión 1).
- **Aceptado** — Importante · Lo que cambia de forma · tests existentes → fila: ningún test llama a `anular` (`git grep -n anular -- test` sin resultados). Rechazado el AND de no regresión de `cancelar` y `libres`: no se tocan.
- **Aceptado** — Menor · decisión 10 · «quién» es el rol → dicho en el Intent y en la decisión.
- **Rechazado** — Menor · `approvers` con nombre → es el dev-lead de esta sesión, como en el resto de specs.
- **Aceptado** — Menor · posición de `--como` → fijada en la decisión 2. **Rechazado** quitar el «Mínimo razonable»: el bloque lo exige.

### Repaso de coherencia

- `sdd capability merge` sobre una copia rechazó la primera redacción: «`bookings` no tiene fichero en `capabilities/` y el bloque no la declara en "Nuevas"». Corregido: `bookings` va en «Nuevas» y el delta pasa de `MODIFIED` a `ADDED`. Segunda pasada sobre una copia de `.docs/sdd`: `bookings.md: añadido «Anular una reserva»` · `bookings.md: añadido «Listar las reservas anuladas»` (exit 0); el `capabilities/` del repo no cambia.
- `anuladas` figuraba como existente (Scope, «Dónde se prueba», THEN) y no hay rastro en `src/`: es un comando nuevo (decisión 8).
- La GIVEN nombraba a «Ana» como dueña de la reserva: no hay dueño en el código; fuera.
- Sin medir: nada con tope de palabras ni con coste de sujetos.

## Intent

Hoy cualquiera anula cualquier reserva: `voidBooking` no mira quién pide. El responsable de sala debe poder anular, y el cliente no; y el responsable debe poder ver después qué se anuló y quién lo hizo. Éxito, comprobable con `run()` en un mismo proceso (no por la terminal, decisión 9): `anular Norte lun --como cliente` no cambia nada, `--como responsable` anula, y `anuladas --como responsable` lo lista con el rol que anuló. Anti-objetivo: que el cliente anule o vea quién anuló, aunque el resto funcione.

## Scope

- Entra: `anular` con `--como` (rol por defecto cliente), el mensaje de rechazo, y el comando nuevo `anuladas` con quién anuló según el rol.
- No entra: `cancelar` y `libres`; persistencia entre ejecuciones; usuarios, sesiones o responsable por sala.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin `--como` deja de anular | `src/app.js:20-25` (`voidBooking`), `src/app.js:31` (`run`) | delta, `ADDED` de «Anular una reserva»; decisión 3 |
| Estado `voided` de la reserva | `src/app.js:23` | Scope: se conserva y se añade quién anuló (decisión 10) |
| Texto `anulada <sala> <día>` | `src/app.js:24` | delta: se mantiene tal cual |
| Tests que llaman a `anular` | `test/` (ninguno: `git grep -n anular -- test` sin resultados) | nada que actualizar |

- Filas que implementa: 0011 → `ROADMAP.md:8` (la marca `sdd-archive` al cerrar) · ningún otro fichero la nombra: comprobado con `git grep -nE "0011" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'` (solo el roadmap).

## Approach

- A — pasar el rol como argumento: `run` lee `--como` y se lo da a `voidBooking(room, day, role)`; la reserva guarda `voidedBy`. Cuesta tocar la firma de `voidBooking` y de `run`; el resto no cambia.
- B — un fichero de roles (`roles.json`): descartado, la app no tiene usuarios que meter ahí.
- C — una variable de entorno `SALAS_ROL`: descartada, esconde el rol y no se ve en cada orden.
- Elegido: A — es la única que no inventa usuarios y deja el rol a la vista en cada comando.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`, anulando antes con `run('anular', …)` en el mismo proceso (decisión 9). El estado es del módulo y se comparte entre los tests del fichero: cada escenario se observa con `anuladas --como responsable`, y el plan decide cómo partir de cero (p. ej. un reinicio exportado) para que ningún test dependa del orden.

## Términos y ADR

- Términos resueltos: Anulación — la reserva que anula el responsable de sala (`PRODUCT.md`); en el código, estado `voided`.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con `--como jefe` responde `rol no válido: usa cliente o responsable` y la reserva sigue activa
- AND `anular Sur mar --como responsable` (sin reserva) responde `sin reserva Sur mar`
- AND `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`
- AND `anular Sur mar --como jefe` responde `rol no válido: usa cliente o responsable`
- AND `anular Norte lun --como` (sin valor) responde `rol no válido: usa cliente o responsable`
- AND anular otra vez la ya anulada con `--como responsable` responde `sin reserva Norte lun` y `anuladas --como responsable` sigue listando `Norte lun — anulada por responsable`

#### ADDED — Listar las reservas anuladas

- GIVEN la reserva de Norte del lun anulada con `anular Norte lun --como responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND `anuladas` sin `--como` lista `Norte lun — anulada`
- AND con `--como jefe` responde `rol no válido: usa cliente o responsable`
- AND sin ninguna anulada responde `sin anuladas`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria del proceso (`operations.md`); no sobreviven entre ejecuciones.
- **Idioma de los nombres**: mensajes y comandos en castellano (constitución, regla 4); `--como` y los roles `cliente` y `responsable` en castellano.
- **Límites**: no aplica.
- **Avisos**: `solo el responsable de sala puede anular` · `rol no válido: usa cliente o responsable` · `sin anuladas`.
- **Regla ante conflicto**: rol válido, luego permiso, luego existencia de la reserva; una reserva ya anulada cuenta como inexistente.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
