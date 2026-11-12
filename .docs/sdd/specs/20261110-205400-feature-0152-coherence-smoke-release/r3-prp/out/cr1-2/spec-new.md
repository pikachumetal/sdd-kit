---
id: 20261111-200847-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra: «Se cierra la 0005». Tras el cambio dirá además qué sigue abierto: «Se cierra la 0005. Queda pendiente: 0006 ⏳, 0008 🔄», o «Nada pendiente». Así quien cierra no se entera de que quedaba una fila abierta cuando ya ha parado al dev-lead. Lo que se toca es una línea de `skills/aviso-cierre/SKILL.md`, y solo si la prueba con sujetos (RED) demuestra primero que hoy el aviso lo omite.

Validación: dev-lead — la frase de delegación no nombra `agente`, y lo que se valida es lo que lee una persona al cerrar.

## Capacidades

- Ninguna, porque herramientas (una skill del propio proyecto; `sdd capability index` → «Sin capacidades»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de las contadas (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia; área leída: la skill, su batería y `operations.md`) · tamaño: ~2 líneas de skill más la batería en 2 ficheros
- Técnica y dominio juntas (sonnet): si el RED de la Scope puede dar limpio con c1 y c2 tal como están (la batería no describe sus escenarios) y si «pendiente» tiene una sola lectura (señal: tamaño pequeño, sin contrato)
- Mínimo razonable: sin revisor — deja sin mirar la definición de «pendiente» y la dependencia de la batería, que es justo donde el RED puede salir limpio o ambiguo

1. **«Pendiente»** = las filas de `Now` de `ROADMAP.md` (en la raíz) cuyo estado no es ✅ (⏳, 🔄, ⏸️, 🧪), sin contar la que se cierra (se excluye por su id, sea cual sea su emoji), **sin validar con el dev-lead** (el conjunto de estados es el cerrado del kit —⏳, 🔄, ⏸️, 🧪—, aunque el `ROADMAP.md` de hoy solo use ⏳ y ✅; es mío); `Next` y `Later` no cuentan — el ticket habla de «una fila abierta», y esas son planes, no trabajo abierto.
2. **Texto del paso 1** (literal): `1. Di qué se cierra y qué queda pendiente: las demás filas de Now en ROADMAP.md sin ✅, con su id y el emoji de su estado, o «Nada pendiente».` El estado va como el emoji literal, no como su nombre; solo cuentan el id y el emoji, los separadores y paréntesis no se evalúan. El paso 2 (`Corre el gate.`) no cambia.
3. **RED primero, y sin RED no hay edición** (constitución, art. 5). Rúbrica por sujeto, mía: el sujeto *omite* si su aviso no nombra, con id y emoji, cada fila de `Now` sin ✅ (o no dice «Nada pendiente» cuando no hay ninguna), o si cuenta `Next`/`Later` o la fila que cierra. El RED *exhibe* con al menos 1 de 4 sujetos que omite (N=2 en c1 y c2); el GREEN pasa con 4 de 4 que no omiten; con 3 de 4 se repite la tanda una vez (cuenta como la de REFACTOR); con menos, se corrige el texto. El RED se mide sobre los escenarios 1 y 4 (los que tienen fila abierta), con el prompt de cierre sin mencionar lo pendiente: que omitan es lo esperado, y el RED limpio ocurre si el sujeto la nombra por sí solo. Con el RED limpio (0 de 4), el paso 1 no se toca y la feature se cierra con el walkthrough «RED limpio, ticket no reproducido» y la fila en ✅ con esa nota: no se archiva cambio de skill; se conservan la batería completada en la Task 1 y la fila 0028 en ✅ con esa nota.
4. **La batería puede no cubrir el caso**: `battery.md` solo trae id, paso, n y modelo, sin escenarios; no he verificado que c1 o c2 presenten una fila abierta ni un cierre sin pendientes. Por eso la **Task 1 es comprobarlo, antes de gastar el RED** (0 $): c1 y c2 deben cubrir los cuatro escenarios de «Escenarios de aceptación» (la previsión de coste supone dos por fila, c1 los 1 y 2, c2 los 3 y 4). Los roadmaps de cada escenario son fixtures sintéticos en `tests/batteries/aviso-cierre/fixtures/<escenario>.ROADMAP.md` (ruta mía) y no incluyen la fila 0028. Si falta cobertura se añaden filas o fixtures y **la previsión se rehace con `plan.mjs` sobre los ids reales y vuelve al dev-lead como enmienda antes del primer sujeto**: la tabla de abajo vale solo si la batería ya basta. En `plan.mjs`, `N` sustituye a la `n` de la fila, no se multiplican.
5. **Previsión de coste con el comando de `operations.md`**, que fija 0,70 $ por sujeto y es el que rige como tope; el patch 0006 midió ~0,31 $ por sujeto en esta batería, solo como referencia. El tope de 9,80 $ **incluye** la tanda de REFACTOR y la de «Medición tras la revisión final» (2 sujetos que repiten la medida tras los fixes de esa revisión; es la fila de la plantilla, no una tanda nueva). **Minutos: bloqueo, no dispensa.** El art. 5 los exige antes del primer sujeto y ninguna fuente del proyecto da minutos por sujeto; no invento una cifra. Necesito del dev-lead una cota en este gate (minutos por sujeto o por tanda); sin ella no se lanza ningún sujeto, aunque la spec se apruebe. El dev-lead es la misma persona que desarrolla (`PRODUCT.md`: no hay más), así que esta decisión y la de los estados son suyas y no una autoaprobación mía.
6. **Sin fila de roadmap**: la 0028 solo existe como rama (`sdd id claim`: «la 0028 vale (contador local)», sin remoto). La fila en `Now` de `ROADMAP.md` entra en el Scope y se añade en el commit de apertura del plan.
7. **Sin delta ni topes de palabras**: no hay capacidad que tocar, y el proyecto no tiene test que limite palabras de la skill.
8. **Carril**: feature en modo full. Es edición de una skill, así que la constitución exige RED → GREEN; 2 o 3 tasks previstas, no se parte ni hay secciones de diseño.
9. **Enfoque**: una sola línea en el paso 1 (A), frente a un paso nuevo entre el 1 y el 2 (B) y a una lista fija en un fichero aparte (C) — ver Approach.
- Política de modelos: revisor de la spec en sonnet, uno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería: sonnet, por tandas de c1 y c2 con N=2 · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Decisiones tomadas con el dev-lead

- Qué cambia: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»

### Hallazgos de la review

Ronda 1 (un revisor, sonnet):
- **Aceptado** (Crítico) — el RED puede salir limpio por no cubrir la batería el caso → decisión 4: Task 1 de comprobación antes del RED, y la batería completada dentro del Scope.
- **Aceptado** (Crítico) — sin escenarios GIVEN/WHEN/THEN → sección «Escenarios de aceptación» con cuatro.
- **Aceptado** — umbral del GREEN y rúbrica por sujeto → decisión 3.
- **Aceptado, a medias** — conjunto de estados no validado → decisión 1 lo marca «sin validar» para este gate; `ROADMAP.md` está en la raíz. No lo trato como bloqueo previo: el gate es donde lo valida el dev-lead.
- **Aceptado, a medias** — minutos sin prever → decisión 5, dispensa pedida en el gate; REFACTOR incluido en el tope.
- **Aceptado** — fila de roadmap fuera del Scope → Scope y tabla de lo que cambia.
- **Aceptado** — cierre con RED limpio sin definir → decisión 3.
- **Aceptado** — emoji o nombre del estado → decisión 2: emoji literal.
- **Aceptado** (parcial) — segunda cita no era una decisión → quitada. **Rechazado** lo de «cabecera con dos revisores»: la cabecera dice un revisor.
- **Aceptado** — qué valor rige como tope → decisión 5: 0,70 $.
Ronda 2 (un revisor, sonnet):
- **Aceptado** (Crítico) — cuatro escenarios y dos filas, coste falso si se añaden filas → decisión 4: mapa escenarios→filas, fixtures, y la previsión se rehace como enmienda antes del primer sujeto; `N` sustituye a `n`.
- **Aceptado** (Crítico) — el art. 5 no prevé dispensa → decisión 5: la dispensa se retira; los minutos son un bloqueo que cierra el dev-lead con una cota en el gate. No lo resuelvo yo ni lo doy por resuelto.
- **Aceptado** — fila que cierra incoherente entre escenarios → se excluye por id; en los GIVEN va 🔄.
- **Aceptado** — el literal del paso no decía «las demás» ni `ROADMAP.md` → decisión 2.
- **Aceptado** — formato del ejemplo → unificado «0006 ⏳, 0008 🔄»; solo cuentan id y emoji.
- **Aceptado** — RED tautológico y GREEN sin margen → decisión 3: RED sobre escenarios con fila abierta, GREEN 4 de 4 con repetición a 3 de 4.
- **Aceptado** — estados y roadmap sintético → decisión 1 (conjunto cerrado del kit) y decisión 4 (fixtures).
- **Aceptado** — medición tras revisión final sin justificar → decisión 5.
- **Aceptado** — qué se conserva con RED limpio → decisión 3.
- **Aceptado** — `node --test` y «dev-lead» = misma persona → «Dónde se prueba» y decisión 5.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta; el coste fue una parada del dev-lead (ticket de campo, §1). Se quiere que el aviso del paso 1 diga también qué queda pendiente. Éxito: en los sujetos de cierre con otra fila abierta en `Now`, el aviso la nombra con su id y su estado, y en los que no tienen ninguna dice «Nada pendiente». Fracaso aunque «funcione»: un aviso que enumere `Next` y `Later` y tape lo abierto, o que cambie el paso 2 (el gate).

## Scope

- Entra: la spec, la comprobación previa de que c1 y c2 cubren los escenarios de abajo, el RED y el GREEN de `aviso-cierre` con la batería `tests/batteries/aviso-cierre/battery.md` (c1 y c2).
- Entra: la fila 0028 en `Now` de `ROADMAP.md`, en el commit de apertura del plan.
- Entra, si la comprobación previa lo exige: completar la batería y sus fixtures de roadmap (`tests/batteries/aviso-cierre/fixtures/`) con los escenarios que falten.
- Entra, si el RED lo exhibe: el texto del paso 1 de `skills/aviso-cierre/SKILL.md` (ticket sin medir, aunque sea todo el cambio).
- No entra: el paso 2 (`Corre el gate.`), el `description` de la skill, `PRODUCT.md` y los gates de `operations.md`; el estado de `Next` y `Later`; mover el aviso a otra skill; cambiar la batería más allá de añadir los escenarios que falten (decisión 4).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1 `Di qué se cierra.` → `Di qué se cierra y qué queda pendiente: …` | `skills/aviso-cierre/SKILL.md:8` | Scope («si el RED lo exhibe»), decisión 2 |
| Fila 0028 inexistente en `Now` | `ROADMAP.md` | Scope, decisión 6 |
| Nombre de la skill y su coste por sujeto (~0,70 $) | `.docs/sdd/steering/operations.md:16` | sin cambio: no se retira nada; si la medición cambia el coste real, lo decide el dev-lead tras el cierre |

- Filas que implementa: ninguna (la 0028 no tiene fila, decisión 6) → nada que actualizar: comprobado con `git grep -niE "0028|close-notice" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!tests/*.md'` (sin resultados). Búsqueda de lo que cambia: `git grep -niE "aviso-cierre|aviso de cierre|qué se cierra|Di qué"` → solo los dos sitios de la tabla.

## Approach

- A. Ampliar el paso 1 con la cláusula de lo pendiente — una línea; la skill sigue con dos pasos y el gate no se mueve.
- B. Paso nuevo entre el 1 y el 2 — separa los dos avisos, pero renumera el gate y alarga una skill de dos líneas por una cláusula.
- C. Lista de «pendiente» en un fichero aparte — peor aquí: la fuente ya es `ROADMAP.md` y duplicarla da una segunda verdad.
- Elegido: A — es lo que dijo el dev-lead («el paso 1 … dice también qué queda pendiente»); B y C no encajan con eso.

Qué es «pendiente» y el texto literal: decisiones 1 y 2. Nada más se fija: cómo se renderiza la lista dentro del aviso lo deja el texto del paso.

## Escenarios de aceptación

Criterio de cada sujeto de cierre (el roadmap de entrada y lo que debe aparecer en el aviso; el aviso nombra la fila con su id y el emoji):

- GIVEN `Now` con 0005 🔄 (la que se cierra), 0006 ⏳ y 0008 🔄 · WHEN se cierra la 0005 · THEN el aviso dice que se cierra la 0005 y que queda pendiente «0006 ⏳, 0008 🔄».
- GIVEN `Now` con la 0005 🔄 (la que se cierra) como única fila no ✅ · WHEN se cierra · THEN el aviso dice «Nada pendiente».
- GIVEN `Now` con la 0005 🔄 (la que se cierra) y el resto en ✅, y filas ⏳ en `Next` y `Later` · WHEN se cierra · THEN el aviso dice «Nada pendiente» y no nombra ninguna fila de `Next` ni de `Later`.
- GIVEN `Now` con la 0005 🔄 (la que se cierra) y 0007 ⏸️ · WHEN se cierra la 0005 · THEN el aviso nombra «0007 ⏸️» y no repite la 0005 como pendiente.

## Dónde se prueba

- Que el aviso nombra lo pendiente: los cuatro escenarios de arriba, con sujetos de la batería `aviso-cierre` (c1 y c2, completada si hace falta), como el patch 0006 (`.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md`); RED con el texto de hoy, GREEN con el de la decisión 2.
- Que `node --test && node scripts/lint.mjs` (gate de cierre) sigue en verde: tras cada task.
- Que el gate sigue en el paso 2: lectura del diff del `SKILL.md` en la revisión final, no con sujetos.

## Términos y ADR

- Términos resueltos: pendiente — fila de `Now` sin ✅ distinta de la que se cierra.
- ADR candidatas: ninguna.

## Previsión de coste

Comando de `operations.md`: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`. Si la prueba supera la suma, una tanda de REFACTOR incluida, se para y decide el dev-lead (constitución, art. 5). Minutos: `sin medir` (decisión 5).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Controles | 0 sujetos: la batería no tiene filas de control (solo c1 y c2) | 0.00 |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1.40 |
| Suma | 14 sujetos | 9.80 |

Si el RED sale limpio (decisión 3), solo se gasta esa tanda: 2,80 $.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
