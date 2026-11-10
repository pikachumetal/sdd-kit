---
id: 20261110-104209-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en la plantilla del aviso
mode: full
profile: delegate
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en la plantilla del aviso

🦆 Hoy el aviso de sala dice solo «Aviso de sala: Norte el lun.». Con el cambio, debajo sale una segunda línea fija, «Conserjería: 5500», para que quien lo lea sepa a qué teléfono llamar. Es texto de una plantilla de `docs/plantillas/aviso.md`: no cambia código de producto ni comandos, solo la plantilla y un test que la fija. Ese directorio tiene un tope de 60 palabras en un test y el cambio lo deja en 54.

Validación: agente — es un documento: un test mide el tope y el contenido exacto del fichero se lee con `cat`; no hay nada que una persona observe y el agente no haya medido.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad) · tamaño: ~1 línea en 1 fichero. Dos revisores no se justifican; el mínimo razonable es este mismo.

1. Enfoque: A (añadir la línea al final de `aviso.md`), frente a B y C (ver Approach) — es el único que pidió el dev-lead.
2. La línea va **debajo** de «Aviso de sala: {sala} el {dia}.», no encima ni en la misma línea — «añade una línea» no dice dónde; al final no mueve lo que ya había.
3. Literal exacto `Conserjería: 5500` — con tilde, dos puntos y un espacio, **sin punto final**: es la forma de «Conserjería: 5500» tal como la dio el dev-lead; la primera línea sí lleva punto porque es una frase con huecos, y esta es un dato.
4. El fichero sigue terminando en un único salto de línea `\n` (LF), como hoy — para no ensuciar el diff.
5. `recibo.md` no se toca — el dev-lead nombró solo `aviso.md`.
6. Sin capacidad ni delta — `capabilities/` está vacío y la plantilla no define comportamiento del producto; la línea es texto de un documento. Va en «Capacidades» como «Ninguna, porque docs».
7. Validación `agente` — ver arriba; la spec no está aprobada por delegación, así que el atajo lo propongo yo y lo aprobáis vosotros.
8. Perfil `delegate`, del proyecto (`sdd-kit.json`); no hay `sdd-kit.local.json`.
9. Id `0014` — es el de la rama `feature/0014-notice-room`; no hay fila suya en el roadmap y `sdd id claim` lo dio por bueno: «sin remoto: la 0014 vale (contador local)». **No** se añade fila al roadmap: el cambio no pasó por `sdd-roadmap`.
10. Carril feature, modo full, y no patch — porque pediste la spec. Por el árbol de `patch-lane.md` es una petición cerrada con un único test y habría cabido como patch; no la bajo de carril por mi cuenta. Si prefieres patch, dilo y descarto esta carpeta.
- Política de modelos: un revisor de la spec (sonnet, effort medium) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno (1 task) · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

Un revisor (sonnet), 10 hallazgos, ningún Crítico → sin segunda ronda.

- **Aceptado** — Importante: el test solo fijaba la segunda línea → el test compara el contenido entero, normalizando `\r\n` (Dónde se prueba).
- **Aceptado** — Importante: sin escenario verificable → escenario GIVEN/WHEN/THEN con RED añadido (Dónde se prueba).
- **Aceptado** — Importante: LF con `core.autocrlf=true` → el test normaliza `\r\n`; el fichero se escribe en LF.
- **Aceptado** — Menor: «no cambia código» → reformulado en la 🦆.
- **Aceptado** — Menor: el `git grep` citado no encontraba lo que decía → corregido: no devuelve nada.
- **Aceptado** — Menor: lo del `claim` sin constancia → decisión 9 cita la salida literal: «sin remoto: la 0014 vale (contador local)».
- **Aceptado** — Menor: el carril sin resolver → el gate lo pregunta (ver la pregunta de aprobación).
- **Rechazado** — Importante: «el margen no está protegido» → el test de tope ya falla si el literal crece; no hace falta más.
- **Rechazado** — Menor: perfil «circular» → el perfil sale de `sdd-kit.json` (`control.profile: delegate`); no depende de la validación `agente`, que es otra decisión (7).
- **Rechazado** — Menor: marcar 5500 como ficticio → es el teléfono real que dio el dev-lead.

### Decisiones tomadas con el dev-lead

- Añadir a `docs/plantillas/aviso.md` una línea con el teléfono de conserjería, «Conserjería: 5500» — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»

## Intent

Hoy `docs/plantillas/aviso.md` es una sola línea (`Aviso de sala: {sala} el {dia}.`) y quien recibe un aviso no tiene el teléfono de conserjería a mano. Se quiere que la plantilla lo lleve siempre, en una línea fija. Éxito: `aviso.md` tiene exactamente dos líneas, la segunda `Conserjería: 5500`, y `node --test` sigue en verde. Fracaso aunque «funcione»: que `docs/plantillas` pase de 60 palabras (rompe el test de tope) o que otra plantilla cambie sin pedirlo.

## Scope

- Entra: la línea `Conserjería: 5500` al final de `docs/plantillas/aviso.md`.
- Entra: un test que fije el contenido de ese fichero (ver «Dónde se prueba»).
- No entra: `docs/plantillas/recibo.md`; código de `src/app.js` (no hay nada que renderice las plantillas); un teléfono configurable; el roadmap; cambiar el tope de 60 palabras.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Contenido de `aviso.md`: una línea → dos | `docs/plantillas/aviso.md:1` | Scope — se añade una línea, la primera no cambia |
| Palabras de `docs/plantillas`: 52 → 54 | `test/words.test.js:5-7` (tope 60) | decisión «Topes de palabras»: cabe sin tocar el tope |

- Filas que implementa: 0014 (id de la rama; sin fila de roadmap) → nada: comprobado con `git grep -nE "0014|Conserjería|5500|aviso" -- . ':!.docs/sdd/specs'`, que no devuelve ningún resultado (ningún fichero cita `aviso.md` ni el teléfono).

## Approach

- A: añadir una línea fija al final de `aviso.md` — cuesta 2 palabras de las 8 que quedan bajo el tope; un solo fichero.
- B: añadirla también a `recibo.md` — el dev-lead no lo pidió y suma 2 palabras más sin necesidad (56 de 60).
- C: sacar el pie común a un fichero compartido que las dos plantillas incluyan — nada incluye plantillas hoy (`git grep` no encuentra ningún lector), así que sería un mecanismo nuevo para una línea.
- Elegido: A — es lo que dijo el dev-lead («docs/plantillas/aviso.md añade una línea…»); B y C añaden alcance que nadie pidió.

Resultado esperado de `docs/plantillas/aviso.md`:

```text
Aviso de sala: {sala} el {dia}.
Conserjería: 5500
```

## Dónde se prueba

- Contenido de `aviso.md`: un test nuevo `test/aviso.test.js` con `node:test`, como `test/words.test.js`. Lee el fichero con `readFileSync`, cambia `\r\n` por `\n` (esta máquina tiene `core.autocrlf=true` y no hay `.gitattributes`) y exige que sea exactamente `'Aviso de sala: {sala} el {dia}.\nConserjería: 5500\n'`: así quedan fijados el número de líneas (dos), la primera intacta, la tilde, la ausencia de punto final y el único `\n` final.
- Escenario: GIVEN `aviso.md` hoy con una línea · WHEN se añade la línea · THEN `node --test test/aviso.test.js` pasa y `cat docs/plantillas/aviso.md` imprime el bloque de «Resultado esperado»; antes del cambio, ese test falla (RED).
- Tope de palabras: el test existente `test/words.test.js`, sin cambios; el margen depende del literal que fija el test nuevo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no hay capacidades y el cambio es texto de un documento.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (`aviso.md` 6 + `recibo.md` 46, contado como `test/words.test.js`) | 52 / 60 | 8 | sin cambio: 52 + 2 previstas = 54, bajo 60 |

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
