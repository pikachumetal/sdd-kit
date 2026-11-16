---
id: 20261110-131623-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería en la plantilla del aviso de sala
mode: full
profile: delegate
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería en la plantilla del aviso de sala

🦆 Hoy el aviso de sala solo dice «Aviso de sala: Norte el 12/11.». Con este cambio, la plantilla termina con un párrafo para quien usa la sala: a quién llamar (conserjería, extensión 5500, de lunes a viernes de 8:00 a 20:00; fuera de ese horario, seguridad, extensión 5599) y qué dejar listo antes de salir (sillas recogidas, pizarra borrada, proyector apagado, ventanas cerradas). El párrafo lo dictó el dev-lead y se copia tal cual. Hay un obstáculo: un test limita todas las plantillas juntas a 60 palabras, hoy suman 52 y con el párrafo serían 94, así que hay que decidir qué hacer con ese tope (decisión 1).

Validación: dev-lead — es un texto que lee una persona (horarios y extensiones): el dev-lead comprueba que sale tal como lo dictó.

## Capacidades

- Ninguna, porque docs (el proyecto no tiene `capabilities/`; el cambio es el texto de una plantilla de documento, sin comportamiento del producto).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna de la tabla (sin capacidad, contrato público, `MODIFIED`, datos ni dependencia; área leída entera) · tamaño: ~30 líneas en 3 ficheros (aviso, test, esta spec)
- Dominio+técnica (sonnet): que el tope de palabras sale bien medido (52 → 94, tope propuesto 114, decisión 1) y que el párrafo del Scope coincide carácter a carácter con el que dictó el dev-lead (señal: ninguna; es el punto 7, los ejemplos, y el 3, alcance oculto)
- Mínimo razonable: sin review — deja sin cubrir que el tope del test sea coherente con lo medido

### Hallazgos de la review

- **Aceptado** — sin escenarios GIVEN/WHEN/THEN → dos escenarios en «Dónde se prueba»
- **Aceptado** — línea en blanco y salto final sin test → el test compara el contenido exacto del fichero
- **Aceptado** — el párrafo solo estaba en las decisiones → ahora es fuente única en un bloque del Scope
- **Aceptado** — test nuevo fuera del Scope, «o fichero propio» abierto, cifra de líneas → test en `words.test.js`, listado en «Entra», cifra corregida
- **Aceptado** — «100» dejaba el tope abierto → cerrado en 114, con el cálculo del 2 %
- **Aceptado** — «teléfono» vs «extensión» en el Intent → usa «extensión»
- **Aceptado** — frase del mínimo razonable contradecía el `git grep` → corregida
- **Rechazado** — `delegate` frente a validación `dev-lead` → son ejes distintos: el perfil gobierna las paradas de la sesión, la validación dice quién observa el resultado
- **Rechazado** — dev-lead «propio» y extensiones ficticias → no cambia la spec: el dev-lead es quien dictó el párrafo y las extensiones son las suyas, copiadas tal cual
- **Rechazado** — la rama debe salir de `develop` → `develop` no existe aún en el repo (solo `main`) y la rama ya estaba creada; no es asunto de esta spec

1. **El tope de 60 palabras de `test/words.test.js` sube a 114.** El párrafo dictado suma 42 palabras: 52 de hoy (aviso 6 + recibo 46) + 42 = 94, y el test `docs/plantillas cabe en su tope de 60 palabras` fallaría. Nadie dijo qué hacer. Enfoque: A) subir el tope, frente a B) recortar `recibo.md` para hacer sitio (destruye un documento que nadie pidió tocar) y C) acortar el párrafo (el dev-lead lo dictó literal). Valor 114 = 52 medidas + 42 previstas + 20 de margen (regla del kit: el 2 % de 94 son 2 palabras, y el mínimo es 20). **Esta es la decisión que más necesito que valides.**
2. **El párrafo va separado del aviso por una línea en blanco**, como párrafo propio, y el fichero sigue acabando en salto de línea. El dev-lead dijo «al final este párrafo»; la línea en blanco es mía.
3. **El primer renglón del aviso no cambia** (`Aviso de sala: {sala} el {dia}.`, con sus marcadores).
4. **`recibo.md` no se toca.**
5. **El título del test cambia a «…tope de 114 palabras»** para que nombre el valor real.
6. **Validación `dev-lead`**, no `agente`: es texto que lee una persona y el dev-lead no delegó el atajo.
7. **Sin delta de comportamiento ni prueba de fusión de capacidades:** no hay `capabilities/` ni delta que fusionar.
8. **Sin fila de roadmap:** la 0014 no tiene fila en `roadmap.md`; el id vale por la rama `feature/0014-notice-room` (`sdd id claim`: «la 0014 vale (contador local)»). No añado fila.
9. **Un solo revisor, en sonnet:** el cambio no toca reglas de negocio ni roles.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- El párrafo exacto y su sitio (al final de `docs/plantillas/aviso.md`) — «docs/plantillas/aviso.md añade al final este párrafo: «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»»
- Carril feature, modo full — «paso 4, carril feature»

## Intent

Hoy `docs/plantillas/aviso.md` es una sola línea: `Aviso de sala: {sala} el {dia}.`. Quien recibe el aviso no sabe a quién llamar si tiene un problema con la sala ni qué dejar ordenado al irse. El dev-lead decidió añadir un párrafo con la extensión de conserjería, su horario, la extensión de seguridad para fuera de horario y las cuatro tareas de salida. Éxito: la plantilla termina con ese párrafo, idéntico al dictado, y `node --test` entero sigue en verde. Fracaso aunque «funcione»: que el test de 60 palabras se haya esquivado sin que nadie lo decida, o que una extensión o un horario cambien al copiarlos.

## Scope

- Entra: `docs/plantillas/aviso.md` termina con este párrafo (fuente única, tal cual lo dictó el dev-lead), tras una línea en blanco:

  ```text
  Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.
  ```

- Entra: `test/words.test.js` sube su tope de 60 a 114 palabras (decisión 1), también en el título del test, y recibe el test nuevo de «Dónde se prueba» (en ese mismo fichero).
- Entra: la spec y su plan, en `.docs/sdd/specs/20261110-131623-feature-0014-notice-room/`.
- No entra: tocar `recibo.md`, los marcadores `{sala}` y `{dia}`, o el primer renglón del aviso.
- No entra: que el código use la plantilla (hoy nada en `src/` la lee), ni avisos por correo (fila 1 del roadmap).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope «60 palabras» de `docs/plantillas` | `test/words.test.js:5` (título) y `:7` (`<= 60`); `git grep` no lo encuentra en ningún otro sitio fuera de `.docs/sdd/specs/` | Scope y decisión 1 |

- Filas que implementa: 0014 → no tiene fila en `roadmap.md` (decisión 8) | nada más: comprobado con `git grep -n "0014\|aviso\|Aviso\|conserj\|Conserj" -- . ':!.docs/sdd/specs'` (solo `docs/plantillas/aviso.md:1` y la fila 1 del roadmap, «Avisos por correo», que es otra cosa)

## Approach

- A) Subir el tope del test a 114 — una línea en un test; mantiene el tope como guarda (sigue avisando si las plantillas crecen otro tanto).
- B) Recortar `recibo.md` hasta que quepa — hay que quitar unas 34 palabras de un documento que nadie pidió tocar.
- C) Acortar el párrafo — contradice lo que el dev-lead dictó literal.
- Elegido: A — es el único que cumple lo dictado sin tocar otros documentos; el tope es un número sin motivo escrito en ningún documento del proyecto.

Medidas con el conteo del propio test (`split(/\s+/)`): aviso 6, recibo 46, párrafo 42; total con el cambio 94. Sin cambios de código en `src/`.

## Dónde se prueba

Sin capacidades no hay delta; estos escenarios son los que probará el plan, todos en `test/words.test.js`, con la misma lectura de fichero que el test de palabras existente:

- Contenido exacto del aviso: GIVEN `docs/plantillas/aviso.md` · WHEN se lee · THEN es exactamente `Aviso de sala: {sala} el {dia}.\n\n` + el párrafo del Scope + `\n` (primer renglón intacto, línea en blanco y salto final incluidos).
- Tope: GIVEN aviso (6 + 42 palabras) y recibo (46) · WHEN se cuentan con `split(/\s+/)` · THEN suman 94, que es ≤ 114.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (aviso 6 + recibo 46, `test/words.test.js`) | 52 / 60 | 8 | 114 (52 + 42 previstas + 20) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
