---
id: 20261110-104422-feature-0014-aviso-conserjeria
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

🦆 Hoy el aviso de sala dice solo `Aviso de sala: {sala} el {dia}.` y quien lo recibe no sabe a quién llamar. Con este cambio, el aviso lleva debajo una segunda línea fija: `Conserjería: 5500`. Por ejemplo, el aviso de «Sala Norte» el «lunes» queda en dos líneas: `Aviso de sala: Sala Norte el lunes.` y `Conserjería: 5500`. Por dentro es añadir una línea a `docs/plantillas/aviso.md` y un test que fija su contenido; la plantilla sigue dentro del tope de 60 palabras (pasa de 52 a 54).

Validación: agente — es un documento con un texto literal que un test fija; no hay pantalla ni flujo que una persona observe y el agente no mida.

## Capacidades

- Ninguna, porque docs (no hay `capabilities/` en el proyecto y el cambio es el texto de una plantilla de documento).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna contada (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad) · tamaño: ~15 líneas en 2 ficheros (`aviso.md` y `test/aviso.test.js`)
- Único (sonnet, siete puntos): si el THEN de `aviso.md` es verificable byte a byte y coincide con el Scope, y si el margen del tope de 60 palabras que da la tabla de «Topes de palabras» es el que mide el test de `test/words.test.js` (señal: tope de palabras que la spec toca)
- Mínimo razonable: sin revisor — deja sin mirar un literal o un conteo que no cuadre entre el Scope, el THEN y la tabla de palabras

1. Posición: la línea nueva va **al final**, como línea 2, sin línea en blanco entre las dos — «añade una línea» no dice dónde; al final no mueve la línea que ya existe.
2. Forma exacta: `Conserjería: 5500`, sin punto final (el dev-lead la dio entre comillas sin él; la línea 1 sí lleva punto, no lo copio) y con la tilde de «Conserjería».
3. El fichero sigue terminando en salto de línea y con finales LF, como hoy (`cat -A` lo confirma: solo `$`, sin `^M`). No añado `.gitattributes`: la garantía es el test nuevo, que compara el contenido completo.
4. Los marcadores `{sala}` y `{dia}` y la línea 1 no se tocan.
5. El teléfono va escrito en la plantilla, no como marcador `{conserjeria}` ni leído de configuración — ver Approach.
6. Enfoque: A (línea fija en `aviso.md`), frente a B (marcador `{conserjeria}` + configuración) y C (plantilla aparte) — ver Approach.
7. Validación: `agente`, no `dev-lead` — la frase del dev-lead no nombra este atajo, así que lo propongo yo y lo apruebas o lo cambias con la spec.
8. Topes de palabras: sin subir el tope de 60; la plantilla queda en 54, con 6 de margen — la tabla de abajo.
9. El id 0014 viene de la rama `feature/0014-notice-room`; `sdd id claim` lo confirmó («sin remoto: la 0014 vale (contador local)»). No existe fila 0014 en `roadmap.md` y no la creo yo: la fila de «Próximo» es planificación, no parte de este cambio.
10. Capacidades: ninguna, porque el proyecto no tiene `capabilities/` (`sdd capability index` → «Sin capacidades») y por eso no hay delta de comportamiento.
- Política de modelos: un revisor de la spec en sonnet (sin reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (una sola task) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

1. **Aceptado** — el test «compara líneas» no detecta CRLF ni falta del salto final → «Dónde se prueba» compara el contenido completo con `'Aviso de sala: {sala} el {dia}.\nConserjería: 5500\n'`.
2. **Aceptado** — no había un GIVEN/WHEN/THEN escrito → escenario explícito en «Dónde se prueba», con el RED antes del cambio (no es delta: no hay capacidad).
3. **Aceptado** — el test nuevo no tenía nombre → `test/aviso.test.js`, en Scope y en «Dónde se prueba».
4. **Rechazado** — «el dev-lead no existe según `mission.md`» → es el rol que el kit da a quien decide, aquí el usuario, que lo nombró así en su petición («decidido con el dev-lead»); la frase literal es suya.
5. **Aceptado** — faltaba el orden test primero → Approach: test rojo, luego `aviso.md`, luego `node --test` entero en verde.
6. **Aceptado** — el Scope y «Filas que implementa» describían distinto el `git grep` → el Scope ya no lo describe; vale el de «Filas que implementa».
7. **Aceptado** — el margen es de la carpeta entera, no de `aviso.md` → dicho en la tabla de «Topes de palabras».
8. **Aceptado a medias** — finales de línea en Windows → no añado `.gitattributes` (fuera de Scope); la decisión 3 declara que el test es la única garantía.
9. **Sin cambio** — «sin delta» es honesto; la verificación queda apoyada en el escenario del punto 2.

### Decisiones tomadas con el dev-lead

- `docs/plantillas/aviso.md` añade una línea con el teléfono de conserjería, «Conserjería: 5500» — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»

## Intent

Hoy `aviso.md` es una sola línea (`Aviso de sala: {sala} el {dia}.`) y no dice a quién llamar si hay un problema con la sala. Se quiere que el aviso lleve el teléfono de conserjería. Éxito: `docs/plantillas/aviso.md` tiene exactamente dos líneas, la segunda `Conserjería: 5500`, y `node --test` entero sigue en verde. Fracaso aunque «funcione»: pasar el tope de 60 palabras de `docs/plantillas` (rompería `test/words.test.js`), o tocar la línea 1 o sus marcadores.

## Scope

- Entra: añadir a `docs/plantillas/aviso.md` la línea `Conserjería: 5500` al final; un test nuevo, `test/aviso.test.js`, que fija el contenido completo de `aviso.md`.
- No entra: cambiar `recibo.md` o la línea 1 de `aviso.md`; marcadores nuevos; leer el teléfono de configuración; tocar `src/app.js` (nada usa las plantillas); `.gitattributes`; subir el tope de 60 palabras; la fila 0014 del roadmap.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma de `aviso.md`: pasa de una línea a dos (línea fija nueva) | `docs/plantillas/aviso.md:1` | Scope: la línea 1 no cambia, se añade la 2 |
| Conteo de palabras de `docs/plantillas` (52 → 54) | `test/words.test.js:5-6` (tope 60, suma de `aviso.md` y `recibo.md`) | Decisión 8 y tabla de «Topes de palabras»: sin cambio de tope |

- Filas que implementa: nada: comprobado con `git grep -n -i -E "conserjer|5500|0014|aviso\.md|plantillas" -- . ':!.docs/sdd/specs'` (solo `test/words.test.js:5-6`, que cuenta palabras de la carpeta, y no nombra `aviso.md`).

## Approach

- A: línea fija en `aviso.md` — cuesta una línea de texto y un test; el teléfono vive en la propia plantilla, que es donde el dev-lead lo pidió.
- B: marcador `{conserjeria}` rellenado desde configuración — el proyecto no tiene configuración ni nada que rellene los marcadores (`src/app.js` no usa las plantillas): se construiría infraestructura para un teléfono que no cambia.
- C: plantilla aparte (`conserjeria.md`) — parte en dos ficheros un aviso que se lee entero y gasta palabras del mismo tope.
- Elegido: A — es lo que pide el dev-lead («añade una línea con el teléfono de conserjería») y no añade partes móviles.

El contenido final de `docs/plantillas/aviso.md` es exactamente:

```text
Aviso de sala: {sala} el {dia}.
Conserjería: 5500
```

con salto de línea final y finales LF.

Orden (constitución, art. 2): primero `test/aviso.test.js` en rojo, después la línea en `aviso.md`, y por último `node --test` entero en verde.

## Dónde se prueba

- Contenido de `aviso.md` (`test/aviso.test.js`, nuevo): leyendo el fichero con `node:fs`, como `test/words.test.js` lee `docs/plantillas`; sin pantalla ni servidor.
  - GIVEN el repo · WHEN se lee `docs/plantillas/aviso.md` · THEN el contenido es exactamente `'Aviso de sala: {sala} el {dia}.\nConserjería: 5500\n'` (detecta CRLF y la falta del salto final). Hoy el contenido es `'Aviso de sala: {sala} el {dia}.\n'`, así que el test falla antes del cambio.
- Tope de palabras: el test existente `test/words.test.js`, sin cambios.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas` (`aviso.md` 6 + `recibo.md` 46; test `test/words.test.js`) | 52 / 60 | 8 | sin cambio: previsto +2 → 54, margen 6; no hay pasada de fix que añada palabras a la plantilla. El margen es de la carpeta entera: `recibo.md` son 46 palabras de relleno y cualquier cambio futuro en cualquiera de los dos ficheros gasta el mismo margen |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
