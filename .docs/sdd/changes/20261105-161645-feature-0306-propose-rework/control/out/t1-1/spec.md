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

🦆 Hoy `anular Norte lun` anula la reserva sea quien sea quien lo escriba. Después de esto hará falta añadir `--como Ana`, y solo la persona que `data/managers.json` pone como responsable de la sala podrá anular: `--como Luis` recibe «solo Ana anula reservas de Norte» y la reserva sigue ahí. No es una contraseña (cualquiera puede escribir `--como Ana`) y `cancelar` no cambia: sigue abierto a todos.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — reservas; esta feature escribe solo el requisito de anular (hoy sin capacidad escrita).

## Decisiones que he tomado yo — valida estas

1. **Solape con la 0009 (decide tú).** `docs/config.md` dice que quién es responsable de cada sala y su fichero «los define la 0009», que sigue pendiente y va antes en el roadmap. Esta spec crea `room-managers` y `data/managers.json` con lo mínimo para anular: **un único responsable por sala** (`{"Norte": "Ana", "Sur": "Luis"}`), versionado en git con ese contenido de ejemplo y editado a mano (no hay comando). *Recomendada:* mantenerlo así, para no bloquear la 0011; si la 0009 define otro formato (varios responsables, por ejemplo), manda la 0009 y se migra el fichero; la fila de la 0009 se reconcilia con `sdd-roadmap` al cerrar. *Alternativa:* hacer antes la 0009 y que esta feature solo lea el fichero.
2. Capacidades nuevas `room-managers` y `bookings` (ids en inglés y kebab-case, que es el nombre del fichero; el contenido va en castellano). Sin capacidades escritas, el requisito de anular no tiene qué modificar: va como `ADDED`. `bookings` queda **incompleta a propósito**: solo recoge anular; cancelar y reservar las amplía quien las toque.
3. **Las reservas no guardan a nombre de quién están** (`PRODUCT.md` dice «a nombre de quien la pide»; el código no lo guarda: divergencia que esta feature no resuelve). Por eso «reservas de otros» no se puede evaluar y la regla es: `anular` es del responsable de la sala, sea de quien sea la reserva. Coincide con «Anulación» de `PRODUCT.md`, que no se toca; la divergencia del titular se anota como fila de deuda técnica en el roadmap al cerrar.
4. **`cancelar` sigue abierto a todos** (riesgo aceptado): sin titular guardado no se puede limitar «a la propia reserva». Cierra solo el hueco de `anular`; restringir `cancelar` exigiría guardar el titular y es otra feature.
5. Hoy hay como máximo una reserva activa por sala y día (`anular` toma la primera); no se define qué pasa con varias.
6. Quien ejecuta se identifica con `--como <nombre>`, solo en la forma `--como <nombre>` tras los posicionales (no `--como=Ana`). `--como` sin valor o vacío equivale a no ponerlo. No es autenticación: cualquiera puede escribir `--como Ana` (la misión es de un solo usuario).
7. Nombres de persona y de sala se comparan tal cual: con mayúsculas, sin `trim` ni normalizar; los mensajes usan el valor del fichero literal.
8. **Dónde se lee el fichero:** `data/managers.json` relativo a la raíz del proyecto (resuelto desde `src/app.js`, no desde el directorio de ejecución). Los tests lo redirigen con la variable de entorno `SALAS_MANAGERS`. La consulta se expone como función exportada `responsable(sala)`.
9. Una sala que no está en el fichero, o la ausencia del fichero (hoy no existe `data/`), cuentan como «sala sin responsable»: nadie anula. Un fichero ilegible o que no es un objeto de textos responde «data/managers.json no es válido» y no anula nada.
10. Orden de comprobación de `anular`: sin `--como` (incluida la forma `--como=Ana`, que cuenta como ausente) → fichero inválido → sala sin responsable → no es el responsable → sin reserva. Así quien no es responsable recibe el rechazo aunque la sala no tenga reserva ese día.
11. Mensajes: «solo <responsable> anula reservas de <sala>» (el nombre del responsable es visible para quien pregunta; no se oculta), «<sala> no tiene responsable», «indica quién eres con --como»; el de éxito, `anulada <sala> <día>`, ya existe y se conserva. Hoy no hay tests de `anular`: esta feature los crea.
12. Límites de nombres y número de salas: no aplica.
13. El aprobador (Laura) viene del arranque del proyecto; no lo cambio. Los nombres Ana y Luis son de ejemplo, genéricos.

### Hallazgos de la review

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (flag `--como`, formato de `data/managers.json`), datos (fichero nuevo), reglas de visibilidad/permiso (quién no puede anular) · tamaño: ~60 líneas en 5 ficheros
- Dominio (opus): si «solo el responsable anula» deja huecos de permiso (sala sin responsable, sin `--como`, orden permiso/existencia) y si `anular` frente a `cancelar` contradice `PRODUCT.md` (señal: permiso)
- Técnica (sonnet): si el formato de `managers.json` y el nombre sin normalizar bastan, y si el delta es verificable con los tests de hoy (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar la regla de permisos y su complemento

- **Aceptado** — (D1, Crítico) `cancelar` sigue abierto, el Intent no lo cierra → decisión 4 e Intent reescrito.
- **Aceptado** — (D2, Crítico) «de Pedro» contradice que no se guarde titular → quitado del GIVEN; divergencia con `PRODUCT.md` en decisión 3.
- **Rechazado** — (D3) términos en inglés → el id de capacidad es nombre de fichero y la regla del kit lo pide en inglés; el texto va en castellano (decisión 2).
- **Aceptado** — (D4) varias franjas → decisión 5. (D5, D6, D7, D9) escenarios de orden permiso/existencia, `--como ana`, `--como` vacío, fichero inválido → delta y decisiones 6, 7, 9, 12. (D8) alcance oculto → Scope y decisión 1.
- **Rechazado** — (D10) aprobadora → no es mío cambiarla (decisión 12); la visibilidad del nombre del responsable queda declarada (decisión 11).
- **Aceptado** — (T1) WHEN sin interfaz → `responsable(sala)` y `SALAS_MANAGERS` (decisión 8). (T2, T3) un escenario por requisito y escenarios de sin fichero y sala sin reserva → delta. (T4) fichero inválido → decisión 9. (T5) ruta → decisión 8. (T6) sintaxis de `--como` → decisión 6. (T7) tests de `anular` → decisión 11. (T8) sin `trim` → decisión 7. (T10) `bookings` incompleta → decisión 2.
- **Segunda ronda (un revisor, Sonnet):** Aceptado — fixture único (`SALAS_MANAGERS`), escenarios separados de `--como` ausente, vacío, `=Ana` y `ana`, orden de comprobación (decisión 10), `PRODUCT.md` no se toca y la deuda va al roadmap, consecuencia de `--como` sin autenticar en el Intent, resultado de la pasada del delta anotado, decisión 12 separada. **Rechazado** — escenario con dos reservas el mismo día: la decisión 5 ya dice que no se define y queda fuera de alcance.
- **Aceptado** — (T9) la decisión 1 queda sin resolver hasta tu gate: es lo que pide la aprobación.

### Coherencia

- Retirado o cambiado de forma: la línea de `docs/config.md` «Responsables de sala: aún no hay… los define la 0009» → se reescribe (ver Scope). La firma de `voidBooking(room, day)` en `src/app.js` cambia; `git grep` fuera de `.docs/sdd/specs/` no la encuentra en otros ficheros ni en `test/`. Id 0011: solo la fila del roadmap, que no cambia. Id 0009: `docs/config.md` y el roadmap, ver decisión 1.
- Delta probado en una copia de `.docs/sdd` (`sdd capability merge`): primera pasada rechazada («`bookings` no tiene fichero y no está en Nuevas», corregido con la decisión 2); segunda pasada tras la review y la segunda ronda: exit 0, ocho requisitos añadidos (dos en `room-managers`, seis en `bookings`).
- Política de modelos: revisor de dominio en Opus (reglas de rol), técnico en Sonnet; segunda ronda, un revisor en Sonnet.

## Intent

Hoy cualquiera anula cualquier reserva con `anular <sala> <día>`. Solo el responsable de cada sala debe poder anular. Éxito: `anular Norte lun --como Luis` no toca la reserva; `--como Ana` la anula. Sería un fallo, aunque funcione, que una sala sin responsable pueda anularse, o que el rechazo deje la reserva anulada. `cancelar` sigue abierto a todos (decisión 4): esta feature no cierra ese hueco. La regla es una guarda contra errores, no un control de acceso: `--como` no autentica y el rechazo nombra al responsable (decisiones 6 y 11).

## Scope

- Entra: `anular <sala> <día> --como <nombre>` y `responsable(sala)` en `src/app.js`; `data/managers.json`; tests nuevos en `test/`; `docs/config.md` (describe el fichero en vez de remitir a la 0009); las capacidades `room-managers` y `bookings`, que se escriben al cerrar. Al cerrar también, con `sdd-roadmap`: la fila de la 0009 (dependencia declarada: si define otro formato, manda ella y migra el fichero) y la fila de deuda del titular.
- No entra: `cancelar` (sigue igual); autenticación real; guardar el titular de la reserva; qué más puede hacer un responsable (0009).

## Approach

`anular` lee `data/managers.json` (por `responsable(sala)`) y rechaza a quien no es responsable de la sala. Lo demás lo decide el plan.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `responsable("Norte")`
- THEN es Ana

**ADDED — Una sala puede no tener responsable**
- GIVEN `SALAS_MANAGERS` apunta a un fichero sin entrada para Norte, o a uno que no existe
- WHEN `responsable("Norte")`
- THEN no tiene

### Capacidad: `bookings`

En estos escenarios, salvo que se diga otra cosa, `SALAS_MANAGERS` apunta a un fichero temporal con `{"Norte": "Ana", "Sur": "Luis"}`.

**ADDED — Solo el responsable anula una reserva**
- GIVEN la reserva de Norte del lunes y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — El responsable anula**
- GIVEN la reserva de Norte del lunes y Ana responsable de Norte
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y la reserva queda anulada

**ADDED — Anular exige decir quién eres**
- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun`, o `anular Norte lun --como`, o `anular Norte lun --como ""`, o `anular Norte lun --como=Ana`
- THEN responde «indica quién eres con --como» y la reserva sigue activa

**ADDED — El nombre se compara tal cual**
- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — Una sala sin responsable no se anula**
- GIVEN Norte sin responsable, con reserva el lunes
- WHEN `anular Norte lun --como Ana`
- THEN responde «Norte no tiene responsable» y la reserva sigue activa

**ADDED — El permiso va antes que la reserva**
- GIVEN Luis responsable de Sur y Sur sin reserva el martes
- WHEN `anular Sur mar --como Ana`
- THEN responde «solo Luis anula reservas de Sur»

**ADDED — Un fichero de responsables inválido no anula**
- GIVEN `SALAS_MANAGERS` apunta a un fichero que no es JSON, o no es un objeto de textos (un escenario basta por forma de invalidez, con la misma respuesta)
- WHEN `anular Norte lun --como Ana`
- THEN responde «data/managers.json no es válido» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
