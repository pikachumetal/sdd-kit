---
id: 20261110-131942-feature-0014-notice-room
feature: 0014
title: El aviso de sala termina con el párrafo de conserjería
mode: full
profile: delegate
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de sala termina con el párrafo de conserjería

🦆 Quien recibe el aviso de una sala (`Aviso de sala: Norte el lun.`) verá debajo, tras una línea en blanco, cómo localizar a conserjería (extensión 5500, de lunes a viernes de 8:00 a 20:00), a quién llamar fuera de horario (seguridad, extensión 5599) y qué dejar recogido al salir (sillas, pizarra, proyector, ventanas). Técnicamente es añadir un párrafo a `docs/plantillas/aviso.md`. Hay un choque que tienes que decidir: con ese párrafo, `docs/plantillas/` pasa de 52 a 94 palabras y el test `test/words.test.js` lo limita a 60, así que el gate de cierre fallaría; propongo subir ese tope a 114 (decisión 2).

Validación: agente — el resultado es el texto de un documento y un test lo mide entero; ninguna persona vería nada que el test no haya comprobado ya.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de la rúbrica (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad) · tamaño: ~8 líneas en 3 ficheros
- Único (sonnet): si el tope de 114 de la decisión 2 sale bien de la tabla «Topes de palabras» (52 medidas + 42 del párrafo + 20), si el test nuevo de la decisión 3 fija el párrafo literal sin volverse frágil, y si «Dónde se prueba» cubre cada cosa que el Scope dice que entra (señal: el único riesgo es el choque con el tope)
- Mínimo razonable: sin review — deja sin mirar si el tope propuesto o el test nuevo contradicen algo que el gate de cierre exige

1. **Enfoque**: A, frente a B y C (ver Approach).
2. **Tope de palabras de `docs/plantillas/`: de 60 a 114** en `test/words.test.js`, y el título del test deja de decir 60 (`docs/plantillas cabe en su tope de 114 palabras`). Sin esto el gate (`node --test`) falla con 94 palabras. 114 = 52 medidas + 42 del párrafo + 20 de margen (tabla «Topes de palabras»). El tope es una regla tuya: lo apruebas aquí o dime otro.
3. **Test nuevo `test/aviso.test.js`** que fija el contenido: `aviso.md` es exactamente la línea actual, una línea en blanco y el párrafo, con salto final. Es la prueba RED de la feature (el test de tope solo detecta tamaño, no contenido).
4. **Forma del añadido**: una línea en blanco entre `Aviso de sala: {sala} el {dia}.` y el párrafo; el párrafo en una sola línea (sin cortes), tal cual la frase del dev-lead, con sus tildes («Conserjería», «extensión»); la primera línea y sus marcadores `{sala}` y `{dia}` no cambian; fichero en UTF-8 sin BOM, finales de línea LF, con un salto de línea al final.
5. **`recibo.md` no se toca**, aunque son sus 46 palabras las que más pesan en el tope.
6. **Sin capacidades**: el proyecto no tiene `capabilities/` y esto es un texto de plantilla; no hay delta de comportamiento.
7. **Validación: agente** (ver arriba). Si prefieres verlo tú, dilo y pasa a `dev-lead`.
8. **No se divide**: dos tasks previstas — Task 1: subir el tope en `words.test.js`; Task 2: `test/aviso.test.js` en rojo primero y después el párrafo en `aviso.md` —, misma superficie. Carpeta con el id 0014 que ya reservaba la rama `feature/0014-notice-room`; no hay fila en el roadmap para 0014 y no la he añadido.
### Hallazgos de la review

1. **Aceptado** — el gate de la constitución es `node --test` y `lint.mjs` no se mencionaba → «Dónde se prueba» dice que `lint.mjs` solo mira tabuladores en `src/app.js` y no lee `docs/plantillas/`; el gate de `operations.md` incluye ambos.
2. **Aceptado** — quién consume `aviso.md` → Scope: ningún fichero del repo lo lee (`git grep`); la fila 1 del roadmap, de correo, es futura y no entra.
3. **Aceptado** — falta un escenario → «Dónde se prueba» lo trae en GIVEN/WHEN/THEN y el test nuevo lo implementa.
4. **Rechazado** — de dónde sale el margen de 20 → es la regla de la plantilla de spec del kit (2 %, mínimo 20 palabras); el valor está en la decisión 2 para que lo apruebes o lo cambies.
5. **Rechazado** — fragilidad del test → la duplicación es deliberada: el texto lo fijó el dev-lead literal y un retoque debe obligar a tocar el test.
6. **Rechazado** — figura del dev-lead → es el rol del kit; aquí lo ejerce quien desarrolla el proyecto, y no cambia nada de la spec.
7. **Aceptado** — reparto en tasks y orden RED → decisión 8.
8. **Aceptado** — fila de roadmap → la decisión 8 ya dice que no la hay; queda sin fila de forma deliberada salvo que pidas añadirla.
9. **Rechazado** — datos reales → las extensiones y el horario son los del dev-lead y no identifican a nadie; no se inventan otros.

- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Carril y modo: feature — «paso 4, carril feature».
- El cambio y su texto — «docs/plantillas/aviso.md añade al final este párrafo: «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»»

## Intent

Hoy `docs/plantillas/aviso.md` solo dice `Aviso de sala: {sala} el {dia}.` y quien recibe el aviso no sabe a quién acudir ni qué dejar recogido. El dev-lead quiere que el aviso termine con el párrafo de conserjería. Éxito: `aviso.md` acaba con ese párrafo, literal, y `node --test && node scripts/lint.mjs` sigue en verde. Fracaso aunque parezca funcionar: dejar el gate en rojo por el tope de palabras, o quitar `{sala}` o `{dia}` de la primera línea.

## Scope

- Entra: añadir el párrafo al final de `docs/plantillas/aviso.md` (decisión 4).
- Entra: subir el tope de `docs/plantillas/` a 114 palabras y renombrar el test en `test/words.test.js` (decisión 2).
- Entra: `test/aviso.test.js` (decisión 3).
- Contexto: ningún fichero del repo lee `aviso.md` (comprobado con `git grep`), así que nada que lo renderice se rompe por pasar de una línea a dos párrafos.
- No entra: tocar `recibo.md`, cambiar el texto del párrafo, o decidir quién rellena `{sala}` y `{dia}`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas/` y su título | `test/words.test.js:5` (título) y `:7` (`words.length <= 60`) | Scope y decisión 2: pasa a 114 |
| Texto del aviso: la última línea deja de ser `Aviso de sala: {sala} el {dia}.` | `docs/plantillas/aviso.md:1`; ningún otro fichero lo nombra | Scope y decisión 4 |

- Filas que implementa: 0014 → ninguna otra fila ni fichero la nombra | comprobado con `git grep -n 0014` (solo la rama), y `git grep -n -i "aviso\|plantillas\|60 palabras"` (solo `aviso.md`, `words.test.js` y la fila 1 del roadmap, «Avisos por correo», que es otra cosa y no se toca).

## Approach

- A. Añadir el párrafo a `aviso.md` y subir el tope en `words.test.js` — el tope es un número de un test; coste: un ajuste de una regla que hoy está en 60 y que el dev-lead debe aprobar.
- B. Añadir el párrafo y recortar `recibo.md` (46 palabras) hasta caber en 60 — habría que quitar 34 palabras de un documento que nadie ha pedido tocar, y el recorte alteraría su texto.
- C. Guardar el párrafo en un fichero fuera de `docs/plantillas/` y enlazarlo — el tope no cambia, pero `aviso.md` no terminaría con el párrafo, que es lo que el dev-lead decidió.
- Elegido: A — es la única que cumple lo decidido sin tocar otro documento; el coste es solo aprobar el nuevo tope en este gate.

Partes del cómo: el párrafo entra tal cual (decisión 4); el tope nuevo es el de la tabla «Topes de palabras»; el test nuevo compara el contenido entero del fichero con el esperado.

## Dónde se prueba

- El aviso termina con el párrafo y conserva su primera línea: `test/aviso.test.js`, leyendo el fichero como hace `test/words.test.js`.
  - GIVEN `aviso.md` con la primera línea `Aviso de sala: {sala} el {dia}.` · WHEN se lee · THEN es esa línea, una línea en blanco y `Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.`, en UTF-8 sin BOM, con LF y un salto de línea final.
- El tamaño de `docs/plantillas/`: `test/words.test.js` existente, con el tope nuevo.
- El gate: `node --test && node scripts/lint.mjs` entero (`lint.mjs` solo cuenta tabuladores en `src/app.js`: no lee las plantillas).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: no hay capacidades y el cambio es un texto de plantilla.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` y `recibo.md`, con el conteo de `test/words.test.js`) | 52 / 60 | 8 | 52 + 42 (`wc -w` del párrafo → 42) + 20 (2 % da menos que el mínimo) = **114** |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
