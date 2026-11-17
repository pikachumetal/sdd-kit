---
id: 20261106-101636-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo hace que el agente diga qué se cierra: «Se cierra la 0007: cancelar una reserva por id». Con el cambio, ese mismo paso dice además qué queda pendiente: «Queda pendiente: validar la cancelación en el entorno real». Cambia el paso 1 de `skills/aviso-cierre/SKILL.md` (una línea) y fija en `battery.md` qué lleva cada caso de prueba; el paso 2 (correr el gate) no se toca. Como es una edición de skill, se prueba con sujetos Sonnet de las baterías c1 y c2, antes (RED) y después (GREEN), con una previsión de 5,60 $ y un tope de 8,40 $ si hace falta una tanda de REFACTOR.

Validación: agente — es el texto de una skill y lo único observable es lo que dicen los sujetos, que el agente mide; nadie usa una pantalla. (Decisión mía, en ✋.)

## Capacidades

- Ninguna, porque herramientas (el cambio edita una skill del proyecto, no un comportamiento de `salas`; `sdd capability index` dice «Sin capacidades»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad; el área, la skill y su batería, está leída) · tamaño: ~1 línea en `SKILL.md` y ~10 en `battery.md`, 2 ficheros
- Dominio y técnica juntas (sonnet): si los THEN de «Dónde se prueba» distinguen el texto viejo del nuevo con los casos c1 y c2, y si «qué queda pendiente» deja a un sujeto sin respuesta cuando no hay nada pendiente (señal: ninguna; es el único punto flojo de la spec)
- Mínimo razonable: sin review — deja sin cubrir la ambigüedad de «pendiente» (decisión 2), que es justo donde un sujeto puede inventar

### Hallazgos de la review

- **Aceptado** (Crítico) — la batería no dice qué llevan c1 y c2, así que no hay garantía de un caso con pendiente y otro sin → el Scope incluye ahora que `battery.md` declare c1 (feature con algo pendiente) y c2 (feature sin nada pendiente); coste y decisión 6 actualizados.
- **Aceptado** (Crítico) — el éxito no distinguía el texto viejo del nuevo ni comprobaba la no invención → nuevo THEN de no invención contra la lista de pendientes reales de cada caso, y el RED se juzga por significado.
- **Aceptado** — `lint.mjs` ajeno a la skill → primero se quitó el literal; la segunda ronda eliminó el THEN del paso 2 (lo prueba el diff).
- **Aceptado** — literales «Queda pendiente: …» y «Pendiente: nada» no coinciden y chocan con «no añade formato» → los THEN se verifican por significado, sin literal.
- **Aceptado** — atribuía al dev-lead el descarte de definir «pendiente» → es decisión mía y va en ✋ como tal (decisión 1).
- **Aceptado** — modo full con un cambio de una línea → decisión 8 explica el carril: no es patch y lite necesita tu confirmación; va full con plan de 2 tasks.
- **Aceptado** — minutos inventados y REFACTOR dentro del total → la previsión separa «previsto» (RED+GREEN) y «tope con REFACTOR», y los minutos son un rango con su base.
- **Aceptado** — línea «Entra, si el RED lo exhibe: nada» → sustituida por la regla de parada si el RED sale limpio.
- **Rechazado** (parcial) — «no existe `develop`» → existe (`git branch -a`: `develop`, `main`). El 0,31 $ cita ahora su fuente, `patch-0006-aviso/patch.md`.
- **Rechazado** — la confirmación de paralelizar hereda una aprobación inexistente → es la forma de la plantilla: solo vale si apruebas la spec con esa línea; no se ejecuta antes.


Segunda ronda (la última):
- **Aceptado** (Crítico) — la tabla mezclaba dos totales → dos filas de suma (previsto 5,60 $, tope 8,40 $) y REFACTOR marcado condicional.
- **Aceptado** (Crítico) — el contenido de c1 y c2 dependía de lo que escribiera la implementación, y c2 no discrimina → los casos quedan fijados en la decisión 6 y en el Scope, y se dice que c2 solo vigila la no invención.
- **Aceptado** — intro y tamaño decían 1 fichero → 2 ficheros, y el Intent nombra la batería.
- **Aceptado** — contenido provisional («p. ej.») → fijado, y es decisión mía en ✋.
- **Aceptado** — el THEN del gate no se verifica con sujetos → eliminado; el paso 2 intacto lo prueba el diff.
- **Aceptado** — decisión 3 conservaba un literal → sin literal.
- **Aceptado** — base de coste → decisión 7 da la previsión a precio de lista y la cifra a 0,31 $.
- **Aceptado** — fila 0016 sin destino → decisión 9.
- **Rechazado** — `lint.mjs` en el gate → `operations.md` lo fija, y contiene al gate de la Constitución; explicado en ✋.
- **Rechazado** — la línea de paralelizar convierte la aprobación en permiso → está escrita en ✋, que es lo que apruebas; si no quieres paralelizar, dilo y corren en serie.

1. **Enfoque** — el cambio es ampliar la frase del paso 1 en el mismo sitio, y no defino «pendiente» en la skill: lo interpreta el agente con lo que sabe de la feature (decisión mía). Descartados: (b) subapartados que definan «pendiente» (una definición que nadie pidió), y (c) un paso nuevo entre 1 y 2 (renumera el gate, que `aviso-cierre` ya cita como paso 2). El enfoque elegido es la decisión central de la spec.
2. **Literal del paso 1** — `1. Di qué se cierra y qué queda pendiente.` El dev-lead dijo «dice también qué queda pendiente»; la frase exacta es mía.
3. **Cuando no queda nada pendiente** — el THEN pide que el aviso diga que no queda nada, en vez de callar o inventar. Es un valor que nadie dijo; si prefieres que la skill no lo mencione, lo cambio.
4. **Qué no se toca** — la `description` del frontmatter («Usar al cerrar una feature.») y el paso 2 quedan idénticos.
5. **Validación `agente`** — la elijo yo; sin frase de delegación del dev-lead, es una propuesta que apruebas con la spec.
6. **Baterías** — `battery.md` solo lista c1 y c2 (cierre, n=2, sonnet). El contenido de los casos lo fijo yo aquí, antes del primer sujeto, para que el RED no dependa de lo que escriba la implementación: c1 = feature «Cancelar una reserva por id», con un pendiente exacto, «la validación en el entorno real no se ha hecho»; c2 = feature «Listado de salas libres por franja», sin nada pendiente (validada, mergeada, sin deuda). Ambos nombres son inventados. Es una edición de test que nadie pidió. c2 no separa texto viejo de nuevo (ambos pueden callar y no inventar): solo vigila la no invención; el RED discrimina con c1. Si el RED de c1 sale limpio, paro (Constitución 5).
7. **Previsión de coste** — uso 0,70 $ por sujeto, el precio de `tech-stack.md`; el patch 0006 midió ~0,31 $ por sujeto sobre esta skill (`specs/20260915-090000-patch-0006-aviso/patch.md`), así que 5,60 $ (previsión, a precio de lista) y 8,40 $ (tope con REFACTOR) son techos; a 0,31 $ serían ~2,50 $ y ~3,70 $. Los minutos no están medidos (`sin medir`): 2–5 min por tanda, base: 4 sujetos en paralelo y un cierre de feature entero.
8. **Carril full** — no es patch (no es un fallo determinista ni un ajuste de presentación, y piden 2 tests de comportamiento) y lite necesita tu confirmación, así que va full con plan de 2 tasks (batería y RED; edición y GREEN): sin secciones de diseño ni reparto.
9. **Fila 0016** — el roadmap no la tiene y no la añado ahora; propongo que el cierre (`sdd-archive`) registre la 0016 al cerrar. Dímelo si prefieres añadirla ya.
- Política de modelos: revisor de la spec en sonnet (uno) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: 4 sujetos sonnet por tanda (c1 ×2, c2 ×2) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Gate del repo: `operations.md` fija `node --test && node scripts/lint.mjs`, y la Constitución 2 `node --test` entero; el gate de cierre uso el de `operations.md`, que es el más estricto y contiene al otro.
- Coherencia: `sdd capability merge` sobre una copia no aplica (sin delta, sin capacidades); `git grep` de lo que se cambia, en «Lo que se retira o cambia de forma».

### Decisiones tomadas con el dev-lead

- El cambio es el paso 1 de `skills/aviso-cierre/SKILL.md`, que dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»
- La entrevista está hecha; se escribe la spec y se presenta para aprobar — «La entrevista ya está hecha; decidido con el dev-lead»

## Intent

Al cerrar una feature, `aviso-cierre` hoy deja un aviso que solo dice qué se cierra. Quien lo lee no sabe, por ese aviso, si algo se queda sin hacer, sin validar o anotado como deuda. El cambio hace que el mismo paso diga las dos cosas: qué se cierra y qué queda pendiente, y fija en la batería los dos casos con los que se mide. Éxito: en 4 de 4 sujetos del GREEN (c1 y c2, n=2), el aviso nombra qué se cierra y dice qué queda pendiente (c1) o que no queda nada (c2), sin inventar pendientes que la feature de prueba no tiene, y el paso 2 sigue corriendo el gate; en el RED, el texto de hoy no lo consigue. Fracaso aunque funcione: que el aviso se alargue con un informe entero.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` pasa de «Di qué se cierra.» a «Di qué se cierra y qué queda pendiente.»
- Entra: `tests/batteries/aviso-cierre/battery.md` declara qué lleva cada caso: c1, la feature «Cancelar una reserva por id» con un pendiente exacto («la validación en el entorno real no se ha hecho»); c2, la feature «Listado de salas libres por franja» sin nada pendiente. Hoy solo lista ids.
- Si el RED sale limpio (el texto de hoy ya dice qué queda pendiente): se para y se informa; no se añaden casos ni se amplía el cambio.
- No entra: el paso 2 (correr el gate), la `description` del frontmatter, la definición de «pendiente» dentro de la skill, y cualquier otra skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `1. Di qué se cierra.` (el literal del paso 1) | `skills/aviso-cierre/SKILL.md:8` | Scope: pasa a `1. Di qué se cierra y qué queda pendiente.` Sin más sitios: `git grep -niE "qué se cierra"` solo da ese |
| `aviso-cierre` (nombre de la skill) | `tech-stack.md:6` y `tests/batteries/aviso-cierre/battery.md:1` | Sin cambio: nombran la skill, no el literal |

- Filas que implementa: 0016 → ningún fichero la nombra (`git grep -nE "0016|close-notice" -- . ':!.docs/sdd/specs'` no da nada) · el roadmap no tiene fila 0016: el id sale de la rama `feature/0016-close-notice` y de `sdd id claim` («sin remoto: la 0016 vale»). No edito el roadmap aquí.

## Approach

Se amplía la frase del paso 1 en el mismo sitio, con el literal de la decisión 2. La skill no define «pendiente» ni añade formato: el agente dice, con lo que sabe de la feature, qué se queda sin hacer. Cada paso conserva su número.

## Dónde se prueba

- Aviso con algo pendiente: sujetos Sonnet de la batería `aviso-cierre`, caso c1 (n=2), como en el patch 0006; el RED corre contra el texto de hoy y el GREEN contra el nuevo.
- Aviso sin nada pendiente: caso c2 (n=2).
- Paso 2 intacto: lo prueba el diff (solo cambia la línea del paso 1), no un sujeto.
- Gate de cierre del repo: `node --test && node scripts/lint.mjs` (`operations.md`).
- Se juzga por significado, no por literal: «nombra qué se cierra» y «declara el pendiente, o que no hay», contra la lista de pendientes reales que `battery.md` fija para cada caso.

Escenarios (en prosa; sin delta de capacidad):
- GIVEN c1, la feature «Cancelar una reserva por id» con la validación en el entorno real sin hacer · WHEN el sujeto cierra con el texto nuevo · THEN el aviso dice qué se cierra y nombra esa validación como pendiente.
- GIVEN c2, la feature «Listado de salas libres por franja», sin nada pendiente · WHEN el sujeto cierra con el texto nuevo · THEN el aviso dice qué se cierra y que no queda nada pendiente, sin inventar ninguno.
- GIVEN el texto de hoy · WHEN el sujeto cierra c2 · THEN el aviso no inventa ningún pendiente (c2 no discrimina: solo vigila la no invención).
- GIVEN el texto de hoy · WHEN el sujeto cierra c1 · THEN el aviso dice qué se cierra y no nombra la validación pendiente (esto es el RED; si la nombra, se para).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Previsión de coste

Sujetos Sonnet a ~0,70 $ cada uno (`tech-stack.md`); la batería `aviso-cierre` tiene c1 ×2 y c2 ×2 = 4 por tanda. Minutos: `sin medir`, 2–5 por tanda (4 sujetos en paralelo). Previsto: RED + GREEN = 5,60 $, ~4–10 min; tope con REFACTOR = 8,40 $, ~6–15 min.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (`aviso-cierre`: c1 ×2, c2 ×2) × 0,70 $ | 2,80 |
| GREEN | 4 (c1 ×2, c2 ×2) × 0,70 $ | 2,80 |
| Una tanda de REFACTOR (condicional: solo si hace falta) | 4 (c1 ×2, c2 ×2) × 0,70 $ | 2,80 |
| Controles | 0: la batería no define controles | 0,00 |
| Medición tras la revisión final | 0: no hay tope de palabras ni medida en este proyecto | 0,00 |
| Suma previsto (RED + GREEN) | 8 sujetos | 5,60 |
| Suma tope (con REFACTOR) | 12 sujetos | 8,40 |

Si la prueba lo supera, una tanda de REFACTOR incluida, se para y decide el dev-lead (Constitución 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
