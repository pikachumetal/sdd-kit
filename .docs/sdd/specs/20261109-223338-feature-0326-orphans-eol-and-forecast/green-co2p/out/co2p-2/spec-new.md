---
id: 20261110-132221-feature-0014-aviso-conserjeria
feature: 0014
title: Párrafo de conserjería al final de la plantilla de aviso
mode: full
profile: delegate
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería al final de la plantilla de aviso

🦆 Hoy el aviso de sala dice solo «Aviso de sala: Norte el 2026-11-12.». Con el cambio, justo debajo sale el párrafo de conserjería: a quién llamar (extensión 5500 en horario de oficina, 5599 de seguridad fuera de él) y qué dejar recogido al salir (sillas, pizarra, proyector, ventanas). Para que quepa hay que subir el tope de palabras de `docs/plantillas` de 60 a 114, porque la plantilla ya gasta 52 y el párrafo suma 42: esa es la decisión que te pido validar.

Validación: agente — es un texto fijo en un documento; el test compara el párrafo literal y el tope, y una persona no vería nada más que el agente no haya medido.

## Capacidades

- Ninguna, porque docs.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: ninguna de la rúbrica (sin capacidad nueva, contrato público, MODIFIED, datos ni dependencias; leído todo lo que toca) · tamaño: ~45 líneas en 2 ficheros (`aviso.md`, `words.test.js`)
- Dominio+técnica (sonnet), siete puntos: si el tope 114 de «Topes de palabras» sale bien de 52 + 42 y si el THEN «termina con el párrafo literal» se puede probar tal cual (señal: ninguna, mínimo de la rúbrica)
- Mínimo razonable: este mismo (un revisor) — deja sin cubrir una segunda lente de dominio, que aquí no tiene reglas de negocio que mirar
```

1. **Tope de palabras: de 60 a 114** — `test/words.test.js` cuenta las palabras de todo `docs/plantillas` y hoy da 52 (`aviso.md` 6 + `recibo.md` 46). El párrafo literal suma 42, el total sería 94 y el test fallaría con el tope en 60. Propongo subir el tope a 94 + 20 de margen = 114 (regla de «Topes de palabras»). Alternativas descartadas: recortar `recibo.md` (son 46 repeticiones de «palabra», pero es otro fichero que nadie pidió tocar) y acortar el párrafo (el dev-lead dio el texto literal). **Esta es la decisión que cambia una regla del proyecto: valídala.**
2. **Enfoque: una sola edición literal, frente a las alternativas** — ver Approach.
3. **Formato**: el párrafo va en un bloque propio, tras una línea en blanco, y el fichero acaba en un único salto de línea; la primera línea del aviso no cambia.
4. **Sin capacidad ni delta**: el aviso es un documento, no comportamiento de la herramienta (`src/app.js` no lo lee: `git grep` solo lo encuentra en `test/words.test.js`).
5. **Sin partir**: una sola task prevista, no se propone dividir.
6. **Dónde va el test**: el test nuevo en `test/words.test.js`, junto al de palabras; el tope sigue siendo la suma de toda la carpeta, no uno por fichero; el párrafo se duplica a propósito como literal en el test, para que cambiarlo exija tocar los dos sitios.
7. **Carril feature**: lo pidió así el usuario; no se baja a patch aunque el texto venga dado, porque la decisión del tope (1) no estaba fijada.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin cambio de estructura) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

Un revisor (sonnet, siete puntos); ningún Crítico, así que no hay segunda ronda.

- **Aceptado** — Menor: el título del test «cabe en su tope de 60 palabras» quedaría falso → el Scope y el Approach lo renombran a 114.
- **Aceptado** — Importante: el «byte a byte» del Intent no lo fijaba ningún test → «Dónde se prueba» añade un assert de inicio (`Aviso de sala: {sala} el {dia}.

`) además del de final.
- **Aceptado** — Importante: el EOL. `core.autocrlf=true` en este equipo y `readFileSync` puede devolver `
` → el test normaliza `
` a `
` y compara con `endsWith(literal + '
')`; hoy `aviso.md` está en LF.
- **Aceptado** — Importante: `lint.mjs` → comprobado: solo busca tabuladores en `src/app.js`, no toca `docs/`; se queda en el gate porque es el de `operations.md`, no porque afecte al aviso.
- **Aceptado** — Menor: la tabla no mostraba el 94 previsto → añadido; el margen de 20 es el mínimo de la regla de «Topes de palabras».
- **Aceptado** — Menor: decisiones en el cuerpo → decisión 7 (test en `words.test.js`, tope global de la carpeta, literal duplicado en el test a propósito).
- **Aceptado** — Menor: evidencia del `git grep` → su salida va en «Lo que se retira o cambia de forma».
- **Rechazado** — Menor: sin escenarios GIVEN/WHEN/THEN → la spec no tiene delta (documento); las tres comprobaciones están en «Dónde se prueba».
- **Rechazado** — Menor: «dev-lead»/`approvers` → en el kit es el rol de quien aprueba; aquí lo ejerce el único usuario, y el aprobador se anota en Aprobaciones al aprobar.
- **Rechazado** — Menor: ADR del tope → es una constante de un test, se deshace con una línea; no sorprende sin contexto.

### Decisiones tomadas con el dev-lead

- El texto del párrafo y su sitio (al final de `docs/plantillas/aviso.md`) — «docs/plantillas/aviso.md añade al final este párrafo: «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»»
- Carril feature — «paso 4, carril feature»

## Intent

Quien recibe el aviso de una sala no sabe hoy a quién llamar si algo falla ni qué dejar recogido al salir. El aviso gana al final el párrafo de conserjería acordado con el dev-lead, tal cual. Éxito: `aviso.md` acaba con ese párrafo, idéntico al literal, el primer renglón sigue igual y `node --test && node scripts/lint.mjs` pasa entero. Fracaso aunque «funcione»: un texto retocado (un número, una tilde, una hora) o un test que pase porque se quitó el tope.

## Scope

- Entra: añadir el párrafo literal al final de `docs/plantillas/aviso.md`; subir el tope de `test/words.test.js` a 114 y renombrar su título a «cabe en su tope de 114 palabras»; un test que fije el principio y el final de `aviso.md`.
- No entra: tocar `recibo.md`; leer el aviso desde `src/app.js`; cambiar los números o los horarios; traducir o parametrizar el texto.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras (`<= 60`) y su título «cabe en su tope de 60 palabras» | `test/words.test.js:5` y `:8` | Scope y decisión 1: pasa a 114 |

- Filas que implementa: nada: comprobado con `git grep -n "0014"` (solo la rama y esta spec) y `git grep -n "plantillas"` (solo `test/words.test.js`); `git grep -n -i "aviso" -- . ':!.docs'` → solo `docs/plantillas/aviso.md:1`, así que `src/app.js` no lo usa

## Approach

- A. Editar `aviso.md` con el párrafo literal y subir el tope del test a 114 — una línea del test y un test nuevo; el texto no se toca.
- B. Recortar `recibo.md` hasta que quepan las 94 palabras en 60 — deja el tope intacto, pero cambia un fichero que nadie pidió y obliga a recortar 34 palabras.
- C. Acortar el párrafo para que quepa — descartada: el dev-lead dio el texto literal.
- Elegido: A — es el cambio mínimo que respeta el texto dado; el tope de 114 es la medida más 20 de margen y lo valida el dev-lead en este gate.

El párrafo se añade tras una línea en blanco; el contenido previo del fichero queda byte a byte igual. El test lee `aviso.md`, normaliza `
` a `
` y comprueba que empieza por `Aviso de sala: {sala} el {dia}.

` y que acaba en el literal + `
`.

## Dónde se prueba

- Párrafo al final del aviso y primera línea intacta: `test/words.test.js`, como el test de palabras que ya lee `docs/plantillas` con `readFileSync`; un test nuevo compara principio y final del fichero con los literales, normalizando EOL.
- Tope: el test de palabras existente, con el tope en 114.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas` (suma de `aviso.md` 6 y `recibo.md` 46, conteo de `test/words.test.js`) | 52 / 60 | 8 (previsto: 94) | 52 + 42 previstas (`wc -w` del párrafo → 42) + 20 de margen = 114 |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
