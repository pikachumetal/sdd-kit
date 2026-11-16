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

Validación: dev-lead — las respuestas de `anular` se ven desde la línea de comandos; `anuladas` solo se ve dentro de un proceso (decisión 10), así que se valida con los tests y con `run` en una sola sesión.

## Capacidades

- Nuevas: `reservas` — `anular` solo con rol `responsable`, y el listado `anuladas` con el rol que anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (hoy `anular` lo usa cualquiera), reglas de visibilidad o permiso (rol `responsable`/`cliente`), datos (rol que anuló), contrato público (salida de `anular` y de `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): qué NO puede hacer ni ver el `cliente` y si «quién anuló» contradice PRODUCT.md (señal: permiso)
- Técnica (sonnet): si cada THEN de `anular` y `anuladas` falla sin el comportamiento, y qué contrato cambia (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

### Hallazgos de la review

- **Aceptado** — (técnica 1, dominio 3) un escenario mezclaba tres comportamientos y `anuladas` no tenía su WHEN → el delta se separa en escenarios; `anuladas` es un requisito propio.
- **Aceptado** — (técnica 2 y 3, dominio 6) faltaba `anular` sin `--como` o con un rol desconocido → escenarios 3 y 4, decisión 4.
- **Aceptado** — (técnica 5, dominio 10) faltaban reserva inexistente o ya anulada → escenario 5, decisión 6.
- **Aceptado** — (técnica 6) no se decía dónde se guarda quién anuló → decisión 5 y regla «Dónde viven los datos».
- **Aceptado** — (técnica 7, dominio 3) el formato de `anuladas` no está descrito hoy: el comando no existe en `src/app.js` → pasa de `MODIFIED` a comando nuevo (decisión 3), sin afirmar que no rompe nada.
- **Aceptado** — (técnica 10, dominio 1) `bookings` no existe en `capabilities/` y choca con «Evitar: booking» → capacidad nueva `reservas`, con `ADDED` (decisión 2).
- **Aceptado** — (dominio 2) PRODUCT.md dice «no hay más usuarios» → `--como` es un rol declarado, no un control de acceso (decisión 1); una frase en PRODUCT.md entra en Scope.
- **Aceptado** — (dominio 5) qué ve el cliente en `anuladas` → escenario 8 y decisión 7.
- **Aceptado** — (dominio 9) faltaban las reglas de la capacidad → sección «Reglas de la capacidad — reservas».
- **Aceptado** — (dominio 4, 7, 8) el Intent no cubría el rol que anuló, «de cualquiera» frente a «de otros» y «quién» frente a rol → Intent reescrito; se guarda el rol, no una persona; `cancelar` no cambia.
- **Aceptado** — (técnica 9) → «Dónde se prueba» dice el fichero y la costura; falta de `app.js`: se prueba por `run`, ya exportada.
- **Aceptado** — (técnica 8) decisiones del cuerpo sin listar → todas numeradas abajo.
- **Aceptado (ronda 2)** — (1) el estado vive en memoria y cada `node src/app.js …` arranca de cero → decisión 10: `anuladas` solo tiene sentido dentro de un proceso; la persistencia sigue fuera. **Pendiente de tu decisión**, ver abajo.
- **Aceptado (ronda 2)** — (2) sin reinicio del estado los tests dependen del orden → `reiniciar()` exportada en `src/app.js`, en Scope y en «Dónde se prueba» (decisión 14).
- **Aceptado (ronda 2)** — (3, 8) precedencia de validaciones y parseo del flag → decisiones 11 y 12, escenarios 11 y 4.
- **Aceptado (ronda 2)** — (4) faltaba probar «ya cancelada» → escenario 12.
- **Aceptado (ronda 2)** — (5) «`cancelar` no acepta `--como`» → reformulada: `cancelar` no cambia (decisión 9).
- **Aceptado (ronda 2)** — (6, 7) visibilidad del cliente y regla de permisos → decisión 7 con su motivo y regla «Permisos».
- **Aceptado (ronda 2)** — (9, 10) frase de PRODUCT.md y criterio de éxito → decisión 13 con el texto, Intent reescrito.
- **Rechazado** — (técnica 4) pedir una fila «anulada por cliente» o dos anulaciones → solo el `responsable` puede anular, así que el valor guardado solo puede ser `responsable`; en memoria no hay reservas anuladas antes de este cambio. El test del escenario 7 comprueba el campo guardado, no un literal fijo.
- **Rechazado** — (técnica 10, segunda parte) interacción con la regla de 24 h → esa regla es de `cancelar`; `anular` no tiene plazo (PRODUCT.md: «por cualquier motivo»).

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios ni cuentas, así que es un rol **declarado**, no un control de acceso: cualquiera puede escribir `--como responsable`. Entra una frase en PRODUCT.md (Product Purpose) que lo diga.
2. Capacidad nueva `reservas` (castellano, por «Evitar: booking»): hoy no hay `capabilities/`, y el comportamiento de `anular` que existe en `src/app.js` se documenta como `ADDED`.
3. `anuladas` es un comando **nuevo** (no existe hoy), con la salida `<sala> <día> — anulada por <rol>`, una línea por reserva anulada, y `sin anuladas` si no hay ninguna.
4. `anular` y `anuladas` sin `--como`, o con un valor distinto de `cliente` o `responsable`, responden `indica --como cliente o --como responsable` y no cambian nada. Es un cambio para quien ya llamaba `anular` sin flag: hoy anulaba.
5. Se guarda el **rol** que anuló (campo `anuladaPor` en la reserva, que vive en memoria como el resto): sin persistencia ni migración, no hay reservas anuladas de antes.
6. Anular una reserva inexistente, ya anulada o ya cancelada responde `sin reserva <sala> <día>` (lo que `anular` responde hoy) y no cambia `anuladaPor`.
7. El `cliente` ve `anuladas` sin el rol: `<sala> <día> — anulada`. Ve el listado completo porque una anulación es un hecho que le afecta (su reserva desaparece); lo único que no ve es el rol.
8. No hay responsable por sala: cualquier `responsable` anula cualquier reserva, también las suyas (la fila del roadmap dice «de cada sala»; la app no tiene usuarios que lo distingan).
9. `cancelar` no cambia: sigue sin mirar `--como`.
10. **Límite que debes validar:** el estado vive en memoria y cada `node src/app.js …` arranca de cero, así que desde la línea de comandos `anular` y `anuladas` no comparten estado: `anuladas` responde `sin anuladas`. El listado solo se ve dentro de un proceso (tests, o `run` encadenado). La persistencia queda fuera de esta feature; si la quieres dentro, es otra feature o crece esta.
11. Orden de validación: primero el rol (`--como` válido), luego el permiso (`cliente` no anula) y al final la existencia: `anular Sur mar --como cliente` responde `solo el responsable de sala puede anular`.
12. `--como <rol>` va al final; sin valor (`anular Norte lun --como`) se trata como rol no válido.
13. Frase nueva en PRODUCT.md, **añadida** tras «No hay más usuarios ni más desarrolladores.»: «No hay cuentas: los roles `cliente` y `responsable` de sala se declaran con `--como`, sin control de acceso.»
14. Costura de test: `src/app.js` exporta `reiniciar()`, que devuelve las reservas a la sembrada (Norte lun activa), para que cada test parta del mismo estado.
- Política de modelos: revisores de la spec dominio opus y técnica sonnet (ya despachados, y un tercero sonnet si hay segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy cualquiera anula cualquier reserva y no queda constancia de quién lo hizo. Según PRODUCT.md, la anulación es cosa del responsable de sala: el responsable debe poder anular reservas de otros, el cliente no, y el listado `anuladas` debe enseñar al responsable con qué rol se anuló. Éxito: anular exige declarar el rol, el `cliente` declarado es rechazado y sin `--como` no se anula por descuido. No es seguridad: el rol es declarado (decisión 1).

## Scope

- Entra: `anular` con `--como`, el comando nuevo `anuladas` con el rol que anuló, `reiniciar()` para los tests y una frase en PRODUCT.md (Product Purpose) sobre los roles declarados (decisión 13).
- No entra: `cancelar`, autenticación real, un responsable por sala, persistencia entre invocaciones (decisión 10).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin `--como` deja de anular | `src/app.js:20-25` (`voidBooking`), `src/app.js:31` | delta, escenarios 3 y 4 · decisión 4 |
| «No hay más usuarios ni más desarrolladores» | `PRODUCT.md` (Product Purpose) | Scope · decisión 1 |

- Filas que implementa: 0011 → `ROADMAP.md:8` («de cada sala») → decisión 8, sin cambio en la fila.

## Approach

Una sola vía sensata: `run` lee `--como` de los parámetros, `voidBooking` recibe el rol y guarda `anuladaPor`, y `anuladas` recorre las reservas con estado `voided`. Un módulo nuevo para esto no compensa en 60 líneas.

## Dónde se prueba

- `anular` y `anuladas`: por `run('anular', …)` y `run('anuladas', …)` (ya exportada en `src/app.js`), en `test/anular.test.js`, como `test/cancel.test.js`, con `reiniciar()` antes de cada test (decisión 14); gate: `node --test` entero.

## Delta de comportamiento

### Capacidad: `reservas`

#### ADDED — Anular una reserva

1. - GIVEN la reserva activa de Norte del lun
   - WHEN `anular Norte lun --como responsable`
   - THEN responde `anulada Norte lun` y la reserva queda anulada
2. - GIVEN la reserva activa de Norte del lun
   - WHEN `anular Norte lun --como cliente`
   - THEN responde `solo el responsable de sala puede anular`
   - AND la reserva sigue activa: después `anular Norte lun --como responsable` responde `anulada Norte lun`
3. - GIVEN la reserva activa de Norte del lun
   - WHEN `anular Norte lun`
   - THEN responde `indica --como cliente o --como responsable` y la reserva sigue activa
4. - GIVEN la reserva activa de Norte del lun
   - WHEN `anular Norte lun --como admin`, y `anular Norte lun --como` (sin valor)
   - THEN ambas responden `indica --como cliente o --como responsable` y la reserva sigue activa
5. - GIVEN la reserva de Norte del lun ya anulada por el responsable
   - WHEN `anular Norte lun --como responsable`, y `anular Sur mar --como responsable` (sin reserva)
   - THEN responden `sin reserva Norte lun` y `sin reserva Sur mar`
   - AND `anuladas --como responsable` sigue listando una sola línea, `Norte lun — anulada por responsable`
6. - GIVEN la reserva activa de Norte del lun
   - WHEN `cancelar Norte lun` (sin `--como`)
   - THEN responde `cancelada Norte lun`, como hoy
11. - GIVEN ninguna reserva en Sur del mar
    - WHEN `anular Sur mar --como cliente`
    - THEN responde `solo el responsable de sala puede anular`
12. - GIVEN la reserva de Norte del lun cancelada con `cancelar Norte lun`
    - WHEN `anular Norte lun --como responsable`
    - THEN responde `sin reserva Norte lun`
    - AND `anuladas --como responsable` responde `sin anuladas`

#### ADDED — Ver las anuladas

7. - GIVEN la reserva de Norte del lun anulada con `--como responsable`
   - WHEN `anuladas --como responsable`
   - THEN responde `Norte lun — anulada por responsable`
8. - GIVEN la misma reserva anulada
   - WHEN `anuladas --como cliente`
   - THEN responde `Norte lun — anulada`, sin el rol
9. - GIVEN ninguna reserva anulada
   - WHEN `anuladas --como responsable`
   - THEN responde `sin anuladas`
10. - GIVEN cualquier estado
    - WHEN `anuladas` sin `--como`
    - THEN responde `indica --como cliente o --como responsable`

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: en memoria, en la reserva (`anuladaPor`: `responsable`); sin persistencia ni migración
- **Idioma de los nombres**: castellano (capacidad `reservas`, comando `anuladas`, flag `--como`)
- **Límites**: no aplica
- **Permisos**: `responsable` anula y ve el rol en `anuladas`; `cliente` no anula y ve `anuladas` sin rol; `cancelar` no distingue roles
- **Avisos**: `solo el responsable de sala puede anular` · `indica --como cliente o --como responsable`
- **Regla ante conflicto**: anular lo inexistente, ya anulado o ya cancelado responde `sin reserva <sala> <día>` y no toca `anuladaPor`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
