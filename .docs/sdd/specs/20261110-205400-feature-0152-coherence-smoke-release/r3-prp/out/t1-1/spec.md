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

## 🦆 En corto

Hoy `anular Norte lun` anula la reserva de cualquiera. Con esto, `anular Norte lun --como Luis` responde «solo Ana anula reservas de Norte» y la reserva sigue activa; con `--como Ana` responde «anulada Norte lun» y la sala vuelve a salir libre en `libres`. Quién es responsable de cada sala sale de `data/managers.json`. `--como` solo dice quién eres: no comprueba que lo seas.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — las reservas y su anulación (aún no tenía fichero en `capabilities/`).
- Modificadas: ninguna. El comportamiento que `anular` tiene hoy (anula a cualquiera, sin identificarse) queda sustituido: es un cambio incompatible y buscado (decisión 3).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), regla de permiso (quién no puede anular), datos nuevos (`data/managers.json`) · tamaño: ~45 líneas en 4 ficheros
- Dominio (opus): si el rol responsable dice también lo que NO puede hacer (Ana en Sur) y qué pasa con `managers.json` ausente (señal: regla de permiso + datos)
- Técnica (sonnet): si cada THEN es observable y si el orden de validación de `--como` está fijado (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar el complemento del rol, que es donde se cuela quien no debía poder anular

Política de modelos: dominio en Opus (reglas de rol), técnica en Sonnet, segunda ronda en Sonnet.

1. ⚠️ **Solapa con la 0009 «Responsables de sala»** (en Now, ⏳): `docs/config.md` dice que quién es cada responsable y su fichero los define la 0009. Esta spec define `room-managers` y `data/managers.json` por su cuenta. **Recomiendo que la 0011 vaya tras la 0009** (`Tras: 0009`) y reutilice lo que fije ella, quitando `room-managers` de aquí; si prefieres que la 0011 los cree, la 0009 se reduce. Decídelo al aprobar: hasta entonces la spec los define aquí ; si la 0011 llega segunda, su `ADDED` de `room-managers` pasa a `MODIFIED` y se ajusta a lo que fije la 0009; si llega primera, la 0009 es la que se ajusta.
2. Nombres de capacidad en inglés, kebab-case (`room-managers`, `bookings`), aunque PRODUCT.md evite «room» y «booking» en el texto al usuario: el slug es un nombre de fichero.
3. `bookings` entra como capacidad nueva porque no existe `capabilities/`: `Anular una reserva` es `ADDED`, no `MODIFIED`. Aun así cambia lo que `anular` hace hoy: `anular Norte lun` sin `--como` pasa de anular a responder «falta --como». Lo asumo; no hay más usuarios que avisar (PRODUCT.md).
4. Quien ejecuta el comando se identifica con `--como Ana`, detrás de sala y día. `--como` es declarativo: no autentica y suplantar a otro queda fuera. `reservar` y `cancelar` no lo miran. `--como` antes de sala y día no se admite (queda fuera); `--como` sin valor cuenta como falta.
5. Las reservas siguen sin guardar a nombre de quién están y no se les añade dueño: la regla solo mira al responsable de la sala. El responsable anula cualquier reserva de su sala, sea de quien sea; quien no lo es no anula ni la suya (`cancelar` no cambia, ni su regla de 24 h si la tiene).
6. Orden de validación de `anular`: primero `--como` (falta → «falta --como»), luego responsable de la sala (no hay → «Norte no tiene responsable»; no es quien → «solo Ana anula reservas de Norte»), y por último la reserva (no hay o ya está anulada → «sin reserva Norte mar», como hoy).
7. Reglas de `room-managers`: un responsable por sala (un texto); una persona puede serlo de varias salas; los nombres distinguen mayúsculas (`ana` no es `Ana`); las salas del fichero que no existen se ignoran. Si `data/managers.json` falta o no se puede leer, ninguna sala tiene responsable. Un JSON inválido, o un valor que no sea un texto no vacío, cuenta como sin responsable para esa sala. El fichero es UTF-8 y los espacios sobrantes cuentan. Los mensajes van en castellano. Los nombres de los ejemplos (Ana, Luis, Pedro) son inventados.
   `managerOf` lee `data/managers.json` desde la raíz del repo, no desde el directorio de ejecución, y acepta una ruta opcional para que los tests no pisen el fichero real. El fichero que se commitea es `{}`: tras desplegar, nadie anula hasta que el dev-lead escriba los responsables reales.
8. `cancelar` no cambia: sigue cancelando cualquiera. Si eso debe cambiar, es otra feature.
9. `sdd capability merge` sobre una copia: ok, requisitos añadidos a `room-managers` y `bookings`. La suite y el lint sobre el cambio: `sin medir` (aún no hay código).

### Hallazgos de la review

- **Aceptado** (Crítico, técnica) — escenarios de `room-managers` sin operación observable → atados a la función exportada `managerOf(room)` de `src/app.js`.
- **Aceptado** (Crítico, técnica) — un requisito con cuatro casos y «sigue activa» sin forma de verlo → un escenario por caso y la actividad se observa con `libres 10:00-12:00`.
- **Aceptado** (Crítico, dominio) — el rol solo se describía por lo que hace → escenario «Ana no anula Sur» y decisiones 5 y 8.
- **Rechazado** (Crítico, dominio) — resolver ya el solape con la 0009 → es una decisión del dev-lead sobre el roadmap, no mía: queda como la decisión 1, con recomendación y la regla de conflicto escrita.
- **Aceptado** — Sur con otro responsable (el nombre sale del fichero), orden de validación, `managers.json` ausente, contrato de `--como`, `--como` declarativo → decisiones 4, 6, 7 y escenarios.
- **Aceptado** (2.ª ronda) — cambio incompatible de `anular` sin declarar, `--como` sin valor, orden responsable/reserva, anular dos veces, JSON inválido, `ana`/`Ana`, ruta del fichero y contenido que se commitea, regla de 24 h → decisiones 3, 4, 5 y 7 y escenarios nuevos.
- **Rechazado** (2.ª ronda) — escenario de sala sin responsable y sin reserva → es el mismo orden que el de Pedro sin reserva; un caso basta.
- **Aceptado** — `owner` sin requisito que lo use → quitado del Scope y de los datos.
- **Aceptado** — escenario de Este sin sala existente → reescrito sobre Sur sin entrada en el fichero.
- **Aceptado** — Intent más estrecho que el delta → Intent corregido; título «Cada sala tiene un responsable» → «El responsable de una sala sale de `managers.json`».
- **Rechazado** — nombres de capacidad en castellano → el slug es un nombre de fichero y el kit lo pide en inglés (decisión 2).
- **Aceptado** — decisiones 9 y 10 antiguas eran notas de proceso → reducidas a la línea de política de modelos y la decisión 9.

## Intent

Hoy cualquiera anula cualquier reserva (`voidBooking` no comprueba a nadie). Solo el responsable de cada sala debe poder anular reservas de esa sala, sean de quien sean. Fracaso aunque técnicamente funcione: que alguien que no es responsable según `data/managers.json` anule algo, o que `anular` sin `--como` anule. Que alguien diga `--como Ana` sin ser Ana no se impide: la herramienta no tiene sesión.

## Scope

- Entra: `anular Norte lun --como Ana`; `data/managers.json`; `managerOf(room)` en `src/app.js`; `docs/config.md` (la línea «Responsables de sala: aún no hay…» pasa a decir dónde está el fichero); tests en `test/`.
- Código que lo aplica: `src/app.js` (`voidBooking` y el despacho de `anular` en `run`). Los tests existentes (`app.test.js`, `cancel.test.js`) no tocan `anular` y quedan igual.
- No entra: `cancelar`, que sigue igual; dueño de las reservas; autenticar a quien ejecuta; gestionar responsables desde comandos.

## Approach

A: `anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala (elegida: es lo mínimo y ya está previsto en `docs/config.md`). B: usuario actual por variable de entorno (se pierde en los tests de `run`). C: lista de responsables escrita en `app.js` (no la puede cambiar quien despliega sin tocar código). Elijo A.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — El responsable de una sala sale de `managers.json`**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `managerOf('Norte')`
- THEN es `Ana`
- AND `managerOf('Sur')` es `Luis`

**ADDED — Una sala sin responsable no tiene responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana"}`
- WHEN `managerOf('Sur')`
- THEN no hay responsable

**ADDED — Un fichero ilegible no da responsables**
- GIVEN `data/managers.json` con un JSON inválido
- WHEN `managerOf('Norte')`
- THEN no hay responsable

**ADDED — Sin fichero no hay responsables**
- GIVEN que `data/managers.json` no existe
- WHEN `managerOf('Norte')`
- THEN no hay responsable

### Capacidad: `bookings`

Contexto: la reserva de Norte del lunes es de `10:00-12:00`; mientras está activa, Norte no sale en `libres 10:00-12:00`.

**ADDED — El responsable anula una reserva de su sala**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes activa
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun»
- AND `libres 10:00-12:00` ya incluye Norte

**ADDED — Ser responsable de otra sala no basta**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes activa
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte»
- AND Norte sigue sin salir en `libres 10:00-12:00`

**ADDED — Quien no es responsable de nada no anula**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes activa
- WHEN `anular Norte lun --como Pedro`
- THEN responde «solo Ana anula reservas de Norte»
- AND la reserva sigue activa

**ADDED — El nombre del responsable sale del fichero**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y una reserva de Sur del martes activa
- WHEN `anular Sur mar --como Ana`
- THEN responde «solo Luis anula reservas de Sur» y la reserva sigue activa

**ADDED — Hay que decir quién anula**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes activa
- WHEN `anular Norte lun`
- THEN responde «falta --como» y la reserva sigue activa
- AND `anular Norte lun --como` responde lo mismo

**ADDED — Sin responsable no se anula**
- GIVEN que `data/managers.json` no existe y la reserva de Norte del lunes activa
- WHEN `anular Norte lun --como Ana`
- THEN responde «Norte no tiene responsable» y la reserva sigue activa

**ADDED — Quien no es responsable no averigua si hay reserva**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y ninguna reserva de Norte el martes
- WHEN `anular Norte mar --como Pedro`
- THEN responde «solo Ana anula reservas de Norte»

**ADDED — Los nombres distinguen mayúsculas**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes activa
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — Una reserva anulada no se anula otra vez**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes ya anulada por Ana
- WHEN `anular Norte lun --como Ana`
- THEN responde «sin reserva Norte lun»

**ADDED — Sin reserva se dice**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y ninguna reserva de Norte el martes
- WHEN `anular Norte mar --como Ana`
- THEN responde «sin reserva Norte mar»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
