---
id: 20261111-192152-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en el aviso de sala
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en el aviso de sala

🦆 La plantilla del aviso de sala tendrá una línea más: «Conserjería: 5500». Por ejemplo, un aviso de la sala Norte el lunes empezará por «Aviso de sala: Norte el lunes.» y acabará con ese teléfono. Solo cambia el contenido de ese fichero de texto; hoy ninguna parte de la herramienta lo envía, y ninguna sala ni reserva se toca. La plantilla sigue dentro del tope de 60 palabras que ya vigila un test.

Validación: agente — es un documento de texto y un test comprueba el literal exacto; un humano no vería nada que el test no haya medido (el dev-lead puede vetarlo en el gate: ✋ 5).

## Capacidades

- Ninguna, porque docs: `docs/plantillas/aviso.md` es una plantilla de texto y el proyecto no tiene `capabilities/`; no se escribe delta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de las contadas (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad) · tamaño: ~1 línea de plantilla + un test de ~10 líneas, en 2 ficheros
- Único (sonnet, siete puntos): que el literal «Conserjería: 5500» sea idéntico en la 🦆, Intent, Scope, decisión 2 y criterio de aceptación, y que el recuento de palabras (52 → 54 de 60) coincida con lo que da el test (señal: tamaño pequeño, tope de palabras)
- Mínimo razonable: sin review — deja sin mirar una contradicción entre el literal de la spec y el del test, el tipo de hueco que solo se ve cuando el test sale rojo

1. **Dónde va la línea**: nueva línea al final del fichero, tras «Aviso de sala: {sala} el {dia}.», sin lista, sin línea en blanco entre ambas — el dev-lead dijo «añade una línea» sin decir el sitio.
2. **Literal exacto**: `Conserjería: 5500`, con tilde, sin punto final y sin marcador `{…}` (el teléfono es fijo, no una variable) — el dev-lead dio «Conserjería: 5500»; lo del punto y el marcador es mío.
3. **Solo `aviso.md`**: `docs/plantillas/recibo.md` no recibe el teléfono — la petición nombra solo el aviso.
4. **Sin delta y sin capacidad**: el cambio no toca comportamiento de producto y no existe `capabilities/`; ningún código lee `docs/plantillas/` (`git grep` no lo encuentra en `src/`), así que el efecto es solo el contenido del fichero.
5. **Validación `agente`** (ver arriba): lo propongo yo; si prefieres ver el fichero tú, cámbialo a `dev-lead` en el gate.
6. **Enfoque**: A (editar la plantilla y fijar su contenido con un test nuevo `test/aviso.test.js`), frente a B (solo editar, sin test) y C (poner el teléfono en una variable de configuración); ver Approach.
7. **Contenido exacto y saltos de línea**: el fichero queda en `Aviso de sala: {sala} el {dia}.⏎Conserjería: 5500⏎` (⏎ = salto de línea LF): hoy ya termina en salto de línea (medido), así que la línea 1 no cambia; el test normaliza CRLF a LF antes de comparar, porque `core.autocrlf` está activo en Windows.
8. **Fila de roadmap**: 0014 no tiene fila; no la creo, porque la 0014 ya está reservada por la rama y `sdd-roadmap` es quien planifica. La 0008 («Avisos por correo antes de la reserva») es otra tarea: no se toca.
9. **Tope de palabras**: sin cambio (60). Medido 52, previsto +2, total 54, margen 6; recuento con el método de `words.test.js` (separar por espacios), medido 54 sobre una copia con el cambio.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta en copia: no aplica (sin delta, ver 4).

### Hallazgos de la review

- **Aceptado** — criterio «dos líneas no vacías» dejaba pasar una línea en blanco → el criterio y el test fijan el contenido exacto, sin huecos (decisión 7).
- **Aceptado** — «que el teléfono llegue a `recibo.md`» no tenía prueba → `test/aviso.test.js` comprueba también que `recibo.md` no contiene `Conserjería` ni `5500`.
- **Aceptado** — la 🦆 prometía más que el alcance (nada envía la plantilla) → reformulada: cambia el contenido del fichero.
- **Aceptado** — salto de línea final y LF/CRLF sin decidir → decisión 7, medido: hoy LF y con salto final; el test normaliza.
- **Aceptado** — cabecera de la review citaba secciones sin el literal → corregida; tamaño corregido (~1 línea + test de ~10).
- **Aceptado** — método de recuento → decisión 9.
- **Aceptado** — `git grep` con patrón estrecho → ampliado a `aviso|plantilla|conserje|5500|0014` fuera de `.docs/sdd/specs`; resultado en la tabla de abajo.
- **Rechazado** — roles dev-lead/autor frente a PRODUCT.md (un solo usuario) → el dev-lead es esa misma persona; la validación `agente` se mantiene y se le deja vetarla (✋ 5).
- **Rechazado** — citar el término «Sala» en Capacidades → la reviewer misma lo da por sólido; sin cambio.

### Decisiones tomadas con el dev-lead

- Añadir a `docs/plantillas/aviso.md` una línea con el teléfono de conserjería — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»
- Entrevista ya hecha — «La entrevista ya está hecha; decidido con el dev-lead»

## Intent

Hoy el aviso de sala dice solo «Aviso de sala: {sala} el {dia}.» y quien lo recibe no sabe a quién llamar si algo falla. Se añade el teléfono de conserjería, «Conserjería: 5500», como segunda línea. Éxito: el fichero tiene exactamente esas dos líneas, en ese orden y el conjunto de `docs/plantillas/` sigue en 60 palabras o menos. Fracaso aunque «funcione»: que el teléfono llegue también a `recibo.md` (lo vigila el test nuevo), o que el test de tope de palabras salga rojo.

## Scope

- Entra: añadir la línea `Conserjería: 5500` a `docs/plantillas/aviso.md`; un test nuevo que fija el contenido de esa plantilla.
- No entra: `docs/plantillas/recibo.md`; cambiar el tope de 60 palabras; leer la plantilla desde código; guardar el teléfono en configuración; el aviso por correo (fila 0008).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma de `docs/plantillas/aviso.md`: pasa de 1 a 2 líneas (la existente no cambia) | `docs/plantillas/aviso.md:1`; `git grep -niE "aviso\|plantilla\|conserje\|5500\|0014"` fuera de `.docs/sdd/specs/`: `ROADMAP.md:9` (fila 0008, otra tarea) y `test/words.test.js:5-6` (lee la carpeta); ningún README, CHANGELOG ni código más | Scope: se añade la línea; `words.test.js` sigue verde, medido 54 ≤ 60 sobre una copia con el cambio |

- Filas que implementa: nada: comprobado con el mismo `git grep` (ningún hit de `0014`).

## Approach

- A — editar la plantilla y añadir `test/aviso.test.js`, que lee el fichero y compara su contenido: cuesta un test de unas 8 líneas, con el patrón de `words.test.js` (lectura directa de `docs/plantillas/`).
- B — solo editar la plantilla: sin coste, pero nada fija el teléfono y un cambio futuro lo borraría sin que ningún test avise (la constitución pide tests antes que código).
- C — teléfono como variable de configuración: ningún código lee las plantillas y el proyecto no tiene configuración; sería construir infraestructura para un número fijo.
- Elegido: A — la constitución (art. 2) pide el test antes que el cambio, y es el más barato que lo cumple.

Criterio de aceptación (lo que prueba el test): tras normalizar CRLF a LF, `docs/plantillas/aviso.md` es exactamente `Aviso de sala: {sala} el {dia}.⏎Conserjería: 5500⏎` (sin líneas en blanco), y `docs/plantillas/recibo.md` no contiene `Conserjería` ni `5500`.

## Dónde se prueba

- Contenido de `aviso.md` y ausencia del teléfono en `recibo.md`: lectura directa de los ficheros, como `test/words.test.js`; fichero nuevo `test/aviso.test.js`.
- Tope de palabras: el `test/words.test.js` existente, sin tocarlo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` 6 + `recibo.md` 46; test `words.test.js`) | 52 / 60 | 8 | previsto +2 (`Conserjería:`, `5500`) → 54, margen 6; sin cambio (60) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
