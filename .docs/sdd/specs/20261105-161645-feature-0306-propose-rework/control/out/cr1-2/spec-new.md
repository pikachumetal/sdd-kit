---
id: 20261106-101706-feature-0028-close-notice-pending
feature: 0028
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

🦆 Hoy, al cerrar una feature, el aviso dice solo qué se cierra: al cerrar la 0005 nadie supo que la 0010 seguía abierta, y el dev-lead tuvo que parar a preguntarlo. Con este cambio el aviso añade una segunda parte: «Queda abierto: 0010 · Motivo al cancelar, 0011 · Anular reservas de otros». La skill `aviso-cierre` lo conseguiría con una cláusula más en su paso 1, y solo se edita si el RED demuestra que hoy falla.

Validación: dev-lead — es el texto que lee quien cierra la feature; el agente no se concede `agente` sin una frase del dev-lead que lo nombre.

## Capacidades

- Ninguna, porque herramientas (una skill del propio proyecto; no cambia lo que ve ni puede hacer quien reserva salas).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (Sonnet), siete puntos — señales: ninguna de las ocho (sin capacidad, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin roles) · tamaño: ~1 línea en 1 fichero (`SKILL.md`) más esta spec
- Revisor único (sonnet): si «Entra, si el RED lo exhibe» deja la edición sujeta a la Constitución art. 5, y si el THEN de «Dónde se prueba» distingue c1 de c2 (señal: tamaño)
- Mínimo razonable: sin revisor — deja sin mirar si el literal del paso 1 contradice el §1 del ticket, que es justo lo que la 0005 sufrió

1. **Enfoque (decisión central)**: se edita el paso 1 de `skills/aviso-cierre/SKILL.md` en el sitio, con una cláusula; el paso 2 («Corre el gate») no cambia. Descartados: un paso nuevo «Di qué queda pendiente» (lo decidió el dev-lead: va en el paso 1) y dejar que la persona lo pregunte (es el coste del ticket). Otro enfoque posible, leer lo pendiente del `tasks.md` de la feature, no cubre el caso del ticket (una fila de otra feature) ni sale más barato. Que la skill lea el roadmap al cerrar lo da por hecho el ticket (§1), pero el paso 1 actual no lo dice: si el RED muestra que el sujeto no lo lee, la cláusula lo nombra, y sigue siendo una cláusula del mismo paso.
2. **Qué cuenta como «pendiente»**: las filas de `.docs/sdd/roadmap.md` que siguen abiertas tras el cierre —`⏳`, `🔄 en curso`, `⏸️ aparcada` o `🧪 validación diferida`—, cada una con su id y su título, **sin la fila de la propia feature que se cierra** (sigue en `🔄` hasta archivarse). Lo dijo el ticket como «una fila abierta»; la lista de estados es mía, sale de los estados cerrados del kit (`control-profiles.md`).
3. **Forma del texto**: el paso 1 pasaría a «Di qué se cierra y qué queda pendiente: las filas abiertas del roadmap, con su id; si no queda ninguna, dilo.». Lo fijo es el criterio: id y título de cada fila abierta, y «no queda nada abierto» literal cuando no hay; la redacción exacta es propuesta y el REFACTOR puede cambiarla sin tocar el criterio. Los ids y títulos de los escenarios son inventados: son el fixture de la batería, que lleva su propio roadmap (ficheros nuevos bajo `tests/batteries/aviso-cierre/`, dentro del Scope); no dependen del roadmap vivo. Los del 🦆 son un ejemplo ilustrativo.
4. **No hay fila en el roadmap para la 0028**: la rama la trae del dev-lead y `sdd id claim` la dio por buena («sin remoto: la 0028 vale»), pero `roadmap.md` no la tiene. No la añado: no me lo han pedido. Lo digo para que decidas si la apuntamos al cerrar.
5. **Cobertura de la batería**: `tests/batteries/aviso-cierre/battery.md` solo lista `c1` y `c2` (2 sujetos cada una, Sonnet), sin el escenario de cada una, y no sé qué fijan hoy. Decisión: **antes del RED** el plan lee la batería; si c1 o c2 no cubren los dos primeros escenarios de abajo, se reasigna su contenido y se añade su fixture de roadmap (entra en el Scope, sin edición de `SKILL.md`; mismos 4 sujetos, mismo coste). La asignación c1/c2 de «Dónde se prueba» es la meta tras ese paso, no el estado de hoy.
6. **Criterio de RED y GREEN**: RED exhibido = al menos 1 de los 4 sujetos no cumple el THEN de su escenario; GREEN = los 4 lo cumplen. Cumplir = el mensaje del sujeto lleva, literales, los ids y títulos de las filas abiertas y ninguna otra (escenario 1) o «no queda nada abierto» (escenario 2). El umbral es mío: con 2 sujetos por escenario no hay estadística, solo una señal.
7. **Si el RED sale verde** (los 4 sujetos ya nombran lo pendiente): no se edita la skill, la feature se cierra sin cambio y lo decide el dev-lead; la spec habría cumplido su objeto, que es medir el ticket. La regla «no se edita nada» es de `SKILL.md`: la batería reasignada del punto 5 sí queda.
8. **Previsión de coste**: 4 sujetos por tanda (c1 y c2 × 2) a ~0,70 $ por sujeto, el precio de `tech-stack.md`. El parche 0006 midió ~0,31 $ por sujeto; uso el mayor porque es el que declara el proyecto. Minutos: ~6 por tanda, `sin medir` (suposición mía; no hay medida de `aviso-cierre`). Topes que paran el trabajo: 8,40 $ y ~18 min en total, con una única tanda de REFACTOR, que un GREEN fallido antes de ella consume. Camino corto (RED en verde): 2,80 $ y ~6 min.
9. **Controles y medición posterior a cero**: sin controles, porque este cambio no toca otra skill; sin medición tras la revisión final, porque la tanda de REFACTOR ya mide el texto que queda.
10. **Sin topes de palabras**: `git grep` de «palabras» y «word» no encuentra un test que limite `SKILL.md` (hoy 21 palabras); la sección de topes no aplica.
11. **Delta sobre una copia**: no aplica, no hay delta.
- Política de modelos: un revisor de la spec en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, sin eje de Arquitectura (no hay `architecture.md`) · sujetos de la batería en Sonnet, en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Segunda ronda (un revisor, Sonnet; sin Críticos, sin tercera ronda):

- **Aceptado** — orden circular de la batería y regla del RED verde → decisión 5 (antes del RED, siempre en el Scope) y decisión 7.
- **Aceptado** — fixture y lectura del roadmap sin respaldo → Scope, decisión 1 (el paso 1 no dice que lea el roadmap; si el RED lo muestra, la cláusula lo nombra) y decisión 3.
- **Aceptado** — sin criterio de paso → decisión 6 (umbral mío).
- **Aceptado** — tercer escenario sin WHEN y `🔄` sin cubrir → escenarios.
- **Aceptado** — asignación c1/c2 como hecho → decisión 5 (es la meta) · coste del camino corto → decisión 8 · Intent con id y título · gate citado de `operations.md`.
- **Rechazado** — «dev-lead» frente a la misión: es el término del usuario y de todas las decisiones; no lo redefino. La pregunta de la 0028 en el roadmap (decisión 4) se queda en ✋, donde se valida al aprobar.
- **Aceptado** — «El RED aún no se ha medido» no es una decisión: sale de ese bloque (ya está en el Scope).

Primera ronda (un revisor, Sonnet):

- **Aceptado** (Crítico) — la spec no decía qué pasa si el RED sale verde → decisión 6, Scope y un escenario.
- **Aceptado** (Crítico) — c1 y c2 sin contenido conocido → decisión 5 (el plan lo lee; si no cubren, se reasigna `battery.md`, dentro del Scope).
- **Aceptado** — el escenario partía de una feature sin fila y no comprobaba lo que el Intent llama fracaso → escenarios reescritos sobre la 0005, con filas mezcladas y excluyendo la propia.
- **Aceptado** — la fila propia y cada estado abierto sin cubrir → decisión 2 y los estados `⏸️` y `🧪` en el escenario.
- **Aceptado** — redacción abierta sin criterio → decisión 3 fija el criterio.
- **Aceptado** — frase confusa de «Validación» → reescrita.
- **Rechazado en parte** — `approvers` sigue `TBD`: se rellena al aprobar, con `git config user.name`.
- **Rechazado** — «una sola decisión de review»: el bloque con el mínimo razonable y la línea de política de modelos son formas fijas de la plantilla.
- **Aceptado** — tope de coste fijo (8,40 $ y ~18 min, una tanda de REFACTOR) → decisión 8.
- **Aceptado** — fixture inventado y frase del dev-lead duplicada → decisión 3 y «Decisiones tomadas con el dev-lead» más corta.

### Decisiones tomadas con el dev-lead

- El paso 1 dice también qué queda pendiente (ticket de campo `.docs/sdd/field-reports/20260914-aviso.md` §1) — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra» y nada más: al cerrar la 0005, la persona no supo que quedaba una fila abierta, y el coste fue una parada del dev-lead (ticket de campo, §1). Se quiere que el aviso diga también qué queda pendiente. Éxito: al cerrar con una fila abierta, el aviso la nombra con su id y su título; al cerrar sin ninguna, dice que no queda nada. Fracaso aunque «funcione»: un aviso que enumera todo el roadmap, o que inventa pendientes que no están en él.

## Scope

- Entra, sin condición: nada de `SKILL.md` hasta que el RED se mida (Constitución art. 5): este ticket no se ha medido.
- Entra, si el RED lo exhibe: la cláusula de «qué queda pendiente» en el paso 1 de `skills/aviso-cierre/SKILL.md`.
- Entra, siempre: leer la batería y, si hace falta, reasignar c1 y c2 con su fixture de roadmap, antes del RED (decisión 5).
- Si el RED sale verde: no se edita `SKILL.md` y la feature se cierra sin cambio (decisión 7).
- No entra: el paso 2 («Corre el gate»); otras skills; el contenido del roadmap; añadir la fila de la 0028 al roadmap.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1 «Di qué se cierra.» → «Di qué se cierra y qué queda pendiente: …» | `skills/aviso-cierre/SKILL.md:8` (única aparición; `git grep -n "Di qué se cierra"` fuera de las carpetas de evidencia) | Scope, «si el RED lo exhibe»; decisión 3 |

- Filas que implementa: 0028 → ningún fichero la nombra salvo la rama; no tiene fila en el roadmap (decisión 4): comprobado con `git grep -n "0028"`.

## Approach

Un solo cambio, de una cláusula, en el paso 1 de la skill, tal como decidió el dev-lead. Qué cuenta como pendiente y la forma del texto son decisiones 2 y 3 de ✋. La prueba es la batería existente de la skill, medida antes (RED) y después (GREEN); el texto solo se edita si el RED falla.

## Dónde se prueba

- Aviso con filas abiertas (c1): `tests/batteries/aviso-cierre/battery.md`, como la batería actual, con sujetos Sonnet; el THEN se juzga con el criterio de la decisión 6.
- Aviso sin filas abiertas (c2): la misma batería; el THEN es que el aviso lo dice, sin inventar pendientes.
- Suite y lint del proyecto (`node --test && node scripts/lint.mjs`, el gate de `operations.md`): sin cambios esperados.

Escenarios (sin delta de capacidad; roadmap de la batería inventado):

- GIVEN la 0005 `🔄` (se cierra), la 0010 `⏳` «Motivo al cancelar», la 0013 `🔄 en curso` «Exportar a calendario», la 0011 `⏸️ aparcada` «Anular reservas de otros», la 0012 `🧪 validación diferida` «Avisos por mail» y la 0003 `✅` · WHEN se cierra la 0005 · THEN el aviso nombra «0010 · Motivo al cancelar», «0013 · Exportar a calendario», «0011 · Anular reservas de otros» y «0012 · Avisos por mail» como abiertas, y no nombra la 0003 ni la 0005 como pendientes.
- GIVEN un roadmap donde solo está abierta la fila que se cierra · WHEN se cierra · THEN el aviso dice literalmente «no queda nada abierto» y no inventa pendientes.
- GIVEN la skill sin editar · WHEN se corre el RED (4 sujetos) · THEN, si los 4 cumplen los dos THEN, no se edita `SKILL.md`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (`aviso-cierre`: c1 ×2, c2 ×2) × 0,70 $ (`tech-stack.md`) | 2,80 |
| GREEN | 4 × 0,70 $ | 2,80 |
| Una tanda de REFACTOR | 4 × 0,70 $ | 2,80 |
| Controles | 0 — no se toca otra skill | 0,00 |
| Medición tras la revisión final | 0 — la tanda de REFACTOR mide el texto final | 0,00 |
| Suma | | 8,40 |

Minutos: ~6 por tanda, ~18 en total, `sin medir`. Si la prueba supera esta previsión, una tanda de REFACTOR incluida, se para y decide el dev-lead (Constitución art. 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
