---
id: 20261110-111509-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en la plantilla del aviso
mode: full
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en la plantilla del aviso

🦆 Hoy el aviso de sala dice solo «Aviso de sala: {sala} el {dia}.». Con este cambio, debajo de esa línea sale otra: «Conserjería: 5500», para que quien recibe el aviso sepa a qué teléfono llamar. Por dentro es una línea más en `docs/plantillas/aviso.md`, con un test que la comprueba; ningún código lee la plantilla todavía.

Validación: agente — es un documento y el test mide la línea y el tope de palabras; una persona no vería nada que el test no haya medido.

## Capacidades

- Ninguna, porque docs (`capability index`: «Sin capacidades»; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad, contrato público, `MODIFIED`, datos ni dependencia; la plantilla no la lee ningún código) · tamaño: ~15 líneas en 3 ficheros
- Un revisor, siete puntos (sonnet: la spec no toca reglas de negocio ni roles): dominio — si «Conserjería: 5500» contradice la constitución (texto en castellano, art. 4) o el Intent, y si el Scope omite algo que el Intent promete (punto 3)· técnica — si el tope de 60 palabras de `test/words.test.js` se cumple con la línea nueva (52 → 54) y si el test nuevo lee el mismo fichero que ese test (señal: tope de palabras, punto 2)
- Mínimo razonable: sin review — deja sin cubrir las dudas de forma del test (cómo cuenta líneas, qué exige de la primera)

1. Carril: feature, modo full, porque pediste una spec; un cambio cerrado de una línea cabría en patch, pero el carril no baja por mi cuenta.
2. Enfoque: A (línea literal al final de `aviso.md`), frente a B y C (ver Approach).
3. La línea va en una línea propia, justo después de la existente, con `\n` final como hoy (comprobado con `od -c`: hoy acaba en `\n`, sin CRLF).
4. Literal exacto: `Conserjería: 5500`, con tilde, dos puntos y un espacio, sin punto final. Tú diste «Conserjería: 5500» entre comillas; el punto final y el salto de línea son míos.
5. La plantilla `recibo.md` no se toca.
6. Test nuevo: `test/aviso.test.js`, que lee `docs/plantillas/aviso.md` con `readFileSync`, igual que `test/words.test.js`; no hay capacidad ni superficie mayor donde probarlo. Criterio exacto: `split(/\r?\n/)`, se descarta la última cadena vacía y se exige `lines.length === 2`, `lines[0] === 'Aviso de sala: {sala} el {dia}.'` y `lines[1] === 'Conserjería: 5500'`. Va primero (constitución, art. 2): se ve fallar en RED antes de editar `aviso.md`, y el gate de cierre es `node --test` entero en verde.
7. Topes de palabras: no se cambia el tope de 60 de `test/words.test.js`; la línea suma 2 palabras (52 → 54, margen 6). Si crece, se cambia la spec, no el tope.
8. `Validación: agente` (el kit dice que, sin delegación, solo vale en documentos y tests; aquí un documento). Rechaza esta decisión si quieres verlo tú.
9. Fila del roadmap: la 0014 no tiene fila en `roadmap.md` (`git grep -n 0014` no la encuentra); no la creo aquí, la rama ya reserva el id (`sdd id claim`: «la 0014 vale (contador local)»).
10. Sin delta: el repaso de coherencia no ejecuta `sdd capability merge` sobre una copia porque no hay delta que fusionar.
### Hallazgos de la review

- **Aceptado** — la primera línea y los marcadores no tenían criterio verificable → decisión 6 fija `lines[0]` y `lines[1]` literales.
- **Aceptado** — el test podía fallar por el fin de línea → decisión 6 fija `split(/\r?\n/)` y descarta la última cadena vacía.
- **Aceptado** — el mínimo razonable decía algo falso → reescrito.
- **Aceptado** — «54» no es la cuenta oficial → Intent: el éxito es `test/words.test.js` en verde.
- **Aceptado** — faltaban el art. 2 y el gate → decisión 6: RED primero y `node --test` entero.
- **Aceptado** — «única aparición» sin su comando → la tabla cita `git grep -n "Aviso de sala"`.
- **Rechazado** — sustituir «dev-lead» por «único desarrollador» → el kit llama dev-lead a quien decide; aquí es la misma persona.
- **Rechazado** — quitar la segunda viñeta de decisiones con el dev-lead → es la frase literal de tu petición; si prefieres, bórrala.
- **Rechazado** — marcar 5500 como ficticio → lo diste tú literal.
- **Rechazado** — prever una fila 0014 que aparezca → si aparece al cerrar, `sdd-archive` la actualiza.

- Política de modelos: un revisor de la spec (sonnet, sin parar a pedir permiso) · revisión final según el plan (una sola task, sin ejes extra) · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- La plantilla `docs/plantillas/aviso.md` añade una línea con el teléfono de conserjería — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»».
- La entrevista ya está hecha — «La entrevista ya está hecha; decidido con el dev-lead».

## Intent

Hoy `docs/plantillas/aviso.md` contiene una sola línea: `Aviso de sala: {sala} el {dia}.`, y quien recibe el aviso no sabe a quién llamar. Se quiere que el aviso lleve el teléfono de conserjería. Éxito: el fichero acaba en dos líneas, la segunda es exactamente `Conserjería: 5500`, y `test/words.test.js` sigue en verde (tope de 60 palabras; 54 es la previsión con `wc -w`, la cuenta oficial es la del test). Fracasaría, aunque «funcionase», si la línea nueva rompe el tope de palabras o altera la primera línea y sus marcadores `{sala}` y `{dia}`.

## Scope

- Entra: añadir la línea `Conserjería: 5500` a `docs/plantillas/aviso.md`, y su test (`test/aviso.test.js`).
- No entra: `docs/plantillas/recibo.md`; cambiar el tope de 60 palabras; un marcador `{conserjeria}` o cualquier código que lea la plantilla; una fila de roadmap; el teléfono en otro idioma o formato.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: la línea `Aviso de sala: {sala} el {dia}.` queda igual y la nueva se añade debajo | `docs/plantillas/aviso.md:1` (única aparición: `git grep -n "Aviso de sala"`) | Scope: se conserva |

- Filas que implementa: nada: comprobado con `git grep -n -E "0014|Conserjer|conserjer|5500"` (sin resultados) — no hay fila 0014 en `roadmap.md`.

## Approach

- A. Añadir la línea literal al final de `aviso.md` — coste mínimo: un fichero de docs y un test; es lo que decidió el dev-lead.
- B. Añadirla también a `recibo.md` — descartada: nadie la pidió, y gasta margen del tope de 60 palabras (quedarían 56 de 60) para algo sin pedir.
- C. Un marcador `{conserjeria}` rellenado desde código — descartada: ningún código lee las plantillas hoy y el teléfono sería un dato sin dueño; el dev-lead dio el literal.
- Elegido: A — es lo que dijo el dev-lead: «añade una línea con el teléfono de conserjería, «Conserjería: 5500»».

Partes del cómo que fija A: la línea va después de la primera, en línea propia, con salto de línea final; el test comprueba el contenido de las líneas del fichero, no solo que el texto aparezca en algún sitio.

## Dónde se prueba

- Que `aviso.md` lleva la línea `Conserjería: 5500` y conserva la primera: `test/aviso.test.js`, por lectura del fichero, como `test/words.test.js` lee `docs/plantillas`.
- Que sigue cabiendo en 60 palabras: el `test/words.test.js` existente, sin tocarlo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio no toca comportamiento observable de ninguna capacidad (el proyecto no tiene `capabilities/`).

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` 6 + `recibo.md` 46), test `test/words.test.js` | 52 / 60 (`cat docs/plantillas/*.md \| wc -w`) | 8 | sin cambio: previsto 54 (+2: «Conserjería:» y «5500»), margen 6 |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
