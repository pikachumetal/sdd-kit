---
id: 20261115-200408-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería en la plantilla del aviso
mode: full
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería en la plantilla del aviso

🦆 Hoy el aviso de sala dice solo «Aviso de sala: Norte el lunes.». Con este cambio, quien lo recibe lee debajo un párrafo nuevo: dónde está la conserjería (extensión 5500, de lunes a viernes de 8:00 a 20:00), a quién llamar fuera de ese horario (seguridad, extensión 5599) y qué dejar listo al salir (sillas, pizarra, proyector, ventanas). El texto es literal, el que fijó el dev-lead. Un test comprueba que el aviso termina con ese párrafo. Hay un choque que decidir: el conjunto de plantillas tiene un tope de 60 palabras y con el párrafo pasa a 94, así que hay que subir el tope.

Validación: agente — es un texto literal; un test lo compara carácter a carácter con lo decidido y el test no comprueba que las extensiones y los horarios sean los reales: eso lo decidió el dev-lead y su aprobación de esta spec lo cubre.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: ninguna (sin capacidad nueva, sin contrato público, sin MODIFIED, sin datos; área explorada: `docs/plantillas/` y `test/words.test.js` leídos) · tamaño: ~10 líneas en 3 ficheros
- Técnica+dominio (sonnet): si el tope propuesto (114) es coherente con la medición (94) y si algún THEN pasa sin el comportamiento (señal: el tope de palabras)
- Mínimo razonable: sin review — deja sin cubrir un literal mal copiado o un conteo de palabras erróneo

1. **Tope de palabras 60 → 114 (necesita tu decisión).** `test/words.test.js` limita `docs/plantillas/` a 60 palabras en total; hoy hay 52 (`aviso.md` 6, `recibo.md` 46) y el párrafo suma 42, es decir 94. Con el párrafo literal el gate de cierre (`node --test`) falla. Propongo subir el tope a 114 (medido 52 + previsto 42 + 20 de margen = 114). El margen de 20 es el mínimo que fija el kit; si prefieres un tope ajustado, la alternativa es 94 (sin margen: cualquier palabra más en las plantillas rompe el gate). Descartadas: acortar el párrafo (es literal del dev-lead) y recortar `recibo.md` (no se pidió tocarlo). Si el tope de 60 era una restricción buscada, dilo y cambio de enfoque.
2. Enfoque: añadir el párrafo con su test, frente a añadirlo sin test o moverlo a un fichero nuevo (ver Approach).
3. Colocación: tras una línea en blanco, como párrafo aparte, y la primera línea del aviso queda intacta — «añade al final este párrafo» no dice si va pegado o separado; elijo separado para que se lea como párrafo.
4. Ninguna capacidad: `capabilities/` está vacío y el aviso es una plantilla de documento sin reglas de producto; no declaro capacidad nueva.
5. Test nuevo en `test/aviso.test.js` (fichero propio) en vez de ampliar `test/words.test.js`: el tope de palabras y el contenido del aviso son dos comprobaciones distintas.
6. Validación `agente` (ver arriba): el texto es literal y lo mide un test.
7. Sin `§Frontend`: no cambia nada que se vea en una pantalla.
8. Contenido exacto del fichero: la primera línea, una línea en blanco, el párrafo en una sola línea y un salto de línea final — el test compara el fichero entero, para que no pase con basura al final.
9. El test también congela la primera línea del aviso, y el título del test de `words.test.js` pasa a decir 114.
10. `CHANGELOG.md` no se toca: lo escribe el corte de la release, no esta feature.
- Política de modelos: un revisor de la spec en sonnet · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Rechazado** — «el gate es solo `node --test` (art. 2)» → `operations.md` fija el gate de cierre como `node --test && node scripts/lint.mjs`; el lint no se ve afectado.
- **Aceptado** — contenido exacto del fichero no fijado → decisión 8, Scope y Approach.
- **Aceptado** — decisiones sin listar (primera línea, título del test) → decisión 9.
- **Aceptado** — margen de 20 sin justificar → decisión 1 explica que es el mínimo del kit y ofrece 94.
- **Rechazado** — «dev-lead no existe según PRODUCT.md» → es el rol de quien aprueba la spec en el kit (el propio autor); no cambia nada.
- **Aceptado** — validación demasiado categórica → matizada en la cabecera.
- **Aceptado** — `CHANGELOG.md` sin mencionar → decisión 10 y «No entra».
- **Rechazado** — sin escenario GIVEN/WHEN/THEN / PRODUCT.md → no hay capacidad que lo ancle; fuera del producto especificado, como dice la decisión 4.
- **Aceptado** — decisión 8 antigua era ruido → eliminada (renumeradas).
- **Aceptado** — orden RED→GREEN → línea «Orden» en «Dónde se prueba».

### Decisiones tomadas con el dev-lead

- El párrafo y su texto exacto: «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.» — «docs/plantillas/aviso.md añade al final este párrafo: …»

## Intent

El aviso de sala (`docs/plantillas/aviso.md`) dice hoy solo «Aviso de sala: {sala} el {dia}.». Quien reserva no sabe a quién acudir si algo falla ni qué dejar recogido para el siguiente. Éxito: el aviso termina con el párrafo de conserjería exacto que fijó el dev-lead, y `node --test && node scripts/lint.mjs` sigue en verde. Anti-objetivo: que el texto cambie una coma, o que el gate quede en rojo por el tope de palabras.

## Scope

- Entra: añadir el párrafo literal al final de `docs/plantillas/aviso.md`, tras una línea en blanco.
- Entra: subir el tope de `test/words.test.js` de 60 a 114 palabras (título del test incluido).
- Entra: `test/aviso.test.js`, que comprueba que el fichero entero es la primera línea, una línea en blanco, el párrafo en una sola línea y un salto de línea final.
- No entra: `CHANGELOG.md` (lo escribe el corte de la release).
- No entra: tocar `recibo.md`, la primera línea del aviso ni `src/app.js`; no hay código que lea la plantilla.
- No entra: traducir, reformular o abreviar el párrafo.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope «60 palabras» de `docs/plantillas` | `test/words.test.js:5` (título) y `:7` (`<= 60`) | Scope y decisión 1: pasa a 114 |

- Filas que implementa: nada: comprobado con `git grep -n "0014" -- . ':!.docs/sdd/changes'` (sin resultados) → el id 0014 no tiene fila en `ROADMAP.md`; no hay ficheros que la nombren.

## Approach

- A. Añadir el párrafo, un test de contenido y subir el tope de palabras — cuesta un fichero de test nuevo y tocar una restricción existente; deja el gate en verde y el texto protegido.
- B. Añadir el párrafo y subir el tope, sin test de contenido — más corto, pero nada impide que el texto cambie después sin que nadie lo note.
- C. Poner el párrafo en un fichero nuevo de `docs/plantillas/` — no cumple «añade al final» de `aviso.md` y cuenta igual para el tope.
- Elegido: A — el dev-lead fijó el texto literal; un test es la única forma de que un cambio posterior no lo altere en silencio (Constitution, art. 2: tests antes que código).

El test lee el fichero y lo compara entero con `Aviso de sala: {sala} el {dia}.` + línea en blanco + el párrafo literal + salto de línea final.

## Dónde se prueba

- Contenido del aviso: `test/aviso.test.js`, con `node:test` como `test/words.test.js`; lee el fichero real.
- Tope de palabras: `test/words.test.js`, el test existente con el tope nuevo.
- Orden: primero `test/aviso.test.js` (rojo), luego `aviso.md` (verde el de contenido, rojo el del tope: 94 > 60), y al final el tope nuevo (verde).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio no toca comportamiento observable de una capacidad (Capacidades: «Ninguna, porque docs»).

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,3 h
- Estimación de implementación: 0,3 h
- Base de la estimación: un párrafo, un test nuevo y un tope; sin incertidumbres; sin `estimation-log.md` de referencia
- Confianza: alta

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` y `recibo.md`, conteo de `test/words.test.js`) | 52 / 60 | 8 | 114 (52 + 42 previstas + 20 de margen; `node` sobre el texto literal → 94) |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
