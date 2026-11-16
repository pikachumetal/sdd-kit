---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

🦆 Hoy, al cerrar una feature, el agente lanza dos skills: `aviso-cierre` («di qué se cierra» y «corre el gate») y `resumen-cierre` (commits y filas del roadmap). Con este cambio queda una sola, `resumen-cierre`, que al cerrar dice primero «se cierra la feature 0030», corre el gate, y después cuenta los commits y lista las filas que salda. Lo que hacía `aviso-cierre` pasa a ser sus dos primeros pasos, y el paso del gate gana dos frases que antes no decía ninguna skill: «una sola vez en este cierre, aunque se retome» y «si falla, para y di qué test falló».

Validación: dev-lead — cambia lo que lee quien cierra una feature, y el agente no se concede el atajo.

## Capacidades

- Modificadas: `closing` — quien cierra lo sabe por `resumen-cierre`, y el resumen renumera sus pasos.
- Modificadas: `quality-gate` — el «paso 2» del cierre pasa a ser el de `resumen-cierre`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (cuatro requisitos de `closing` y `quality-gate`) · tamaño: ~35 líneas en 4 ficheros
- Dominio (sonnet): si el gate sigue corriendo una vez y antes del resumen, y si «paso 2» en `quality-gate` y «paso 3/4» en `closing` dicen lo mismo que `resumen-cierre` (señal: MODIFIED)
- Técnica (sonnet): si la renumeración deja algún «paso N» sin dueño en `capabilities/` o en `skills/`, y si `sdd capability merge` acepta los cuatro MODIFIED (señal: MODIFIED)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin separar la mirada de flujo de cierre de la de referencias cruzadas

1. **El gate no se retira: se muda a `resumen-cierre`.** `aviso-cierre` también corre el gate («2. Corre el gate»); retirarla sin más lo dejaría sin quien lo corra y rompería dos requisitos de `quality-gate`. El roadmap solo dice «retirar la skill»: tu intención es un solo mensaje, no quitar el gate. Alternativa descartada: quitarlo del cierre (contradice `constitution.md`, «Gate de cierre: `node --test` entero en verde», y `operations.md`, que lo define como `node --test && node scripts/lint.mjs`: «el gate» es lo de `operations.md`).
2. **Orden de `resumen-cierre`: 1. Di qué se cierra. 2. Corre el gate una sola vez en este cierre, aunque se retome; si falla, para y di qué test falló. 3. Cuenta los commits de la rama. 4. Lista las filas del roadmap que salda.** El gate queda en el paso 2, como hoy, para que «llega el paso 2» de `quality-gate` siga siendo verdad. Alternativa descartada: añadir los dos pasos al final (un gate en rojo pararía un cierre cuyo resumen ya se emitió).
   **El texto del paso 2 es nuevo, no se muda**: `aviso-cierre` decía solo «Corre el gate», sin «una sola vez» ni «para y di qué test falló», que `quality-gate` ya exigía sin que ninguna skill lo dijera. Lo escribo en el paso para que los dos THEN se puedan comprobar leyendo la skill (hallazgos 1 y 2 de la review).
3. **El título de `resumen-cierre` no cambia, pero su `description` pasa a «Usar al cerrar una feature.»** (hoy «Usar al acabar el cierre de una feature»): ya no corre después de otra skill, corre en el cierre.
4. **`quality-gate` se toca solo para nombrar `resumen-cierre`** en sus dos escenarios («el paso 2 de `resumen-cierre`»); lo que exigen no cambia, pero el texto nuevo del paso 2 (decisión 2, párrafo «texto nuevo») sí es comportamiento nuevo de la skill: lo valida el gate de esta spec. Los títulos de los cuatro requisitos se mantienen: son la clave de fusión. El de «El resumen va al final» queda algo obsoleto (el resumen ya no es lo último que se hace); se acepta en vez de renombrar con `REMOVED` + `ADDED`, y su GIVEN pasa a «un cierre en marcha» para que no mezcle estados.
5. **La fila 0030 de `roadmap.md` no se toca aquí**: la salda `sdd-archive` al cerrar.
6. **`sin medir`**: el repo no tiene tests que lean `skills/`; la comprobación de los THEN es leer los dos `SKILL.md` resultantes. Cómo sabe el agente que el gate ya corrió en un cierre retomado no lo define la skill: se mide que el paso lo dice, no que el agente lo cumpla.
7. **Borrado y `description` van en el mismo paso** del plan: si no, durante un momento habría dos skills con el disparador «Usar al cerrar una feature.».
- Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: sustituye los cuatro requisitos (`closing`: «Quien cierra sabe qué se cierra», «El resumen va al final»; `quality-gate`: «El gate corre una sola vez», «Un gate en rojo para el cierre»), exit 0; el repo no cambia.
- Política de modelos: dos revisores de la spec, ambos sonnet (dominio sonnet: no hay roles ni reglas de negocio nuevas, solo el orden de un cierre) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Primera ronda (dominio y técnica, sonnet):

- **Aceptado** (Crítico) — el gate retomado se repetiría al vivir con otro paso en la misma skill, y su THEN no se comprobaba leyendo la skill → el paso 2 lleva «una sola vez en este cierre, aunque se retome» (decisión 2, Scope, Approach).
- **Aceptado** — «un gate en rojo para el cierre» no estaba en el paso → el paso 2 lleva «si falla, para y di qué test falló».
- **Aceptado** — alternativa descartada de la decisión 2 mal redactada → reescrita.
- **Aceptado** — «tres MODIFIED» → «cuatro».
- **Aceptado** — `lint.mjs` sin declarar → decisión 1 cita `operations.md` (existe `scripts/lint.mjs`).
- **Aceptado** — GIVEN de «El resumen va al final» mezclaba estados → «un cierre en marcha»; título obsoleto declarado en la decisión 4.
- **Aceptado** — borrado y `description` en el mismo paso → decisión 7.
- **Aceptado** — el `git grep` solo prueba que el paso es único → «Dónde se prueba» lo dice y añade la lectura del paso 2 y que la carpeta ya no existe.
- **Aceptado** — nota de la fila 0030 → en la tabla.
- **Rechazado** — renombrar «El resumen va al final» con `REMOVED` + `ADDED` → el título es la clave de fusión y renombrar solo por estética duplica el requisito; se acepta la obsolescencia (decisión 4).
- **Rechazado** — añadir en `closing` un requisito del orden del gate entre el paso 1 y el 3 → el gate lo posee `quality-gate`; en `closing` solo se numeran los pasos y copiarlo duplicaría la fuente.

Segunda ronda (un revisor, sonnet; sin Críticos, no hay tercera):

- **Aceptado** — el texto nuevo del paso 2 contradecía «el comportamiento del gate no cambia» → Scope reformulado («qué comando es el gate»), decisión 4 y 🦆 dicen que es comportamiento nuevo de la skill.
- **Aceptado** — faltaba `git grep aviso-cierre` en todo el repo → registrado en «Filas que implementa»; `lint.mjs` no valida skills.
- **Aceptado** — la divergencia `constitution.md` / `operations.md` → declarada conocida y fuera de alcance (Scope).
- **Rechazado** — rebajar el THEN de «El gate corre una sola vez» o añadir «cierre retomado» al GIVEN → es el requisito vivo, solo se le nombra la skill; la spec no inventa un mecanismo de retoma; la limitación va a `sin medir` (decisión 6).
- **Rechazado** — AND «no hay más pasos después del 4» en «El resumen va al final» → añade una restricción que nadie pidió; el defecto del título ya está aceptado en la decisión 4.
- **Rechazado** — aclarar el rol de Laura → el kit no guarda roles; quien aprueba en el gate es el dev-lead.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: tras el cambio existe una sola skill de cierre, `skills/aviso-cierre/` ya no existe, y el cierre sigue diciendo qué se cierra y corriendo el gate, una sola vez. Fracaso aunque «funcione»: que el cierre deje de correr el gate.

## Scope

- Entra: se borra `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` pasa a tener los cuatro pasos de la decisión 2 (con el texto nuevo del paso 2) y su `description` de la decisión 3; los cuatro `MODIFIED` del delta («Quien cierra sabe qué se cierra», «El resumen va al final», «El gate corre una sola vez», «Un gate en rojo para el cierre»).
- No entra: cambiar `aviso-apertura`; tocar `roadmap.md`; cambiar qué comando es el gate; alinear `constitution.md` («`node --test`») con `operations.md` («`node --test && node scripts/lint.mjs`»): la divergencia es conocida y no se corrige aquí.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | Scope: se borra la carpeta |
| paso «Di qué se cierra» | `skills/aviso-cierre/SKILL.md:8` | pasa al paso 1 de `resumen-cierre`; delta `closing` MODIFIED |
| paso «Corre el gate» | `skills/aviso-cierre/SKILL.md:9` | pasa al paso 2 de `resumen-cierre`; decisión 1 |
| `aviso-cierre` en un THEN | `.docs/sdd/capabilities/closing.md:13` | delta `closing` MODIFIED |
| «paso 1» / «paso 2» de `resumen-cierre` | `.docs/sdd/capabilities/closing.md:25-26` | delta `closing` MODIFIED (pasan a 3 y 4) |
| «el paso 2» sin skill nombrada | `.docs/sdd/capabilities/quality-gate.md:18` y `:23` | delta `quality-gate` MODIFIED ×2 |
| `description` de `resumen-cierre` | `skills/resumen-cierre/SKILL.md:3` | Scope; decisión 3 |
| `aviso-cierre` en el título de la fila | `.docs/sdd/roadmap.md:9` | se queda: es la fila que implementa; la salda `sdd-archive`, y que su título nombre una skill borrada es esperable (título histórico) |

- Filas que implementa: 0030 → la define `.docs/sdd/roadmap.md:9` y ningún otro fichero la nombra; destino: la salda `sdd-archive`. Comprobado con `git grep -nE 0030 -- . ':!.docs/sdd/specs'` (una sola línea). `git grep -n aviso-cierre -- . ':!.docs/sdd/specs'` da solo `closing.md:13`, `roadmap.md:9` y la propia skill: las tres están en la tabla; `scripts/lint.mjs`, `test/`, `src/` y `README.md` no nombran skills.

## Approach

Hay dos maneras de mover el contenido de `aviso-cierre`: (a) fusionar sus dos pasos al principio de `resumen-cierre` y renumerar, o (b) añadirlos al final. Se elige (a) por la decisión 2. La skill `resumen-cierre` queda así:

1. Di qué se cierra.
2. Corre el gate una sola vez en este cierre, aunque se retome; si falla, para y di qué test falló.
3. Cuenta los commits de la rama.
4. Lista las filas del roadmap que salda.

El borrado de `skills/aviso-cierre/` y el cambio de `description` van en el mismo paso del plan. El resto de referencias a «paso N» en `capabilities/` se han buscado con `git grep` (`closing.md` y `quality-gate.md` son las únicas) y quedan en el delta.

## Dónde se prueba

- el mensaje de cierre: leyendo los dos `SKILL.md` resultantes (no hay tests sobre `skills/`; `sin medir`, decisión 6).
- el gate corre una vez y un gate en rojo para el cierre: leyendo que el paso 2 de `resumen-cierre` dice «una sola vez en este cierre, aunque se retome» y «si falla, para y di qué test falló»; `git grep -n "Corre el gate" -- skills` da una línea (prueba solo que el paso es único) y `test ! -e skills/aviso-cierre` que la carpeta ya no existe.
- el repo sigue en verde: `node --test && node scripts/lint.mjs` (el gate de `operations.md`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN el paso 1 de `resumen-cierre` dice qué se cierra

#### MODIFIED — El resumen va al final

- GIVEN un cierre en marcha
- WHEN corre `resumen-cierre`
- THEN el paso 3 cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 2 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 2 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
