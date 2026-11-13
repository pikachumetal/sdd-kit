---
id: 20261112-160341-feature-0014-aviso-conserjeria
feature: 0014
title: Teléfono de conserjería en la plantilla de aviso
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en la plantilla de aviso

🦆 El aviso de sala pasa a llevar una segunda línea con el teléfono de conserjería: quien recibe el aviso ve debajo de su línea la de «Conserjería: 5500». Solo se añade esa línea a la plantilla de aviso; el resto del texto no cambia. Cabe en el tope de 60 palabras de las plantillas: pasan de 52 a 54.

Validación: dev-lead — es un texto que lee una persona, y en duda valida el dev-lead.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de la rúbrica (sin capacidad nueva, contrato público, `MODIFIED`, datos ni dependencia; el texto de la plantilla es un documento) · tamaño: ~3 líneas en 2 ficheros (`docs/plantillas/aviso.md` y un test)
- Técnica y dominio (sonnet): si «Conserjería: 5500» cabe en el tope de 60 palabras de `test/words.test.js` (52 → 54) y si la plantilla `recibo.md` o algún otro texto del repo nombra ya la conserjería o el teléfono (Scope y «Lo que se retira o cambia de forma»)
- Mínimo razonable: sin review — deja sin mirar el orden de las líneas y el manejo de CRLF en el test

1. Carril: feature en modo full, no patch, aunque el cambio sea de una línea: pediste la spec en su carpeta para aprobarla — «Escribe la spec en su carpeta y preséntamela para aprobar».
2. La línea nueva va **debajo** de la existente, como línea 2, y la existente no cambia: «Aviso de sala: {sala} el {dia}.» queda tal cual.
3. El literal es exactamente «Conserjería: 5500», sin punto final (así lo dijiste); la línea de arriba sí lleva punto y no lo toco.
4. Se añade un test nuevo en `test/words.test.js` que comprueba que `docs/plantillas/aviso.md` contiene la línea; hoy ningún test mira el contenido de la plantilla, solo el tope.
5. Enfoque: editar la plantilla y fijarla con un test de contenido, frente a no probar el contenido (ver Approach).
6. Sin cambio del tope de 60 palabras: el test existente no se toca y queda con margen de 6.
7. Sin fila en `ROADMAP.md`: no había fila 0014 y el cambio se salda con esta feature; si la quieres apuntada, dilo.
8. `Validación: dev-lead`, no `agente`.
9. Delta sobre una copia de `.docs/sdd`: `sdd capability merge` → «Sin delta que fusionar» (rc 0), como corresponde a «Ninguna, porque docs».
- Política de modelos: un revisor de spec en sonnet (`sdd-kit:effort-medium`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Rechazado** — la cuenta 52 → 54 es un fallo → el propio revisor la verificó y no es defecto (6 + 46 + 2 = 54, margen 6).
- **Aceptado** — el test no fija que la línea nueva sea la 2 → el test comprueba la línea 2 exacta.
- **Aceptado** — CRLF y línea vacía final → el test parte con `split(/\r?\n/)` e ignora la línea vacía final.
- **Aceptado** — la promesa de «quien recibe ve» no tiene consumidor → Intent aclara que el cambio es solo del documento.
- **Aceptado** — confundir el punto del ejemplo → el 🦆 ya no cita la línea con punto.
- **Aceptado** — no se buscó «conserjería» ni «teléfono» → búsqueda hecha, sin hits, en «Lo que se retira o cambia de forma».
- **Rechazado** — `approvers` en TBD → se rellena al aprobar, como en toda spec en draft.

Sin Crítico aceptado ni decisión central reescrita: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- `docs/plantillas/aviso.md` añade una línea con el teléfono de conserjería, «Conserjería: 5500» — «decidido con el dev-lead: docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»

## Intent

El cambio es solo del documento: ninguna parte del código lee hoy las plantillas ni envía avisos. Hoy `docs/plantillas/aviso.md` tiene una sola línea, «Aviso de sala: {sala} el {dia}.», y quien recibe el aviso no sabe a quién llamar si hay un problema con la sala. Se quiere que el aviso lleve el teléfono de conserjería. Éxito: la plantilla tiene una segunda línea, «Conserjería: 5500», y `node --test` sigue en verde con el tope de 60 palabras. Fracaso, aunque funcione: tocar la línea existente o pasarse del tope.

## Scope

- Entra: `docs/plantillas/aviso.md` gana la línea «Conserjería: 5500»; un test de contenido en `test/words.test.js`.
- No entra: cambiar el texto de la línea existente, tocar `docs/plantillas/recibo.md`, tocar `src/app.js` (ninguna parte del código lee las plantillas) o cambiar el tope de 60 palabras.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La plantilla de aviso pasa de 1 a 2 líneas (la existente no cambia) | `docs/plantillas/aviso.md:1` (único hit de `git grep "Aviso de sala"`) | Scope |
| Otros sitios que nombran la conserjería o el teléfono | `git grep -inE "conserjer|5500|tel[eé]fono"` fuera de `changes/`: sin hits | Scope: no hay otro valor que sincronizar |
| Cuenta de palabras de `docs/plantillas`: 52 → 54 | `test/words.test.js:5-7` (tope 60, lee todos los ficheros del directorio) | Scope: sin cambio del tope; cabe con margen de 6 (medido con `wc -w`: aviso 6 + recibo 46) |

- Filas que implementa: nada: comprobado con `git grep -n "0014" -- ROADMAP.md` (sin hits; no hay fila)

## Approach

- Editar la plantilla y fijar la línea con un test de contenido en `test/words.test.js` — cuesta un test de unas 4 líneas junto al del tope, y es lo que cumple «Tests antes que código» de la constitution.
- Editar la plantilla sin test nuevo — cuesta nada, pero ningún test vigilaría la línea y la constitution pide el test antes que el código.
- Elegido: el primero — la constitution (art. 2) pide el test primero y el tope de palabras ya vive en ese fichero.

El test lee `docs/plantillas/aviso.md` y comprueba que sus líneas incluyen exactamente `Conserjería: 5500`, que la línea 1 sigue siendo `Aviso de sala: {sala} el {dia}.` y que la línea 2 es exactamente `Conserjería: 5500`. Parte el texto con `split(/\r?\n/)` para no depender de CRLF y ignora la línea vacía final.

## Dónde se prueba

- Línea de conserjería y línea existente intacta: `test/words.test.js`, con `readFileSync` como el test del tope actual.
- Tope de 60 palabras: el test existente, sin tocar.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio solo toca un documento (ver Capacidades).

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` y `recibo.md`, como cuenta `test/words.test.js`) | 52 / 60 (`wc -w` → 6 + 46) | 8 | 54 previstas (52 + 2) · sin cambio del tope de 60 (margen final 6) |

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
