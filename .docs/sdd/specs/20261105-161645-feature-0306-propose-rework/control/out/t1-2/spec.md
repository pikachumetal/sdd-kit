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

🦆 Hoy cualquiera puede anular la reserva de Norte del lunes, aunque sea de Pedro. Con este cambio, `anular Norte lun --como Luis` responde «solo Ana anula reservas de Norte» y la reserva sigue en pie; `anular Norte lun --como Ana` la anula. Quién responde de cada sala se lee de `data/managers.json`. Por dentro, `anular` consulta ese fichero antes de tocar la reserva.

Validación: dev-lead — lo que usa una persona (la respuesta de `anular` con cada nombre) lo prueba quien usa la herramienta.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala
- Nuevas: `bookings` — las reservas y cómo se anulan (hoy no hay ninguna capacidad escrita: el comportamiento de `anular` vive solo en el código)

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (comando `anular` y formato de `data/managers.json`), datos nuevos (el fichero y el campo `person` de la reserva), regla de permisos (quién no puede anular) · tamaño: ~60 líneas en 5 ficheros (`src/app.js`, `data/managers.json`, `docs/config.md`, `roadmap.md`, tests)
- Dominio (opus): qué NO puede hacer quien no es responsable, y qué pasa si la sala no tiene responsable o si la reserva es de quien ejecuta (señal: regla de permisos)
- Técnica (sonnet): si el formato de `managers.json` y el campo `person` de la reserva quedan bien definidos y si `--como` ausente tiene respuesta (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el formato del fichero y los argumentos del comando

Política de modelos: revisores de la spec con dominio opus y técnica sonnet, en paralelo · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

1. **Solapa con la 0009 (⚠ mírala primero).** `docs/config.md` y el roadmap dicen que quién es responsable de cada sala y su fichero los define la 0009 («Responsables de sala», ⏳), y la 0011 está antes en el orden de trabajo. Decido que la 0011 crea lo mínimo —`room-managers` con un único dato, el responsable de cada sala— y la 0009 lo amplía con «qué puede hacer». Alternativa descartada: esperar a la 0009, porque deja la 0011 bloqueada sin necesidad. Si prefieres lo contrario, no apruebes y reordena el roadmap (la 0009 pasa delante de la 0011 y esta spec se reescribe sin `room-managers`). Por eso la 0011 también reescribe la fila de la 0009 en el roadmap (ver Scope).
2. Capacidad nueva `room-managers` (slug en inglés), con los responsables en `data/managers.json`, un fichero que la 0011 crea con `{"Norte": "Ana", "Sur": "Luis"}`. Un responsable por sala; una persona puede serlo de varias; las claves distinguen mayúsculas. `docs/config.md` pasa a decir dónde está el fichero y ese formato.
3. Capacidad nueva `bookings` (slug en inglés): recoge solo lo que la 0011 toca de las reservas —anular—; el resto de su comportamiento no se describe aquí.
4. Quien ejecuta el comando se identifica con `--como <nombre>`, sin comprobación: es una declaración, no una autenticación. **⚠ `mission.md` dice que la herramienta la usa una sola persona y esta feature supone varias (Ana, Luis, Pedro).** No toco `mission.md`: lo trato como nombres que la persona que opera la herramienta teclea en nombre de otras. Si no es así, dímelo y se corrige la misión.
5. La reserva guarda a nombre de quién está (`person`), un campo nuevo. Hoy hay una sola reserva en memoria (Norte, lun, 10:00-12:00); pasa a ser de Pedro. No hay reservas guardadas que migrar. Las reservas de los demás GIVEN (Sur, martes) las prepara cada test. Para ver si la de Norte sigue activa, los tests usan `libres 10:00-12:00`: ese comando mira solo la franja, no el día, y es suficiente aquí porque solo hay una reserva en esa franja (Norte sale en la lista si y solo si está anulada).
6. `--como` va después de los argumentos de posición (`anular <sala> <día> --como <nombre>`), con valor obligatorio; sin él, o sin valor, `anular` responde «indica quién anula con --como» y no cambia nada. El nombre se compara tal cual, con mayúsculas: «ana» no es «Ana».
7. Sala sin responsable —o sin fichero—: nadie anula con `anular` sus reservas, ni su dueño, y responde «Sur no tiene responsable». Consecuencia: mientras no haya responsable, esas reservas solo se quitan con `cancelar`.
8. `data/managers.json` que no es JSON válido: `anular` responde «data/managers.json no es JSON válido» y no cambia nada. Contrato de `managerOf`: fichero ausente → devuelve `null` para cualquier sala (no hay responsables); fichero inválido → lanza un error con ese mismo mensaje, que `anular` captura y devuelve como respuesta. Así se distinguen los dos casos.
9. Orden de comprobaciones: `--como` presente, reserva existente (el «sin reserva Norte lun» de hoy no cambia), responsable de la sala, `--como` igual al responsable. Alcance de la regla: con `anular` solo anula el responsable, también las reservas de su dueño: un dueño que no es responsable no anula la suya con `anular` (se le dice quién lo hace) y usa `cancelar`. El Intent lo recoge.
10. **Las cinco reglas de la capacidad, por nombre.** Dónde vive el dato: `data/managers.json`. Idioma de los nombres: castellano en mensajes y documentos; el flag `--como` se queda tal cual y los nombres de personas son datos. Límites: un responsable por sala, una persona puede serlo de varias, comparación exacta con mayúsculas. Avisos: ninguno al dueño cuando le anulan (no aplica). Conflicto: sala sin responsable, fichero ausente o inválido rechazan sin cambiar nada (✋ 7 y 8). El rechazo dice quién es el responsable («solo Ana anula…»): ese nombre lo ve cualquiera, no es secreto. Los mensajes salen por la misma vía que hoy (`console.log`, salida estándar, código 0, que `run` devuelve como texto); los literales son los de los THEN y el de éxito, «anulada Norte lun», es el que ya tiene.
11. Enfoques: (a) `anular` lee `data/managers.json` en cada llamada — elegido, es lo mínimo y no hay estado compartido; (b) cargarlo una vez al arrancar — descartado, `src/app.js` es un proceso por comando y no gana nada; (c) responsables dentro de `src/app.js` como las salas — descartado, el ejemplo del dev-lead ya fija el fichero. La interfaz que ven los tests de `room-managers` es la función `managerOf(sala)` exportada de `src/app.js`, que devuelve el nombre o `null`.
12. **⚠ Hueco que esta feature no cierra: `cancelar`.** Hoy `cancelar Norte lun` no pregunta quién es, así que Luis esquiva la regla cancelando la reserva de Pedro. `PRODUCT.md` define la cancelación como «la que anula el propio cliente», pero el código no lo comprueba. Lo dejo fuera (el roadmap pide solo `anular`), apunto una fila nueva en el Backlog del roadmap y el Intent no promete más que `anular`; dime si prefieres que `cancelar` entre aquí.
13. **Cambio incompatible**: `anular` sin `--como` deja de anular. El `README` no menciona `anular` y no hay ayuda del comando: no hay uso documentado que actualizar salvo `docs/config.md`.
14. Sin `§Frontend`: no hay interfaz visual. Los nombres de los ejemplos (Ana, Luis, Pedro) son de pila inventados; ningún dato real.
15. Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` termina bien: crea `room-managers.md` y `bookings.md` con 14 requisitos añadidos (4 de `room-managers`, 10 de `bookings`), repetida tras la segunda ronda. Corregido respecto al borrador: `bookings` no existía y no se podía «modificar»; no decía que la 0009 reclamaba los responsables (✋ 1) ni de quién es cada reserva (✋ 5). Lo retirado: nada. `git grep` de «anular», «responsable» y `--como` fuera de `specs/`: `src/app.js:31` (el comando, entra en el Scope), `PRODUCT.md:10` (define Anulación como «la que anula el responsable de sala»: coincide, no cambia), `docs/config.md:4` (entra en el Scope) y `roadmap.md:8-9` (las filas 0009 y 0011; la 0009 entra en el Scope).

### Hallazgos de la review

Primera ronda (dos revisores, dominio opus y técnica sonnet):

- **Aceptado** — Crítico, `bookings`: no se define qué es una reserva ni cómo se siembra → ✋ 5 (reserva única en memoria con `person`, observable con `libres`).
- **Aceptado** — Crítico, `bookings`: un escenario mezclaba el rechazo de Luis y el éxito de Ana → separados en dos escenarios.
- **Aceptado** — `room-managers` sin interfaz observable → `managerOf(sala)` (✋ 11).
- **Aceptado** — casos sin cubrir (`--como` sin valor, mayúsculas, orden, fichero ausente o inválido, dueño que anula la suya) → ✋ 6–9 y escenarios nuevos.
- **Aceptado** — contradicción ✋ 7 vs ✋ 8 e Intent más estrecho que la regla → ✋ 7 y 9 reescritos, Intent alineado.
- **Aceptado** — formato de `managers.json` solo de ejemplo → ✋ 2 y 8, y `docs/config.md`.
- **Aceptado** — canal y código de salida, plantillas → ✋ 10 (se queda la salida de hoy).
- **Aceptado** — la 0009 quedaría describiendo algo ya hecho → entra en el Scope reescribir su fila.
- **Aceptado** — las cinco reglas por nombre → dónde vive: `data/managers.json`; idioma: castellano (los nombres propios son datos); límites: un responsable por sala, una persona varias salas; avisos: ninguno; conflicto: sala sin responsable o fichero inválido rechazan sin cambiar nada (✋ 2, 7, 8, 10).
- **Aceptado** — el responsable de una sala no lo es de otra → escenario nuevo (Luis en Norte).
- **Aceptado** — `cancelar` esquiva la regla → ✋ 12, fuera de Scope, para tu decisión.
- **Aceptado** — `mission.md` dice una sola persona → ✋ 4, para tu decisión; no se toca la misión.
- **Rechazado** — nombres que podrían ser reales (Menor): vienen del ejemplo del dev-lead y son de pila inventados; ✋ 14 lo declara.
- **Rechazado** — alinear el aprobador con la misión (Menor): `Laura` figura como dev-lead en la spec que me diste; no es mío cambiarlo.
- **Rechazado** — escenario de edición de documentación (Menor): la documentación no es comportamiento observable; va en el plan.

Segunda ronda (un revisor, sonnet, tras dos Críticos aceptados):

- **Rechazado** — Crítico, `mission.md` dice una sola persona: la decisión es tuya, no mía. Sigue abierta en ✋ 4 con su ⚠; si tu respuesta es «actualiza la misión», entra en el Scope por enmienda.
- **Aceptado** — Crítico, `cancelar` esquiva la regla: el Intent ya no promete más que `anular`; la fila nueva va al Backlog del roadmap (Scope y ✋ 12).
- **Rechazado** — Importante, reparto con la 0009 decidido por el agente: el que decide el reparto eres tú al aprobar o no; separar la fila 0009 en otra confirmación no añade nada. Va el primero de ✋ 1.
- **Aceptado** — escenarios que faltaban: `--como` sin valor, «ana» frente a «Ana», reserva inexistente con y sin `--como`, fichero ausente de `managerOf` y fichero inválido de `managerOf`.
- **Rechazado** — escenarios de `managerOf("norte")` y de una persona con varias salas (Importante): es la misma comparación exacta que «ana» frente a «Ana» (✋ 6) y una persona con varias salas no cambia ningún THEN.
- **Aceptado** — `managerOf` ante fichero ausente o inválido → contrato en ✋ 8.
- **Aceptado** — datos de prueba de Sur martes y `libres` solo por franja → ✋ 5.
- **Aceptado** — cambio incompatible de `anular` y ficheros que se actualizan → ✋ 13 y Scope.
- **Rechazado** — Menor, recuento «9 o 10 ADDED»: el recuento ahora lo da la fusión (14), en ✋ 15; no va en las decisiones.
- **Aceptado** — las cinco reglas por nombre, en un ✋ propio → ✋ 10.

## Intent

Hoy cualquiera anula cualquier reserva con `anular`. Solo el responsable de cada sala debe poder anularlas con ese comando, también las reservas de otras personas, que es el caso que importa; el dueño que no es responsable usa `cancelar` para la suya. Éxito: con `anular`, Luis no puede anular una reserva de Norte; Ana, sí. Esta feature protege el comando `anular`, no las reservas: `cancelar` sigue sin preguntar quién es (✋ 12). Fallo aunque funcione: que `anular` sin `--como` siga anulando.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` y `managerOf` en `src/app.js`; el campo `person` de la reserva; `data/managers.json` (nuevo); `docs/config.md` (la línea de responsables); la fila 0009 de `roadmap.md` (pasa a «qué puede hacer cada responsable de sala»: quién lo es ya lo hace la 0011) y una fila nueva en su Backlog («Cancelar solo la propia reserva», ✋ 12); los tests en `test/`. Cambio incompatible: `anular` sin `--como` deja de anular (✋ 13).
- No entra: `cancelar` (igual que hoy, con el hueco del ✋ 12); lo que cada responsable puede hacer además de anular (0009); autenticación real; avisos.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala. Detalle y alternativas en ✋ 11.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte con `managerOf("Norte")`
- THEN es Ana

**ADDED — Una sala sin responsable lo dice**
- GIVEN `data/managers.json` con `{"Norte": "Ana"}`
- WHEN se pregunta `managerOf("Sur")`
- THEN es `null`

**ADDED — Sin fichero de responsables no hay responsable**
- GIVEN que no existe `data/managers.json`
- WHEN se pregunta `managerOf("Norte")`
- THEN es `null`

**ADDED — Un fichero de responsables inválido lo dice**
- GIVEN `data/managers.json` que no es JSON válido
- WHEN se pregunta `managerOf("Norte")`
- THEN falla con el error «data/managers.json no es JSON válido»

### Capacidad: `bookings`

**ADDED — Quien no es responsable no anula**
- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte»
- AND `libres 10:00-12:00` no lista Norte, porque la reserva sigue activa

**ADDED — El dueño que no es responsable tampoco anula**
- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Pedro`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — El responsable anula**
- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun»
- AND `libres 10:00-12:00` lista Norte

**ADDED — El responsable de una sala no lo es de otra**
- GIVEN la reserva de Norte del lunes, de Pedro, con Ana responsable de Norte y Luis de Sur
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — Anular exige decir quién anula**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun` sin `--como`
- THEN responde «indica quién anula con --como» y la reserva sigue activa

**ADDED — `--como` sin valor cuenta como ausente**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como`
- THEN responde «indica quién anula con --como» y la reserva sigue activa

**ADDED — El nombre se compara con mayúsculas**
- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — Sin reserva, se dice antes que nada del responsable**
- GIVEN Norte sin reserva el martes y Ana responsable de Norte
- WHEN `anular Norte mar --como Luis`
- THEN responde «sin reserva Norte mar»

**ADDED — Una sala sin responsable no se anula**
- GIVEN la reserva de Sur del martes, de Pedro, y Sur sin responsable en `data/managers.json`
- WHEN `anular Sur mar --como Ana`
- THEN responde «Sur no tiene responsable» y la reserva sigue activa

**ADDED — Un fichero de responsables inválido no anula**
- GIVEN la reserva de Norte del lunes, de Pedro, y `data/managers.json` que no es JSON válido
- WHEN `anular Norte lun --como Ana`
- THEN responde «data/managers.json no es JSON válido» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
