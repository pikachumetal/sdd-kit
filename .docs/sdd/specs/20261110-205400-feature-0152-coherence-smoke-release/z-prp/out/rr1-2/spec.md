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

Validación: dev-lead — es un permiso por rol que usa una persona desde la terminal: lo valida quien lo usa.

## Capacidades

- Nuevas: `bookings` — las reservas de salas: hoy solo recoge anular una reserva (quién puede y qué queda guardado) y el listado `anuladas`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. Capacidad nueva `bookings` (slug en inglés, contenido en castellano): hoy `capabilities/` está vacío, y por eso el delta es `ADDED` y no `MODIFIED`. Solo recoge «Anular una reserva»; `cancelar`, `libres` y `reservar` no se vuelcan (las capacidades crecen feature a feature).
2. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
3. «Responsable de cada sala» (roadmap) se queda en un único rol «responsable»: sin usuarios no hay a quién asignar una sala, así que cualquier responsable anula en cualquier sala.
4. Sin `--como`, o con un valor distinto de `responsable` (también `Responsable`), se trata como cliente, en `anular` y en `anuladas`: hoy `anular` lo puede usar cualquiera, y el permiso se deniega por defecto.
5. El permiso se comprueba antes que la existencia de la reserva: un cliente que anula una reserva que no existe recibe también `solo el responsable de sala puede anular`, para que `anular` no le diga qué hay reservado.
6. El cliente sí puede ver en `anuladas` qué salas y días están anulados, sin quién anuló: lo asumo porque una anulada ya no ocupa la sala; si no lo quieres, `anuladas` pasa a ser solo del responsable.
7. Una reserva ya anulada no se puede anular otra vez (`sin reserva Norte lun`, porque deja de estar activa) y `cancelar` tampoco la encuentra: es como funciona hoy el estado, sin cambio. Una anulada libera la sala como una cancelada.
8. `anular` sin `--como responsable` deja de funcionar para los usos que hoy lo llaman sin rol: es un cambio incompatible asumido, sin aviso ni migración (herramienta de una sola persona, `PRODUCT.md`); los tests de hoy no llaman a `anular` (`git grep`).
9. Textos nuevos: `solo el responsable de sala puede anular` (rechazo) y `Norte lun — anulada por responsable` (listado del responsable).
10. `anuladas` es un comando nuevo que no pidió el roadmap: lo necesita el «guarda quién anuló» para poder verse. Lista una línea por reserva anulada, `<sala> <día> — anulada` seguido de ` por responsable` solo con `--como responsable`.
11. «Quién anuló» guarda hoy solo el rol (`responsable`), porque no hay nombres de usuario; vive en memoria, como el resto (operations.md).
12. Enfoque: el rol se lee en `run` y se pasa a `voidBooking`, frente a una variable de entorno o un fichero de roles (ver Approach).
- Política de modelos: dominio opus y técnica sonnet (ya despachados) y una segunda ronda con un revisor sonnet tras la reescritura · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta el tope del proyecto — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Correcciones de la pasada de coherencia

- `bookings` no tiene fichero en `capabilities/` y `sdd capability merge` sobre una copia rechazaba el `MODIFIED` («no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»») → pasa a «Nuevas», delta `ADDED`, decisión 1.
- Faltaban `Validación:`, Approach y la `Política de modelos` → añadidos.
- Faltaban sin decir: el valor por defecto sin `--como`, el orden permiso/existencia y «de cada sala» → decisiones 3 a 5.
- Fusión en una copia de `.docs/sdd` (`sdd capability merge`), sin errores: `bookings.md: añadido «Anular una reserva»` y las cinco reglas añadidas; `capabilities/` del repo sin tocar.

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 6.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 2).

Segunda ronda (un revisor sonnet, tras aceptar el Crítico y reescribir; sin tercera ronda):

- **Aceptado** — Crítico · Delta · `anuladas` sin escenarios propios (vacío, activa que no sale, sin rol) y un solo bloque con ocho AND → un escenario por caso y capacidad con dos requisitos, `ADDED — Listar las reservas anuladas`.
- **Aceptado** — Crítico · Decisión 10 · `anuladas` sin `--como` o con valor inválido sin especificar → decisión 4 ampliada y escenario.
- **Aceptado** — Importante · re-anulado y efecto sobre `cancelar` y `libres` → decisión 7 y dos escenarios.
- **Aceptado** — Importante · reglas «no aplica» sin motivo y sensibilidad a mayúsculas de `--como` → reglas completadas, enumeración cerrada.
- **Aceptado** — Importante · el cliente ve días anulados en `anuladas` → decisión 6, para que la valides.
- **Aceptado** — Importante · cambio incompatible de `anular` → decisión 8; sin tests existentes que lo llamen.
- **Rechazado** — Importante · renombrar la capacidad a `reservas` → el slug en inglés lo fija el kit (`capability-template.md`, regla 1); «evitar booking» de `PRODUCT.md` rige para el texto de la interfaz.
- **Rechazado** — Menor · nombres «Ana» y «Laura» → Ana es un ejemplo inventado y Laura es la dev-lead del proyecto; `ROADMAP.md:8` está comprobado.
- **Rechazado** — Menor · texto de ayuda de `--como` → la app no tiene ayuda; fuera del Scope.

## Intent

Hoy cualquiera anula cualquier reserva (`anular Norte lun` no pregunta quién es). El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: un cliente que intenta anular recibe el rechazo y la reserva sigue activa; el responsable anula y queda guardado que fue el responsable. Fracaso aunque funcione: que el cliente pueda ver quién anuló.

## Scope

- Entra: `anular` con `--como`, el comando `anuladas`, y guardar quién anuló. Ficheros: `src/app.js` (`voidBooking` y `run`) y `test/anular.test.js` (nuevo).
- No entra: `cancelar`, `libres`, `reservar`, nombres de usuario ni un responsable por sala.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` deja de funcionar sin `--como responsable` | `src/app.js:21-25` (`voidBooking`), `src/app.js:31` (`run`) | Scope y decisión 4 |
| Estado `voided` de la reserva, que gana el campo de quién anuló | `src/app.js:23` | Scope y decisión 11 |

- Filas que implementa: 0011 → `ROADMAP.md:8` (se marca ✅ al cerrar); `PRODUCT.md:14` ya define «Anulación» como la del responsable, sin cambio.
- Comprobado con `git grep -niE "anular|anulad|anula"` fuera de las carpetas de evidencia: solo lo anterior; README, CHANGELOG, `operations.md` y los tests actuales no lo nombran.

## Approach

- Rol en `run`, pasado a `voidBooking` — es una función pura, se prueba por `run('anular', …)` como `cancelar`.
- Variable de entorno (`SALAS_ROL`) — el rol dejaría de verse en el comando y se podría heredar sin querer.
- Fichero de roles — la app no tiene usuarios que listar (hallazgo rechazado de la review).
- Elegido: rol en `run`, porque el permiso queda a la vista en cada comando y no añade ficheros ni estado fuera de la memoria.

`run` busca `--como` en los parámetros; los dos primeros son sala y día como hasta ahora. `voidBooking` recibe el rol, comprueba el permiso antes que la reserva y guarda `voidedBy: 'responsable'` al anular.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Términos y ADR

- Términos resueltos: **Anulación** y **cliente**, ya en `PRODUCT.md`; sin cambios.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y `anuladas --como responsable` no lista nada

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` (sin `--como`) o `anular Norte lun --como admin`
- THEN responde `solo el responsable de sala puede anular` y `anuladas --como responsable` no lista nada

- GIVEN ninguna reserva de Sur el mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`

- GIVEN ninguna reserva de Sur el mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

- GIVEN la reserva de Norte del lun ya anulada por el responsable
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `cancelar Norte lun`
- THEN responde `sin reserva Norte lun`

#### ADDED — Listar las reservas anuladas

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como cliente`, `anuladas` (sin `--como`) o `anuladas --como admin`
- THEN lista `Norte lun — anulada`

- GIVEN ninguna reserva anulada y la de Norte del lun activa
- WHEN `anuladas --como responsable`
- THEN no lista nada

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, con el resto de reservas (`operations.md`).
- **Idioma de los nombres**: castellano en comandos, textos y valores de `--como` (`cliente`, `responsable`, enumeración cerrada, en minúsculas); los identificadores de código ya existentes siguen en inglés.
- **Límites**: no aplica: no hay topes de cantidad.
- **Avisos**: `solo el responsable de sala puede anular`.
- **Regla ante conflicto**: una reserva ya anulada no se puede anular otra vez (`sin reserva <sala> <día>`); `--como` distingue mayúsculas y cualquier valor distinto de `responsable`, o ausente, se trata como `cliente`.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
