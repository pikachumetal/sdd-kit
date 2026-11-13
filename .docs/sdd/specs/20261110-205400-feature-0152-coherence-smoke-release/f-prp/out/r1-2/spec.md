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

🦆 Hoy cualquiera anula la reserva de Norte del lunes, que es de Pedro, sin decir quién es. Con este cambio, quien anula dice su nombre y solo Ana, responsable de Norte, la anula. Luis, responsable de Sur, recibe «solo Ana anula reservas de Norte» y la reserva sigue activa. Pedro tampoco anula la suya: para eso tiene la cancelación, que no cambia. El nombre no se comprueba: quien escriba «Ana» pasa.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — anular una reserva de otra persona exige ser responsable de la sala (hoy no hay `capabilities/bookings.md`: la capacidad nace con este requisito).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`), contrato público (`anular ... --como` y el formato de `data/managers.json`), MODIFIED en el fondo (hoy `voidBooking` deja anular a cualquiera; se declara ADDED porque `bookings` no tiene fichero), datos nuevos (`data/managers.json`), reglas de permiso (quién no puede anular) · tamaño: ~50 líneas en 3 ficheros (`src/app.js`, `test/`, `data/managers.json`)
- Dominio (opus): qué NO puede hacer cada persona —Luis en Norte, Ana en Sur, quien no es responsable de nada— y qué pasa sin `--como` o con una sala sin responsable (señal: reglas de permiso)
- Técnica (sonnet): si `--como` y `data/managers.json` quedan definidos como contrato (formato, ruta, error si falta el fichero) y si «de Pedro» es comprobable cuando `bookings` en `src/app.js` no guarda dueño (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el contrato de `--como` y del fichero

- Política de modelos: dominio opus + técnica sonnet, en paralelo · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pasada de coherencia: `bookings` figuraba como Modificada y no existe en `capabilities/` (`sdd capability merge` sobre copia: «no tiene fichero en capabilities/»); pasa a Nueva y su requisito a ADDED. El Scope no listaba `src/app.js` (`voidBooking`, que hoy anula sin comprobar nada) ni `test/`; añadidos. Fusión del delta sobre copia: `room-managers.md: añadido «Cada sala tiene un responsable»`, `bookings.md: añadido «Solo el responsable anula reservas de otros»`, sin rechazos.

### Decisiones

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`), ruta relativa a la raíz del repo, codificación UTF-8.
2. Quien ejecuta el comando se identifica con `--como` seguido del nombre, tras los dos posicionales.
3. Cada reserva guarda `owner`; una sin dueño solo la anula el responsable.
4. Literales, con {sala}, {día} y {responsable} como marcadores: «solo {responsable} anula reservas de {sala}», «anulada {sala} {día}», «indica quién eres: usa --como y tu nombre», «la sala {sala} no tiene responsable», «no se puede leer data/managers.json». Respuestas por stdout, sin cambiar el código de salida.
5. `--como` es declarativo y no autentica: se confía en quien lo escribe.
6. Un responsable por sala; una persona puede serlo de varias; los nombres distinguen mayúsculas.
7. Quien anula su propia reserva sin ser responsable: rechazo igual que cualquier otro; usa `cancelar`.
8. Los tests usan un fixture propio de responsables, no el fichero real.
9. `managerOf(sala)` exportada desde `src/app.js` lee el fichero en cada llamada.
10. `PRODUCT.md` dice «No hay más usuarios»; esta feature supone varias personas y no lo cambia: lo valida Laura.
11. Orden de comprobaciones de `anular`: primero `--como` (ausente o vacío), luego el fichero, luego la sala, luego el responsable.
12. «Mal formado» incluye JSON válido que no es un objeto de salas con nombres de texto.
13. `anular` del responsable no tiene límite de horas: el de 24 h es de `cancelar`.
14. `voidBooking` cambia de comportamiento (hoy anula a cualquiera): es en el fondo un MODIFIED, declarado ADDED porque `bookings` no tiene fichero; `managerOf` pasa a contrato exportado.
15. Las reservas existentes sin `owner` siguen anulables solo por el responsable; que `reservar` no fije el dueño queda como riesgo conocido, fuera de esta feature.
16. Ana, Luis, Pedro y Marta son nombres inventados de ejemplo; Laura es la dev-lead del proyecto.

### Hallazgos de la review

Dominio (opus, 10 hallazgos) y técnica (sonnet, 9), en paralelo.

- **Aceptado (Crítico)** — las reservas no guardan dueño, «de otros» no es comprobable → cada reserva guarda `owner`; la de ejemplo es de Pedro; una reserva sin dueño solo la anula su responsable de sala; cómo se fija el dueño al crearla (`reservar` hoy es un resto) queda fuera (Scope, «No entra»).
- **Aceptado (Crítico)** — `anular` sin `--como` sin escenario → rechaza con «indica quién eres: usa --como y tu nombre» y la reserva sigue activa.
- **Aceptado** — anular lo propio, Ana en Sur, quien no es responsable de nada, nombre desconocido, sala sin responsable y `managers.json` ausente o mal formado → un escenario cada uno en `bookings`.
- **Aceptado** — Anulación vs Cancelación: quien anula su propia reserva sin ser responsable recibe el rechazo de siempre y usa `cancelar` (el límite de 24 h no se salta); el responsable que anula la suya hace una Anulación → escenarios añadidos.
- **Aceptado** — `--como` no autentica → límite asumido, decisión 5.
- **Aceptado** — las cinco reglas por nombre → bloque «Reglas» en Approach.
- **Aceptado** — escenario de `room-managers` no observable ni discriminante → se prueba con la función `managerOf(sala)` y un segundo contenido del fichero.
- **Aceptado** — literales, ruta y forma del JSON fuera de ✋ → decisiones 3 a 9.
- **Aceptado** — tests con fixture propio, no con el `data/managers.json` real → Scope.
- **Aceptado, para Laura** — `PRODUCT.md` dice «No hay más usuarios»; la spec introduce a Ana, Luis y Pedro → decisión 10: no toco `PRODUCT.md` desde esta feature; si Laura confirma varias personas, es otra fila del roadmap.
- **Rechazado (Menor)** — varias franjas el mismo día en una sala: `findBooking` ya busca por sala y día y no cambia → motivo: comportamiento de hoy, sin tocar.

Segunda ronda (sonnet, 10 hallazgos):

- **Aceptado (Crítico)** — `anular` ya existe y hoy anula a cualquiera → decisión 14.
- **Aceptado (Crítico)** — la reserva de Sur sin dueño ni día en el GIVEN → «reserva de Sur del lunes, de Pedro» y «sigue activa».
- **Aceptado (Crítico)** — «sin dueño» sin escenario → escenario propio.
- **Aceptado** — AND con GIVEN escondido y literales como plantilla → GIVEN propio para Ana y marcadores en la decisión 4.
- **Aceptado** — orden de comprobaciones, forma del fichero, vía de respuesta, `owner` existente, nombres inventados → decisiones 10 a 16.
- **Aceptado** — `--como ana` en minúsculas → escenario.
- **Rechazado** — límite de 24 h para el responsable → motivo: pertenece a `cancelar`; decisión 13.
- **Rechazado (Menor)** — separar cabecera de review y decisiones → el orden ya es decisiones y luego hallazgos.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas.

## Scope

- Entra: `anular` con sala, día y `--como` seguido del nombre; `data/managers.json`; `src/app.js` (`voidBooking` y el despacho de `anular` en `run`); `test/` (tests del nuevo comportamiento, con fixture propio de responsables).
- No entra: cancelar la propia reserva, que sigue igual; cómo se fija el dueño al crear una reserva; autenticar a quien ejecuta; varias franjas el mismo día en una sala.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala.

Reglas: datos solo en `data/managers.json` · nombres en castellano, sensibles a mayúsculas · un responsable por sala · avisos: los literales de la decisión 4 · conflicto: si el fichero falta o está mal formado, no se anula nada.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `managerOf("Norte")`
- THEN devuelve «Ana»
- AND con `{"Norte": "Marta"}`, `managerOf("Norte")` devuelve «Marta» y `managerOf("Sur")` devuelve nada

### Capacidad: `bookings`

**ADDED — Solo el responsable anula reservas de otros**
- GIVEN las reservas de Norte del lunes y de Sur del lunes, ambas de Pedro, y los responsables Norte→Ana, Sur→Luis
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva de Norte sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun» y la reserva queda anulada
- AND `anular Sur lun --como Ana` responde «solo Luis anula reservas de Sur» y la de Sur sigue activa
- AND `anular Sur lun --como luis`, en minúsculas, responde «solo Luis anula reservas de Sur»

**ADDED — Hay que decir quién anula**
- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun` sin `--como`
- THEN responde «indica quién eres: usa --como y tu nombre» y la reserva sigue activa

**ADDED — Quien no es responsable no anula ni lo propio**
- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Pedro`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — El responsable anula también la suya**
- GIVEN una reserva de Norte del martes, de Ana
- WHEN `anular Norte mar --como Ana`
- THEN responde «anulada Norte mar» y la reserva queda anulada

**ADDED — Una reserva sin dueño solo la anula el responsable**
- GIVEN una reserva de Norte del miércoles sin dueño
- WHEN `anular Norte mie --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y sigue activa
- AND `anular Norte mie --como Ana` responde «anulada Norte mie»

**ADDED — Sala sin responsable o fichero ilegible**
- GIVEN una sala Este sin entrada en `data/managers.json`
- WHEN `anular Este lun --como Ana`
- THEN responde «la sala Este no tiene responsable» y la reserva sigue activa
- AND con el fichero ausente o con JSON inválido responde «no se puede leer data/managers.json» y no anula nada

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
