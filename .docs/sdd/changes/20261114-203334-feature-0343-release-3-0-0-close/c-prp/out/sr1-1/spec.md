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

🦆 Hoy cualquiera anula cualquier reserva. Con este cambio, quien pide una anulación dice con qué papel actúa, cliente o responsable de sala, y solo el responsable puede anular; el cliente recibe «solo el responsable de sala puede anular» y la reserva sigue activa. Cada anulación guarda quién la hizo, y un listado nuevo de anuladas lo enseña al responsable («Norte lun — anulada por responsable») pero no al cliente («Norte lun — anulada»). El papel se escribe a mano y no se comprueba: la herramienta no tiene usuarios, así que esto es una regla de uso y no una protección.

## Capacidades

- Modificadas: `bookings` — `anular` lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló.
- Nueva dentro de `bookings`: el listado `anuladas`, que hoy no existe.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular` y el flag nuevo) · tamaño: ~60 líneas en 3 ficheros
- Dominio (sonnet): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que cada escenario del delta tenga su WHEN y que `anuladas` no rompa la salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. **El rol es autodeclarado, sin autenticar.** Cualquiera puede escribir `--como responsable`. Lo acepto como límite porque PRODUCT dice que la usa una sola persona; la regla es de interfaz, no de seguridad. El Intent no promete más que eso.
3. **`--como` es obligatorio** en `anular` y en `anuladas`, con solo dos valores: `cliente` y `responsable`. Sin él: `falta --como <cliente|responsable>`; con otro valor: `rol desconocido <valor>`.
4. **`anuladas` es un comando nuevo**, no una ampliación: hoy no existe. Lista las reservas anuladas; las canceladas por el cliente no salen (son «Cancelación» en PRODUCT).
5. **Qué ve cada rol en `anuladas`**: el responsable ve `Norte lun — anulada por responsable`; el cliente ve `Norte lun — anulada`, sin quién anuló. Como solo el responsable puede anular, el dato guardado es el rol (`voidedBy: 'responsable'`), no una persona.
6. **Los textos de los mensajes son estos**: `solo el responsable de sala puede anular` (rechazo, la reserva sigue activa), `anulada <sala> <día>` (éxito, como hoy), `sin reserva <sala> <día>` (inexistente o ya anulada, como hoy).
7. `cancelar` no cambia: el cliente lo sigue usando sin `--como`.
8. **No existe `capabilities/`** en el proyecto, así que el `MODIFIED` parte del comportamiento de `src/app.js`, descrito en «Hoy». El fichero `capabilities/bookings.md` lo crea el cierre con la base integrada.
9. **Los datos viven en memoria** (`bookings` de `src/app.js`): sin persistencia, sin migración, sin reservas anuladas anteriores al cambio. El campo nuevo es `voidedBy`.
10. Los tests de `anular` son nuevos: hoy `anular` no tiene ninguno, y `test/cancel.test.js` y `test/app.test.js` no lo usan, así que el flag obligatorio no rompe ninguno. Comprobado con `git grep` en todo el repo: `anular` solo aparece en `src/app.js`; ni README ni scripts lo usan. Aun así es una ruptura del contrato de `anular` (flag obligatorio) y queda dicha en «Hoy».
11. **Orden de validación y posición del flag**: primero el rol, luego el permiso, luego si la reserva existe. `--como` va después de sala y día; sin valor cuenta como ausente. Así el cliente recibe siempre el rechazo de permiso y no averigua si una reserva existe.
12. **Salida de `anuladas`**: una línea por reserva anulada, separadas por salto de línea y en el orden de `bookings`; sin ninguna, `sin anuladas`.
13. **Datos sembrados para probar**: además de `Norte lun`, `bookings` lleva sembrada `Sur mié` (franja `14:00-16:00`, activa), para poder tener una reserva anulada y otra cancelada a la vez; no es `Sur mar`, que `test/cancel.test.js` espera sin reserva, y la franja no afecta a `libres` de `10:00-12:00`. `src/app.js` exporta `resetBookings()`, que restaura las reservas sembradas, y cada test la llama al empezar porque comparten estado en memoria.

### Reglas de la capacidad

- Dónde viven los datos: en memoria, campo `voidedBy` de cada reserva (decisión 9).
- Idioma de los nombres: mensajes y valores del rol en castellano (constitución, regla 4); el campo interno `voidedBy` en inglés, como `status` y `room`.
- Límites: no aplica como cifra; el límite es de forma: dos roles y `--como` obligatorio (decisión 3).
- Avisos: no aplica; el único riesgo, el rol sin autenticar, está aceptado en la decisión 2.
- Regla de conflicto: anular una reserva ya anulada o inexistente responde `sin reserva …` y no cambia nada (decisión 6).

### Hallazgos de la review

Dominio (D) y técnica (T):

- **Aceptado** — D1/T7 Crítico/Importante: `capabilities/bookings.md` no existe, el `MODIFIED` no tiene base → decisión 8 y bloque «Hoy» con el comportamiento de `src/app.js`.
- **Aceptado** — D3/T4 Crítico/Importante: el rol es autodeclarado → decisión 2, acotando el Intent.
- **Aceptado** — T1 Crítico: un solo escenario mezclaba tres comportamientos y el AND de `anuladas` no tenía WHEN → delta partido en cinco escenarios, cada uno con su GIVEN/WHEN/THEN.
- **Aceptado** — T2 Crítico: `--como` ausente o inválido y reserva inexistente o ya anulada sin escenario → decisiones 3 y 6 y escenarios 3 y 4.
- **Aceptado** — D2: faltaba el comportamiento actual → bloque «Hoy».
- **Aceptado** — D4/T3: faltaba qué ve el cliente en `anuladas` y el caso de canceladas → decisión 5, escenarios 2 y 5.
- **Aceptado** — D5: valores de `--como` y su error sin definir → decisión 3.
- **Aceptado** — D6/T9: choque Cancelación/Anulación → decisión 4 y 7, «No entra».
- **Aceptado** — D7: faltaban las cinco reglas de la capacidad → sección «Reglas de la capacidad».
- **Aceptado** — D8: la línea Capacidades solo citaba `anular` → añadida la línea de `anuladas`.
- **Aceptado** — T5: decisiones tomadas en el cuerpo sin declarar (textos, rechazo sin cambio de estado, `anuladas` ya existente) → decisiones 4 a 6; además, `anuladas` no existía, lo que ensanchaba el Scope sin decirlo.
- **Aceptado** — T6: choque entre la decisión del bloque de review y la salida de `anuladas` → decisión 4: `anuladas` es nuevo, sin formato previo ni consumidores, y el contrato de `anular` cambia solo por el flag obligatorio (decisión 3).
- **Aceptado** — T8: «Dónde se prueba» no cubría `anuladas` ni el rechazo → ampliado; decisión 10.
- **Aceptado** — D9, en parte: el ejemplo ya no habla de «Ana» → los escenarios usan la reserva sembrada `Norte lun`, que no tiene dueño. **Rechazado** lo de cambiar a `Laura`: es el aprobador del frontmatter, no un ejemplo de la spec; el dev-lead lo confirma en el gate.
- **Rechazado** — D10: «Mínimo razonable» no contradice «dos revisores»: es la línea del nivel más bajo defendible que fija el formato del bloque, y deja claro lo que no se cubre.

Segunda ronda (un revisor, sin tercera):

- **Aceptado** — R1 Crítico: las reservas anulada y cancelada del escenario 5 no existían en los datos sembrados → decisión 13 (`Sur mié` sembrada y `resetBookings()`); escenarios 5 y 6 usan `cancelar Sur mié`.
- **Aceptado** — R2 Crítico: orden de validación y posición de `--como` ambiguos → decisión 11 y escenarios 3 y 7.
- **Aceptado** — R3: cliente sobre reserva inexistente o ya anulada → escenario 7: gana el rechazo de permiso.
- **Aceptado** — R4: salida con lista vacía → decisión 12 y escenario 8.
- **Aceptado** — R5: separador y orden con varias anuladas → decisión 12 y escenario 5, con dos.
- **Aceptado** — R6: la ruptura de `anular` y el uso fuera de tests → decisión 10 (comprobado con `git grep`) y línea en «Hoy».
- **Aceptado** — R10: los «no aplica» sin justificar → «Reglas de la capacidad».
- **Rechazado** — R7: la lista «Evitar» de PRODUCT rige los textos que ve el usuario; `voidedBy` y `room` son nombres internos de código y `voidedBy: 'responsable'` es el mismo concepto que «por responsable» de la salida, con un único valor.
- **Rechazado** — R8: la subsección «Hallazgos de la review» la exige la plantilla y la lee el dev-lead en el gate; solo se ha acortado.
- **Rechazado** — R9: «siete puntos» es el nivel del revisor único que fija el kit y no una cifra de esta ronda; el aprobador `Laura` ya se rechazó en D9.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no, como regla de interfaz: el rol se declara con `--como` y no se autentica (decisión 2).

## Scope

- Entra: `anular` con `--como` obligatorio; el comando nuevo `anuladas` con `--como`; el campo `voidedBy`; la reserva sembrada `Sur mié` y `resetBookings()` (decisión 13).
- No entra: `cancelar` (decisión 7), autenticación de verdad, persistencia.

## Dónde se prueba

- Anular y `anuladas`: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`. Es un fichero nuevo; no hay tests de `anular` que actualizar.

## Delta de comportamiento

### Capacidad: `bookings`

**Hoy:** `anular Norte lun` pasa la reserva activa a anulada y responde `anulada Norte lun`; sin reserva activa responde `sin reserva Norte lun`. No distingue quién lo pide, no guarda quién anuló y no existe un listado de anuladas. **Ruptura:** `anular` sin `--como`, que hoy funciona, pasa a fallar (decisión 3).

**MODIFIED — Anular una reserva**

Escenario 1 — el responsable anula
- GIVEN las reservas sembradas (`resetBookings()`), con Norte del lun activa
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada con `voidedBy` igual a `responsable`

Escenario 2 — el cliente no anula
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`, la reserva sigue activa y `voidedBy` no se rellena

Escenario 3 — rol ausente o desconocido
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` sin `--como`
- THEN responde `falta --como <cliente|responsable>` y la reserva sigue activa
- AND con `anular Norte lun --como` (sin valor) responde `falta --como <cliente|responsable>` y la reserva sigue activa
- AND con `--como gestor` responde `rol desconocido gestor` y la reserva sigue activa

Escenario 4 — reserva inexistente o ya anulada
- GIVEN la reserva de Norte del lun ya anulada por el responsable
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun` y no cambia nada
- AND con `anular Sur mar --como responsable`, sin reserva, responde `sin reserva Sur mar`

Escenario 7 — el permiso va antes que la existencia
- GIVEN la reserva de Norte del lun ya anulada, y ninguna reserva de Sur del mar
- WHEN `anular Norte lun --como cliente` y `anular Sur mar --como cliente`
- THEN ambas responden `solo el responsable de sala puede anular`, sin decir si la reserva existe

**ADDED — Listado de anuladas**

Escenario 5 — qué ve cada rol, con dos anuladas
- GIVEN las reservas de Norte del lun y de Sur del mié anuladas por el responsable
- WHEN `anuladas --como responsable`
- THEN responde dos líneas, en el orden de `bookings`: `Norte lun — anulada por responsable` y `Sur mié — anulada por responsable`
- AND con `anuladas --como cliente` responde `Norte lun — anulada` y `Sur mié — anulada`, sin quién anuló
- AND sin `--como` responde `falta --como <cliente|responsable>`; con `--como gestor`, `rol desconocido gestor`

Escenario 6 — las canceladas no salen
- GIVEN la reserva de Norte del lun anulada por el responsable y la de Sur del mié cancelada con `cancelar Sur mié`
- WHEN `anuladas --como responsable`
- THEN responde solo `Norte lun — anulada por responsable`

Escenario 8 — sin anuladas
- GIVEN las reservas sembradas, ninguna anulada
- WHEN `anuladas --como responsable` y `anuladas --como cliente`
- THEN ambas responden `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
