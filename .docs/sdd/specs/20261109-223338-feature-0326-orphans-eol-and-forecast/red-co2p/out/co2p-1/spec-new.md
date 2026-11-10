---
id: 20261110-131334-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería al final del aviso de sala
mode: full
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería al final del aviso de sala

🦆 Hoy el aviso de sala dice solo «Aviso de sala: {sala} el {dia}.». Con este cambio termina con un párrafo de conserjería: extensión 5500 de lunes a viernes de 8:00 a 20:00, seguridad en la 5599 fuera de ese horario, y qué dejar recogido antes de salir (sillas, pizarra, proyector, ventanas). Las plantillas tienen un tope de 60 palabras en total y ya usan 52; con el párrafo serían 94, así que el test de palabras fallaría. Por eso la spec propone subir el tope a 114 y no tocar el recibo.

Validación: agente — es un documento de texto: el test compara el fichero con el literal de esta spec y mide el tope; una persona no observaría nada más. El literal de la spec es la única fuente: el dev-lead lo valida leyéndolo en el gate, porque el gate no puede compararlo con el chat.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad, sin contrato público, sin `MODIFIED`, sin datos ni dependencias) · tamaño: ~45 líneas en 3 ficheros · revisó 1 revisor (sonnet)
- Dominio (sonnet): si el párrafo de la spec coincide palabra por palabra con el que dictó el dev-lead y si el tope nuevo (114) deja de ser una decisión escondida (señal: tope de palabras)
- Técnica (sonnet): si 94 palabras salen del conteo exacto del test (`split(/\s+/)`) y si el nuevo test no choca con `test/words.test.js` (señal: tope de palabras)
- Mínimo razonable: ninguna review — deja sin mirar que el conteo de 94 y el tope 114 coincidan con lo que mide el test

1. **El tope de palabras sube de 60 a 114** (en `test/words.test.js`, título y comparación). Con el párrafo, `docs/plantillas/` pasa de 52 a 94 palabras y el gate falla con el tope actual. Es la decisión que más importa de esta spec: el dev-lead fijó el texto literal, así que no lo acorto; propongo subir el tope en vez de recortar el recibo. Alternativas reales: 94 exactos (sin holgura: cualquier palabra futura vuelve a romper el gate) o acortar el párrafo o el recibo (ninguna la tomo sin ti). Propongo 114 porque la plantilla de spec del kit pide medido + previsto + 20 de margen; si prefieres 94, dímelo en el gate.
2. Enfoque: texto añadido al final del fichero + test nuevo que lo fija, frente a solo editar el fichero o a solo subir el tope (ver Approach).
3. El párrafo va como **párrafo aparte**: una línea en blanco tras la frase actual, el literal en una sola línea y un único salto de línea final. El fichero sigue con finales `LF` (hoy lo está) y sin tabuladores.
4. Los guiones y signos del literal se copian tal cual, sin las comillas «» del mensaje del dev-lead (son de cita, no del texto).
5. `recibo.md` no se toca.
6. Un solo task de implementación (ver Approach), con el tope como constante `TOPE` en `test/words.test.js` —hoy el 60 está escrito dos veces— y un mensaje de fallo con el total medido.
7. El test nuevo vive en `test/aviso.test.js`, un fichero propio, en vez de ampliar `test/words.test.js`.
8. La fila 1 del roadmap («Avisos por correo antes de la reserva») no es esta feature y no se toca: este cambio solo añade texto a la plantilla. La feature 0014 no tiene fila en el roadmap; no la añado.

### Hallazgos de la review

- **Aceptado** — las dos tasks no se sostienen en TDD (subir el tope no tiene RED propio) → ahora es un solo task: RED en `test/aviso.test.js`; en su GREEN se añade el párrafo y se sube el tope juntos.
- **Aceptado** — el margen de 20 no tenía origen citado → decisión 1 cita la plantilla de spec y presenta 94 como alternativa real.
- **Aceptado** — «sin tabuladores» sin prueba → el test compara el contenido completo, lo que cubre `LF`, línea en blanco, salto final y ausencia de tabuladores (Dónde se prueba).
- **Aceptado** — el 60 escrito dos veces y un fallo sin diagnóstico → constante `TOPE` y mensaje con el total (decisión 6, Scope).
- **Aceptado** — el `LF` final de la línea 1 se mueve al final del párrafo → Scope lo dice: la línea 1 conserva su contenido.
- **Aceptado** — la comparación con lo que dijo el dev-lead no la detecta el gate → la spec es la única fuente del literal; el dev-lead lo valida leyéndolo aquí en el gate (Validación).
- **Rechazado** — sacar el bloque de la review de ✋ → la plantilla del kit lo exige al abrir ese apartado; el «mínimo razonable» sigue siendo válido: sin review no se miraría el conteo.
- **Rechazado** — confirmar que `scripts/lint.mjs` es el gate → `operations.md` fija el gate de cierre como `node --test && node scripts/lint.mjs`; la constitución es más general.
- **Rechazado** — el Intent contradice la misión → el aviso lo lee quien reserva la sala (PRODUCT.md: «equipos de una oficina»); la misión habla de quién desarrolla la herramienta.
- **Rechazado** — comprobar que `test/aviso.test.js` entra en el glob → `node --test` recoge `*.test.js` de `test/` (los 5 tests actuales vienen de ahí); se confirma en el RED.

### Decisiones tomadas con el dev-lead

- Texto del párrafo y fichero donde va (al final de `docs/plantillas/aviso.md`) — «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»
- Carril feature — «Invoca la skill sdd-kit:sdd-propose y sigue: paso 4, carril feature»

## Intent

Hoy el aviso de sala solo dice qué sala y qué día. Quien la usa no sabe a quién llamar ni qué dejar recogido para quien reserve después. Se quiere que el aviso termine con las extensiones de conserjería y seguridad, el horario de conserjería y la lista de lo que hay que dejar en orden.

Éxito: `docs/plantillas/aviso.md` termina con el párrafo literal del dev-lead; la primera línea (`Aviso de sala: {sala} el {dia}.`) queda intacta; `node --test && node scripts/lint.mjs` en verde. Fracaso aunque «funcione»: que el párrafo salga cambiado (una hora, una extensión) o que el gate quede en rojo por el tope.

## Scope

- Entra: añadir el párrafo al final de `docs/plantillas/aviso.md`: la línea 1 conserva su contenido y el salto de línea final pasa a ser el del párrafo.
- Entra: subir el tope de palabras de `test/words.test.js` de 60 a 114 (decisión 1), como constante `TOPE` y con mensaje del total medido.
- Entra: `test/aviso.test.js`, que fija el párrafo y el resto del fichero.
- No entra: `docs/plantillas/recibo.md`, `src/app.js`, la fila 1 del roadmap (avisos por correo), el envío del aviso.
- No entra: cambiar las extensiones, el horario o la redacción del párrafo.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas/` | `test/words.test.js:5` (título) y `test/words.test.js:8` (`<= 60`) | Scope, decisión 1: pasa a 114 |
| Cierre actual de `aviso.md` (termina en `{dia}.`) | `docs/plantillas/aviso.md:1` | Scope: el párrafo se añade detrás; la línea 1 no cambia |

- Filas que implementa: nada: comprobado con `git grep -n -i "aviso\|plantillas\|60" -- . ':!.docs/sdd/specs'` (solo `test/words.test.js` y la fila 1 del roadmap, que habla de correos y no se salda aquí)

## Approach

- A. Añadir el párrafo + subir el tope + test que fija el texto — coste: dos ficheros de test tocados/creados; el aviso queda protegido contra cambios accidentales del texto.
- B. Añadir el párrafo + subir el tope, sin test nuevo — coste mínimo, pero nada fija la extensión 5500/5599 ni el horario: una edición posterior los cambia sin que el gate avise.
- C. Añadir el párrafo y recortar el recibo para que quepa en 60 — descartada: obliga a tocar un documento que nadie pidió tocar.
- Elegido: A — el texto lleva números que no deben cambiar sin querer (extensiones, horario), y el RED del test es lo que demuestra que el cambio está hecho.

Partes del cómo:

- El párrafo se añade tras una línea en blanco; el fichero queda en dos párrafos separados.
- Recuento previsto con el conteo del test (`split(/\s+/)` sin vacíos): `aviso.md` 6 → 48 (el párrafo son 42), `recibo.md` 46; total 94.
- Una task prevista: RED en `test/aviso.test.js` (falla: el párrafo no está); GREEN añade el párrafo **y** sube el tope en el mismo paso (con solo el párrafo, `test/words.test.js` queda en rojo porque 94 > 60; subir el tope no tiene RED propio, y se declara así). Sin partir: una task, una superficie.

## Dónde se prueba

- El párrafo está al final y la primera línea sigue intacta: `test/aviso.test.js`, leyendo el fichero con `readFileSync` como `test/words.test.js`; compara el contenido completo con el literal esperado.
- El fichero sigue con `LF`, sin tabuladores, con la línea en blanco y un solo salto final: mismo test, que compara el contenido completo con el literal esperado.
- El tope: `test/words.test.js` existente, con `TOPE = 114`; no tiene RED propio: es el efecto que el párrafo provoca en él, y por eso el cambio va en el mismo GREEN.
- Gate: `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: ningún cambio de comportamiento observable de `capabilities/` (el proyecto no tiene ninguna); es un documento.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` + `recibo.md`, `test/words.test.js`) | 52 / 60 | 8 | 114 (52 medidas + 42 previstas + 20 de margen) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
