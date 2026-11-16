---
id: 20261116-113913-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar la 0005, el aviso solo dijo qué se cerraba y la persona no supo que quedaba una fila abierta: costó una parada del dev-lead. Con el cambio, al cerrar la 0010 el aviso dirá «Se cierra: 0010 Motivo al cancelar» y, debajo, «Queda pendiente: 0011 Anular reservas de otros (🔄) · 0008 Avisos por correo antes de la reserva (⏸️)» (estados del escenario de prueba, no los del roadmap de hoy). Para dar la lista, la skill lee las filas de `Now` de `ROADMAP.md` que no están ✅. Antes de tocar la skill se mide si hoy ya lo dice sin que se lo pidan.

Validación: dev-lead — el aviso lo lee una persona, y la spec no se aprueba por delegación con una frase que nombre `agente`.

## Capacidades

- Ninguna, porque herramientas: es el texto de una skill del kit y el proyecto no tiene `capabilities/`. Sin delta: `sdd capability merge` no aplica.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna contada (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin área sin leer, sin reglas de visibilidad) · tamaño: ~2 líneas de la skill y ~40 de spec en 2 ficheros
- Técnica+dominio (sonnet): si el aviso del escenario «Cierre con filas abiertas» sale solo con lo que la skill dice (la lista de `Now` sin ✅ y sin la fila que se cierra) y si «Entra, si el RED lo exhibe» deja bien dicho qué pasa con un RED limpio (señal: ninguna; Scope pequeño)
- Mínimo razonable: sin revisor — deja sin mirar que el escenario del RED pueda pasar sin la conducta nueva (la lista la escribe el agente por inercia)

1. **«Pendiente» = las filas de la tabla `Now` de `ROADMAP.md` cuyo estado no es ✅**, salvo la que se cierra: cualquier estado distinto de ✅ cuenta (⏳, 🔄, ⏸️, 🧪…). El ticket dice «una fila abierta» y nadie dijo cuáles; `Next` y `Later` quedan fuera porque son planificación sin arrancar, no trabajo a medias.
2. **Literal del aviso**: «Queda pendiente: <id> <título> (<estado>) · <id> <título> (<estado>)», una línea; sin filas, «Queda pendiente: nada». El título es el texto en negrita de la fila, sin su descripción.
3. **Dónde va**: en el paso 1 de `skills/aviso-cierre/SKILL.md`, no en un paso nuevo; es el reparto que dijo el dev-lead (ver más abajo).
4. **Enfoque: A frente a B y C** (ver Approach).
5. **Carpeta**: `.docs/sdd/changes/`, la del kit actual; las specs anteriores del proyecto están en `.docs/sdd/specs/` y no se mueven.
6. **Sin fila en `ROADMAP.md` para la 0028**: la rama `feature/0028-close-notice-pending` la reservó el contador local (sin remoto). Ver decisión 12.
7. **Coste**: la previsión usa el precio de `operations.md` (0,70 $ por sujeto), que es el que fija `scripts/plan.mjs`. El patch 0006 midió ~0,31 $ por sujeto de esta misma batería: la previsión probablemente sobreestima ~2×. Minutos: `sin medir` (el repo no los registra).
8. **Escenarios de la batería**: el repo trae `c1` y `c2` («cierre», n = 2) pero no su texto. `sin medir` si sus GIVEN son los de «Dónde se prueba»; la Task 1 lo comprueba antes del primer sujeto y, si no coinciden, `c3` y `c4` (n = 2; los dos escenarios de «Dónde se prueba», palabra por palabra) **sustituyen** a `c1` y `c2` en `tests/batteries/aviso-cierre/battery.md`. Es una enmienda (toca un fichero que el Scope solo nombra en ese caso), pero el coste no cambia: 12 sujetos, un único tope de 8,40 $.
9. **Formato del aviso**: una sola línea, separador « · », estado con su emoji tal como está en la tabla (⏳, 🔄, ⏸️, 🧪), orden el de la tabla, sin tope de filas (`Now` es corta y el anti-objetivo se cuida dejando `Next` y `Later` fuera), `Now` leída de `ROADMAP.md` en la raíz.
10. **Sin `ROADMAP.md` o sin tabla `Now`**: no entra; el aviso no dice nada nuevo (ver No entra). El ticket no lo cubre.
11. **Criterio**: el RED hace entrar el cambio si **un** sujeto de los 4 no produce el literal con las filas correctas (RED limpio = los 4 sí). El GREEN pasa con 4 de 4; si falla alguno, entra la tanda de REFACTOR prevista y, si sigue sin 4 de 4, se para y decide el dev-lead.
12. **Fila de la 0028 en `ROADMAP.md`**: la apunta el cierre; los escenarios usan un `ROADMAP.md` de fixture y no dependen de ella.
- Política de modelos: revisor de la spec: uno por ronda (dos rondas), sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos: sonnet, una tanda de 4 por fase (`c1` y `c2` juntos) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** (Crítico) — escenarios `c1`/`c2` sin texto en el repo, y GIVEN que quizá no traen → decisión 8: la Task 1 los comprueba antes del primer sujeto; si no coinciden, enmienda con `c3`/`c4` y su coste declarado en la Previsión.
- **Aceptado** (Crítico) — el THEN pasaba sin la conducta nueva → «Dónde se prueba» exige el literal exacto y que no salgan la fila cerrada, la ✅ ni `Later`.
- **Aceptado** — los estados 🔄 ⏸️ 🧪 y ✅ sin ejercitar → el GIVEN de `c1` trae uno de cada.
- **Aceptado** — RED parcial sin criterio → decisión 11 y Scope.
- **Aceptado** — `ROADMAP.md` ausente o sin `Now` → decisión 10, en «No entra».
- **Aceptado** — orden, tope y formato sin regla → decisión 9.
- **Aceptado** — decisiones del cuerpo sin listar (línea única, separador, emoji, ruta) → decisión 9.
- **Aceptado** — coste con `c1`/`c2` que quizá no valen → rango declarado en la Previsión; la sobreestimación ~2× ya está dicha en la decisión 7 y no se ajusta: es el precio que fija `operations.md`.
- **Segunda ronda, aceptado** (3 Críticos) — `c3`/`c4` sin texto y `battery.md` sin declarar → sustituyen a `c1`/`c2` con el texto de «Dónde se prueba» y `battery.md` entra en el Scope solo en ese caso (decisión 8) · estados del 🦆 y de `c1` distintos → unificados, y `c1` dice que sustituye a los del roadmap · `<título>` sin resolver → «Informe mensual de uso», con texto, orden y separador exactos.
- **Segunda ronda, aceptado** — coste ambiguo con `c3`/`c4` → sustituyen, tope único de 8,40 $ · `nada` sin `Now` legible → acotado en el texto previsto, riesgo aceptado sin prueba · criterio del GREEN y del REFACTOR → decisión 11 · edición del `ROADMAP.md` → Scope y decisión 12 · «no ✅» frente a la lista de estados → regla única (todo menos ✅), y `c1` lleva filas con descripción · origen del lint y «una tanda cada vez» → corregidos.
- **Segunda ronda, rechazado en parte** — usar la previsión medida de 0,31 $ y declarar minutos: el precio por sujeto lo fija `operations.md` (0,70 $) y es el tope que firma la constitution 5; los minutos no están registrados en el repo y no los invento: quedan `sin medir`.
- **Aceptado** (Menor) — línea de Validación mal escrita y cita vacía → corregidas.
- **Aceptado** (Menor) — término «pendiente» → en «Términos resueltos»; los ejemplos son filas reales del `ROADMAP.md`, salvo la 0009, inventada y dicha.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»
- El RED aún no se ha medido — «el RED aún no se ha medido»

## Intent

Al cerrar la 0005, el aviso de `aviso-cierre` dijo qué se cerraba y no que quedaba una fila abierta. La persona no lo supo y costó una parada del dev-lead (ticket de campo `20260914-aviso.md` §1). El éxito es que, al cerrar una feature con otras filas abiertas en `Now`, el aviso las nombre sin que nadie pregunte; y que, sin filas abiertas y con `Now` legible, lo diga con «Queda pendiente: nada», para que su ausencia no se confunda con un olvido.

Anti-objetivo: un aviso que enumere todo el roadmap (`Next`, `Later`) y ahogue lo que sí importa en el cierre.

## Scope

- Entra, si el RED lo exhibe: el paso 1 de `skills/aviso-cierre/SKILL.md` dice qué se cierra **y** qué queda pendiente, con el literal de la decisión 2. El ticket no está medido: con el criterio de la decisión 11, si el RED sale limpio (los 4 sujetos ya dan el literal con las filas correctas sin la instrucción), la skill no se edita y el cierre va con un `Ruling:` que lo dice, con la tanda; si falla uno solo, entra. Entra también, solo si la Task 1 lo exige (decisión 8): `tests/batteries/aviso-cierre/battery.md` con `c3` y `c4` en lugar de `c1` y `c2`. El cierre añade la fila de la 0028 a `ROADMAP.md` (decisión 12).
- No entra: tocar el paso 2 (el gate); leer `Next` o `Later`; el caso de `ROADMAP.md` ausente o sin tabla `Now` (decisión 10: riesgo aceptado, sin cobertura de prueba, y «nada» solo vale con `Now` legible); mirar el estado de los tests o de ramas para decidir qué está pendiente; el ticket §2 y siguientes si los hubiera; mover las specs de `.docs/sdd/specs/`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea «Di qué se cierra.» → «Di qué se cierra y qué queda pendiente: …» | `skills/aviso-cierre/SKILL.md:8` | Scope (entra, si el RED lo exhibe) |

- Filas que implementa: nada: comprobado con `git grep -n "0028\|Queda pendiente"` (sin resultados fuera de `field-reports/`). Otros sitios del literal, `git grep -niE "qué se cierra"`: solo la línea 8 de la skill; `operations.md` y la batería nombran la skill, no su texto.

## Approach

- A — ampliar el paso 1 con la instrucción de listar las filas abiertas de `Now`: una línea más en la skill; depende de que el agente lea `ROADMAP.md`, que ya lee al cerrar.
- B — un paso nuevo («2. Di qué queda pendiente») y el gate pasa a 3: separa las dos cosas, pero desplaza «Corre el gate» y el aviso queda en dos mensajes.
- C — que lo calcule un script y la skill lo pegue: lista exacta, pero un script nuevo en un proyecto sin dependencias para dos líneas de texto.
- Elegido: A — lo fijó el dev-lead: «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».

Texto previsto del paso 1 (decisión 1 y 2): «Di qué se cierra y qué queda pendiente: las filas de `Now` en `ROADMAP.md` que no están ✅, salvo la que se cierra, como «Queda pendiente: <id> <título> (<estado>) · …»; sin ninguna, y solo con `Now` legible, «Queda pendiente: nada».» El texto definitivo lo fija el GREEN con lo que el RED muestre fallar.

## Dónde se prueba

- Cierre con filas abiertas (`c1`, a confirmar en la Task 1): batería `aviso-cierre`, sujetos Sonnet (constitution 5). GIVEN un `ROADMAP.md` de fixture, con filas que llevan descripción tras el título, y `Now`: 0010 🔄 (la que se cierra), 0011 🔄, 0008 ⏸️, 0009 «Informe mensual de uso» 🧪, 0007 ✅, y 0004 ⏳ en `Later` → WHEN se cierra la 0010 → THEN el aviso incluye, con ese texto, orden y separador, «Queda pendiente: 0011 Anular reservas de otros (🔄) · 0008 Avisos por correo antes de la reserva (⏸️) · 0009 Informe mensual de uso (🧪)» sin las descripciones, y no nombra en esa línea la 0010, ni la 0007 ✅, ni la 0004 de `Later`. Los estados de la fixture sustituyen a los del `ROADMAP.md` actual; la 0009 es una fila inventada, y las demás toman su título del roadmap real.
- Cierre sin filas abiertas (`c2`, a confirmar): GIVEN `Now` con la 0010 abierta y el resto ✅ → WHEN se cierra la 0010 → THEN el aviso dice «Queda pendiente: nada».
- Gate: sigue siendo el de cierre de `operations.md` (`node --test && node scripts/lint.mjs`; la constitution fija `node --test` entero y `operations.md` le añade el lint); no cambia.

## Términos y ADR

- Términos resueltos: **pendiente** (en el aviso de cierre) — fila de `Now` en `ROADMAP.md` que no está ✅ y no es la que se cierra
- ADR candidatas: ninguna

## Topes de palabras

No aplica: ningún test del proyecto limita en palabras los ficheros que edita.

## Previsión de coste

Constitution 5: si la prueba supera esta previsión, una tanda de REFACTOR incluida, se para y decide el dev-lead. Minutos: `sin medir`.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Controles | ninguno: no hay escenario de control en la batería | 0 |
| Medición tras la revisión final | ninguna: la tanda GREEN es la medición | 0 |
| Suma | 12 sujetos | 8,40 |

Tope único: 8,40 $ (12 sujetos). Si `c3` y `c4` sustituyen a `c1` y `c2` (decisión 8), la tanda sigue siendo de 4 sujetos y el tope no cambia.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
