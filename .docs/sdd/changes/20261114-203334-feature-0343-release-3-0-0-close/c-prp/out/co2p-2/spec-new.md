---
id: 20261116-113558-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería y cierre de sala en el aviso
mode: full
profile: delegate
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería y cierre de sala en el aviso

🦆 Hoy el aviso de sala solo dice «Aviso de sala: {sala} el {dia}.». Con este cambio, al final de ese texto aparece un párrafo con el teléfono de conserjería (ext. 5500), el de seguridad fuera de horario (ext. 5599) y lo que hay que dejar hecho al salir; el texto exacto, literal, está en «Decisiones tomadas con el dev-lead». Para que quepa hay que subir el tope de palabras de `docs/plantillas/` en su test: hoy es 60 y con el párrafo la carpeta pasa de 52 a 94 palabras. Esa es la decisión que necesito que valides.

Validación: agente — es un documento de texto literal y un test; un humano no vería nada que el test no mida ya. (La validación del tope es tuya, ahora, al aprobar esta spec.)

## Capacidades

- Ninguna, porque docs.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet), con los siete puntos — señales: ninguna (sin contrato público, sin `MODIFIED`, sin capacidad) · tamaño: ~5 líneas en 3 ficheros
- Único (sonnet, los siete puntos): que el tope nuevo y su cuenta en «Topes de palabras» cuadren con lo que mide `test/words.test.js`, que «Lo que se retira o cambia de forma» recoja todo sitio que cite el 60, y que el test nuevo falle si cambia una cifra del párrafo (señal: tope de un test que la spec edita)
- Mínimo razonable: sin review — deja sin mirar la cuenta de palabras y el test nuevo, que es lo único con lógica

1. **Subir el tope de `test/words.test.js` de 60 a 114 palabras** (y el título del test, que dice «60 palabras») — el párrafo que decidiste suma 42 palabras y el directorio mide hoy 52 (`aviso.md` 6 + `recibo.md` 46): 94 > 60 y el test se pondría rojo. 114 = 52 + 42 + 20 de margen. Alternativas descartadas: recortar el párrafo (no es mío: lo fijaste tú, literal) y vaciar `recibo.md` (otra plantilla, fuera de lo pedido). **Si prefieres otro tope u otra salida, dímelo antes de aprobar.**
2. **El párrafo va tras una línea en blanco** que lo separa del texto actual, y el fichero acaba en salto de línea — el texto que diste es un párrafo y así queda separado del aviso existente; nadie dijo el formato.
3. **Un test nuevo, `test/aviso.test.js`**, que exige que el contenido de `aviso.md` sea exactamente la primera línea actual + línea en blanco + el párrafo literal + salto final (igualdad completa, no `includes`: cambiar 5599 por 5500 lo pone en rojo) — sin él nada prueba el cambio: el único test existente de plantillas solo cuenta palabras.
   - 3 bis. **Orden**: test rojo → párrafo → tope → verde (constitución, regla 2).
   - 3 ter. **El margen de 20 palabras del tope** sale de la regla del kit (medido + previsto + 2 %, mínimo 20) y es holgura para una pasada de fix; si prefieres 94 exacto, dilo.
4. **Enfoque: edición directa del fichero y del test** (ver Approach).
5. **Validación `agente`**, no `dev-lead` — documento de texto + test; si prefieres verlo tú, dilo.
- Política de modelos: revisor de la spec en sonnet (uno, con los siete puntos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — el formato (línea en blanco, salto final) no tenía escenario → el test nuevo exige el contenido exacto (decisión 3)
- **Aceptado** — el test podría pasar con `includes` → igualdad completa y caso de fallo comprobado (decisión 3, Dónde se prueba)
- **Aceptado** — el bloque de review era incoherente → reescrito
- **Aceptado** — margen de 20 sin decidir → decisión 3 ter y columna de margen corregida
- **Aceptado** — el `git grep` incluía `changes/` y no decía qué pasa con `CHANGELOG.md` y `ROADMAP.md` → corregido
- **Aceptado** — orden test primero → decisión 3 bis y Approach
- **Aceptado** — validación del tope vs `agente`, líneas 5 y 8 de `words.test.js` en el Scope, abreviatura del 🦆 → corregidos
- **Rechazado** — «el gate es solo `node --test`» → `operations.md` fija `node --test && node scripts/lint.mjs` como gate de cierre; la constitución no lo contradice

### Decisiones tomadas con el dev-lead

- Carril feature, modo full — «Invoca la skill sdd-kit:sdd-propose y sigue: paso 4, carril feature»
- Texto del párrafo, literal y al final de `docs/plantillas/aviso.md` — «docs/plantillas/aviso.md añade al final este párrafo: «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»»

## Intent

`aviso.md` es la plantilla del aviso de sala y hoy no dice a quién llamar ni qué dejar hecho al salir. El dev-lead decidió añadir al final un párrafo con la conserjería (ext. 5500, de lunes a viernes de 8:00 a 20:00), la seguridad fuera de horario (ext. 5599) y lo que se recoge al salir. Éxito: el fichero acaba con ese párrafo, literal, y el gate de cierre (`node --test && node scripts/lint.mjs`) sigue en verde. Fracaso aunque «funcione»: cambiar una cifra o una palabra del párrafo, dejar el test de palabras rojo, o «arreglarlo» recortando el texto.

## Scope

- Entra: añadir el párrafo literal al final de `docs/plantillas/aviso.md`.
- Entra: subir el tope de `test/words.test.js` a 114 palabras (decisión 1): línea 5 (título, «114 palabras») y línea 8 (`words.length <= 114`).
- Entra: `test/aviso.test.js` nuevo (decisión 3).
- No entra: tocar `recibo.md`, `src/app.js`, `CHANGELOG.md`, `ROADMAP.md` o la primera línea del aviso.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas` | `test/words.test.js:5` (título) y `:8` (`<= 60`) | Scope y decisión 1: pasa a 114 |

- Filas que implementa: nada: comprobado con `git grep -n "0014\|60 palabras\|plantillas" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'` (solo `test/words.test.js`; ni `README.md`, ni `src/`, ni `CHANGELOG.md`, ni `ROADMAP.md` —0014 no tiene fila— citan la plantilla o el tope).

## Approach

- Editar el fichero y el test directamente — es un texto literal y un número; no hay lógica aparte que probar.
- Generar el aviso desde `src/app.js` con el párrafo como constante — descartado: nadie usa la plantilla desde código y añadiría un acoplamiento que no se pidió.
- Excluir `recibo.md` del tope o moverlo — descartado: toca un fichero ajeno y cambia lo que significa el tope.
- Elegido: edición directa — mínimo cambio y lo que se pidió. Orden: `test/aviso.test.js` en rojo → párrafo en `aviso.md` → tope de `words.test.js` → verde con `node --test && node scripts/lint.mjs`.

## Dónde se prueba

- El aviso queda con su primera línea, una línea en blanco, el párrafo literal y salto final: `test/aviso.test.js` nuevo, igualdad exacta del contenido, mismo estilo que `test/words.test.js` (`node:test`, lee el fichero); con un caso de fallo comprobado al escribirlo: cambiar una cifra lo pone en rojo.
- El tope de palabras: `test/words.test.js`, ya existente, con el tope nuevo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio es de documentos y no toca comportamiento de `capabilities/`.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma, `test/words.test.js`) | 52 / 60 (`wc -w`: 6 + 46) | 8 hoy; 20 con el tope nuevo (114 − 94) | 114 (52 + 42 previstas, `wc -w` sobre el párrafo, + 20 de margen) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
