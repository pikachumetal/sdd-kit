---
id: 20261115-200107-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en el aviso de sala
mode: full
profile: delegate
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en el aviso de sala

🦆 La plantilla del aviso de sala hoy dice solo «Aviso de sala: {sala} el {dia}.». Con este cambio, debajo sale una segunda línea fija: «Conserjería: 5500». Así, quien recibe el aviso de «Norte el lun» ve a quién llamar si algo falla. Se cambia un solo fichero de texto (`docs/plantillas/aviso.md`) y se añade una prueba que fija las dos líneas.

Validación: agente — el cambio es un documento de texto y lo que se observa (dos líneas literales y el tope de palabras) lo miden los tests.

## Capacidades

- Ninguna, porque docs: `capabilities/` no existe y la plantilla es un documento, no un comportamiento del producto. No hay delta ni fusión.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de la tabla (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencias) · tamaño: ~15 líneas en 2 ficheros
- Único (sonnet): si el literal «Conserjería: 5500» de la Intent coincide con el del THEN y de la prueba, y si las 54 palabras previstas respetan el tope de 60 de `test/words.test.js` (señal: tamaño pequeño, sin MODIFIED ni contrato)
- Mínimo razonable: sin review — deja sin mirar un literal que difiera entre Intent, THEN y prueba

1. Enfoque: añadir la línea a la plantilla, frente a leer el teléfono de configuración o del código (ver Approach).
2. La línea nueva va **debajo** de la existente, como segunda línea del fichero; la primera queda intacta. El dev-lead dijo «añade una línea»; el sitio no lo fijó nadie.
3. El fichero sigue acabando en un único salto de línea `\n` (LF), como hoy; la prueba parte por `/\r?\n/` y descarta el vacío final.
4. Se añade una prueba nueva, `test/aviso.test.js`, que fija las dos líneas. El tope de palabras existente no fija el literal, y sin prueba propia nada impediría borrar la línea.
5. No se toca el tope de 60 palabras: pasa de 52 a 54 y cabe (ver «Topes de palabras»).
6. No hay fila de roadmap para la 0014 (`git grep 0014 -- ROADMAP.md` sin resultados): la feature no salda ninguna. Si el dev-lead quiere una fila, se añade al cerrar.
7. `Validación: agente`: nadie vería nada que los tests no midan ya (documento de texto).
8. Política de modelos: un revisor de spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

- **Aceptado** — el THEN decía «son 54» y nada lo fijaba → el THEN dice «no más de 60»; el 54 queda como previsión en «Topes de palabras».
- **Aceptado** — «exactamente dos líneas» no se comprobaba → el THEN exige que no haya más líneas no vacías y la prueba lo afirma.
- **Aceptado** — el salto de línea final no tenía escenario → decisión 3 y THEN: acaba en un único `\n`.
- **Aceptado** — separador de líneas sin fijar (CRLF) → la prueba parte por `/\r?\n/`.
- **Aceptado** — ruta relativa sin decir → «Dónde se prueba»: ruta relativa a la raíz, como `words.test.js`.
- **Aceptado** — el punto 8 de las decisiones repetía Capacidades → eliminado.
- **Rechazado** — mezcla de review y política de modelos con las decisiones → es la forma que fija el kit (plantilla y `review-spec.md`).
- **Rechazado** — rama desde `develop` → `develop` existe y es ancestro de la rama; nada que cambiar en la spec.
- Sin Crítico aceptado ni decisión central reescrita: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- `docs/plantillas/aviso.md` añade una línea con el teléfono de conserjería, «Conserjería: 5500» — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»
- Se escribe la spec aunque por el predicado cabría un patch — «Escribe la spec en su carpeta y preséntamela para aprobar»

## Intent

Hoy el aviso de sala (`Aviso de sala: {sala} el {dia}.`) no dice a quién acudir si algo falla. El dev-lead quiere que la plantilla lleve el teléfono de conserjería. Éxito: el fichero tiene exactamente dos líneas, la original y «Conserjería: 5500», y `node --test` sigue en verde. Anti-objetivo: que el cambio rompa el tope de 60 palabras de `docs/plantillas`, o que la línea original cambie sin querer.

## Scope

- Entra: añadir «Conserjería: 5500» como segunda línea de `docs/plantillas/aviso.md`; una prueba `test/aviso.test.js` que fija las dos líneas.
- No entra: `docs/plantillas/recibo.md`; ningún cambio en `src/app.js`, que no usa las plantillas; el tope de palabras; poner el teléfono en un ajuste o configuración.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. La línea «Aviso de sala: {sala} el {dia}.» no cambia de forma ni de sitio | `docs/plantillas/aviso.md:1` | Scope: queda intacta; la prueba la fija |

- Filas que implementa: nada: comprobado con `git grep -n 0014 -- ROADMAP.md PRODUCT.md docs src test` (sin resultados). Búsqueda de `aviso`, `plantillas`, `conserjer`, `5500` y `Aviso de sala` en el repo fuera de `.docs/`: solo `docs/plantillas/aviso.md:1` y `test/words.test.js`, que lee la carpeta entera por su tope de palabras.

## Approach

- A. Añadir la línea literal al fichero — cuesta una línea y una prueba; sin código nuevo.
- B. Leer el teléfono de un ajuste o de una constante en `src/app.js` y rellenar la plantilla — cuesta un mecanismo de plantillas que hoy no existe (ningún código lee `docs/plantillas`) para un solo valor.
- Elegido: A — el dev-lead fijó el literal y pidió «añade una línea»; B no tiene dónde engancharse.

La prueba nueva lee `docs/plantillas/aviso.md` (ruta relativa a la raíz, como `words.test.js`), lo parte por `/\r?\n/`, descarta el vacío final y comprueba las dos líneas y que no hay más.

## Dónde se prueba

- Las dos líneas del aviso, sin otras no vacías, y el `\n` final único: lectura del fichero con `node:test`, como `test/words.test.js`, en `test/aviso.test.js`.
- El tope de 60 palabras de la carpeta: la prueba existente `test/words.test.js`, sin cambios.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas` (aviso 6 + recibo 46, conteo de `test/words.test.js`) | 52 / 60 | 8 | sin cambio: medido 52 + previsto 2 («Conserjería:», «5500») = 54, bajo 60 |

## Escenarios (sin delta de capacidad)

La spec no tiene capacidades, así que sus escenarios no pasan a `capabilities/`; los fija la prueba:

- GIVEN el fichero `docs/plantillas/aviso.md` · WHEN se lee y se parte por líneas · THEN la primera línea es `Aviso de sala: {sala} el {dia}.`, la segunda es `Conserjería: 5500`, no hay más líneas no vacías y el contenido acaba en un único `\n`.
- GIVEN la carpeta `docs/plantillas` con el aviso ya cambiado · WHEN se cuentan las palabras de todos sus ficheros · THEN son no más de 60 (previstas 54).

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
