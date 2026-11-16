---
id: 20261115-200827-feature-0028-aviso-pendiente
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra: «Cierro la 0007, la cancelación por día». Con este cambio dirá además qué sigue abierto en Now del roadmap (ids de ejemplo, ilustrativos): «Cierro la 0007, la cancelación por día. Queda pendiente: 0010 Motivo al cancelar, 0011 Anular reservas de otros», o «Nada pendiente» si no queda nada. Así quien cierra no se entera por casualidad de que había una fila abierta. Se toca una sola línea de `skills/aviso-cierre/SKILL.md`, y solo si la prueba con sujetos muestra que hoy el aviso no lo dice.

Validación: agente — el cambio es el texto de una skill que no ve ninguna persona usuaria del producto; lo que cuenta es lo que dicen los sujetos de la batería, y esa medida la toma el agente.

## Capacidades

- Ninguna, porque herramientas (una skill del proyecto; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de las ocho (no hay capacidad, contrato público, `MODIFIED`, datos ni dependencia; área ya leída) · tamaño: ~15 líneas en 1 fichero (`skills/aviso-cierre/SKILL.md`) + 1 fila en `.docs/sdd/steering/operations.md` si cambia el precio
- Único (sonnet, siete puntos): si «lo que queda pendiente» está definido sin ambigüedad en el paso 1 y si el caso del ticket (una fila abierta tras cerrar la 0005) queda cubierto por esa definición (señal: ninguna; lo motiva el tamaño)
- Mínimo razonable: sin review — deja sin mirar si la definición de «pendiente» deja fuera el caso real del ticket, que es lo único que puede salir mal en una línea

1. **Qué es «pendiente»**: las filas de `ROADMAP.md` sección Now con estado distinto de ✅ (id y título), no solo las ligadas a lo que se cierra. Por qué: el ticket no dice cómo estaba ligada la fila abierta de la 0005, y «ligadas» podría dejar fuera justo ese caso. Coste: con varias filas abiertas la línea es más larga. Alternativa descartada: solo las que tienen `Tras` = id cerrado o `parent` suyo. Lo mide el RED.
2. **Texto del paso 1** (literal, sustituido por la decisión 16): `1. Di qué se cierra y qué queda pendiente: «Queda pendiente: <id título>, …» con las filas de Now de ROADMAP.md que no están en ✅, o «Nada pendiente».`
3. **Sin fila: «Nada pendiente»** — literal que dice el aviso cuando no hay filas abiertas; lo decidí yo para que el silencio no se confunda con haberse olvidado de mirar.
4. **El paso 2 («Corre el gate.») no cambia.** No se añade un paso nuevo.
5. **La edición va condicionada al RED** (constitución 5): el ticket es una observación de campo sin medir. Si el RED no exhibe el fallo (los sujetos ya dicen lo pendiente), el cambio no entra y se cierra con la medida.
6. **Previsión de coste**: 16 sujetos y 11,20 $ en el peor caso (RED, repetición del RED, GREEN y una tanda de REFACTOR, 4 sujetos × 0,70 $ cada una), tomada del comando de `operations.md` (`plan.mjs`); sin repetición, 12 sujetos y 8,40 $. `patch.md` de la 0006 cuenta ~0,31 $ por sujeto en la misma batería; sigo `operations.md` porque es lo que el comando calcula. Tiempo ~15 min por tanda de 4 sujetos (supuesto mío, sin medir): ~60 min en el peor caso, ~45 sin repetición. Si la prueba supera 11,20 $, se para y decide el dev-lead (constitución 5).
7. **Enfoque**: A (editar solo el paso 1), frente a B (añadir un paso 3 «Di qué queda») y C (una skill nueva de pendientes); ver Approach.
8. **Sin topes de palabras ni delta**: el proyecto no tiene test de topes de palabras ni `capabilities/`; no se escribe delta. La prueba del delta sobre una copia (`sdd capability merge`) no aplica: no hay delta que fusionar.
9. **Sin `§Frontend`**: no cambia nada que se vea en pantalla.
10. **El caso real del ticket, `sin medir`**: la fila 0005 ya no está en `ROADMAP.md` (hoy Now tiene 0010, 0011, 0008 y 0007 ✅), así que no puedo ejecutar el caso contra la decisión 1; con el Now de hoy, cerrar la 0007 listaría 0010, 0011 y 0008. Lo exhibe el RED.
11. **Fixtures de los escenarios**: `c1` = `ROADMAP.md` con Now de una fila abierta y una ✅ (el caso 0005 del ticket); `c2` = Now sin ninguna fila abierta. Los dos con el Now escrito en el fixture, no el del proyecto. Criterio por sujeto, medido con `grep` sobre el aviso, no a ojo: `c1` contiene el id de la fila abierta y no el de la ✅; `c2` contiene «Nada pendiente». El caso de varias filas abiertas no tiene escenario propio: lo cubre el literal del paso 1. Coste sin cambio: los mismos 2 escenarios × n=2.
12. **Solo Now, y ✅ / no ✅**: Next y Later quedan fuera porque el ticket habla de una fila «abierta» del trabajo en curso y Now es lo que se está haciendo; hoy el Now solo usa `⏳` y `✅`, y cualquier estado que no sea ✅ cuenta como abierto. Si la fila del ticket estaba en Next, la definición la deja fuera y el RED con el fixture de `c1` no lo detecta: el ticket no dice en qué sección estaba (pendiente de que lo diga el dev-lead).
13. **Orden y formato**: las filas en el orden de `ROADMAP.md`, cada una `id título`; el nombre de lo que se cierra se mantiene como hoy. El criterio solo mide el id (decisión 11).
14. **Umbrales**: RED = al menos 1 de los 4 sujetos no nombra lo pendiente; si los 4 ya lo hacen, no se edita. GREEN = 4 de 4. El RED lo decide `c1` (decisión 16). Si sale en 1 de 4, se repite una vez antes de editar (4 sujetos, 2,80 $): está en la previsión de 11,20 $ de la decisión 6.
15. **Nadie más lee el aviso**: `git grep -nE "Nada pendiente|Di qué se cierra" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!.docs/sdd/changes' ':!tests'` da solo `skills/aviso-cierre/SKILL.md:8:1. Di qué se cierra.`; es texto para quien cierra.
16. **Marca literal del aviso** (review, ronda 2): con filas abiertas el aviso las lista tras «Queda pendiente:»; el literal del paso 1 (decisión 2) pasa a nombrarla: `1. Di qué se cierra y qué queda pendiente: «Queda pendiente: <id título>, …» con las filas de Now de ROADMAP.md que no están en ✅, o «Nada pendiente».` El criterio de `c1` exige el literal «Queda pendiente:» seguido del id de la fila abierta, y que el id de la ✅ no aparezca tras él. Decide el RED solo `c1`; `c2` es informativo (un Now vacío puede dar «Nada pendiente» sin leer nada).
17. **Fixtures de la batería**: van en una sección `## Fixtures` bajo la tabla de `battery.md`, como bloques de código y sin filas de tabla de 4 columnas con número, para que `plan.mjs` (que solo cuenta las filas con `n` numérico) siga dando `suma: 4 sujetos · coste previsto: 2.80 $`; se comprueba al escribirlos. Si el RED no exhibe el fallo, los fixtures se quedan: son la medida.
18. **Límite del Intent**: el aviso cubre las filas abiertas de Now, no todo el roadmap (decisión 12); si el dev-lead dice que la fila del ticket estaba en Next o Later, se amplía la definición antes de aprobar.
- Política de modelos: un revisor de spec en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería: por tandas, Sonnet (`battery.md`) · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** (Crítico) — sin fixture, los sujetos pasan a ojo → decisión 11 (fixtures y `grep`), Scope.
- **Aceptado** (Crítico) — el caso de una sola fila no estaba cubierto → `c1` es ese caso (decisión 11).
- **Aceptado** — la batería cambia y el Scope no lo decía → Scope, «Entra».
- **Aceptado** — 8,40 $ frente a ~0,31 $ medido y minutos sin medir → decisión 6 ya explica el desfase; los minutos quedan como supuesto en la previsión; la decisión 14 dice qué se para.
- **Aceptado** — Next/Later y estados → decisión 12.
- **Aceptado** — formato y orden → decisión 13.
- **Aceptado** — umbrales de RED y GREEN → decisión 14; el Intent los repite.
- **Aceptado** — fecha del dev-lead → «Decisiones tomadas con el dev-lead».
- **Aceptado** — salida del grep → tabla de «Lo que se retira».
- **Aceptado** — consumidores del aviso → decisión 15.

Ronda 2 (un revisor, sin tercera ronda):

- **Aceptado** (Crítico) — `c1` pasaba sin la marca de pendiente → decisión 16 (literal «Queda pendiente:»).
- **Aceptado** (Crítico) — el formato del fixture en `battery.md` no estaba dicho → decisión 17 (sección `## Fixtures`; se comprueba que `plan.mjs` sigue dando 4 sujetos y 2,80 $).
- **Aceptado** — RED decidido por `c1`, `c2` informativo → decisión 16.
- **Aceptado** — la repetición del RED rebasaba la previsión → previsión de 11,20 $ en el peor caso (decisión 6 y tabla).
- **Aceptado** — minutos con la repetición → ~60 min, supuesto (decisión 6).
- **Aceptado** — el éxito podía ser verde sin resolver el ticket → Intent y decisión 18 limitan a Now; la sección de la fila del ticket sigue pendiente para el dev-lead.
- **Aceptado** — salida del `git grep` → decisión 15, con exclusión de `changes/`.
- **Aceptado** — contradicción del 🦆 con la decisión 13 → ejemplo unificado.
- **Aceptado** — fixtures sin edición → decisión 17 («se quedan»).
- **Aceptado** — ids del 🦆 → marcados como ilustrativos.

### Decisiones tomadas con el dev-lead

- 2026-11-15 — El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1; el RED aún no se ha medido»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo «Di qué se cierra». Al cerrar la 0005, el aviso dijo qué se cerraba y quien cerraba no supo que quedaba una fila abierta; el coste fue una parada del dev-lead (ticket de campo `20260914-aviso.md` §1). Se quiere que el mismo aviso diga qué queda abierto, y que quien lo lee no tenga que mirar el roadmap para saberlo. Éxito: en los sujetos de `c1` y `c2`, el aviso nombra las filas abiertas de Now (tras «Queda pendiente:») o dice «Nada pendiente» en 4 de 4 sujetos con la skill editada (GREEN), tras haber visto fallar al menos 1 de 4 con la actual (RED); umbrales en la decisión 14. Anti-objetivo: un aviso que enumera cosas que no son filas del roadmap, o que olvida decirlo y no avisa de su silencio.

## Scope

- Entra, si el RED lo exhibe: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente (decisiones 1 a 3).
- Entra: los fixtures de `c1` y `c2` en `tests/batteries/aviso-cierre/battery.md` (decisión 11), sin escenarios nuevos.
- Entra: la prueba con sujetos RED → GREEN (+ una tanda de REFACTOR) de `tests/batteries/aviso-cierre/battery.md`, `c1` y `c2`, y el `walkthrough.md` con las medidas.
- No entra: el paso 2 (el gate), un paso nuevo, otras skills, `ROADMAP.md`, cambios en `scripts/plan.mjs`, avisar de deuda técnica o de otras secciones del roadmap (Next, Later).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1 `1. Di qué se cierra.` | `skills/aviso-cierre/SKILL.md:8` (único sitio: `git grep -nE "Di qué se cierra" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!tests'` solo da `SKILL.md:8`) | Scope, decisión 2 |
| El nombre `aviso-cierre` | `.docs/sdd/steering/operations.md:16` (comando de previsión), `tests/batteries/aviso-cierre/battery.md` | sin cambio: el nombre no cambia |

- Filas que implementa: ninguna (la 0028 no tiene fila en `ROADMAP.md`; la rama está reservada con `sdd id claim`) → nada: comprobado con `git grep -nE "0028" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports'` (sin hallazgos).

## Approach

- A. Editar solo el paso 1 — una frase más en una línea ya existente; no cambia el orden ni el número de pasos, y lo prueban los mismos `c1` y `c2`. Coste: la línea del paso 1 hace dos cosas.
- B. Añadir un paso 3 «Di qué queda» — separa las dos cosas, pero el aviso queda partido en dos momentos y el orden con el gate pasa a importar (¿antes o después del gate?). El ticket pide que el aviso diga las dos cosas, no un paso nuevo.
- C. Una skill nueva de pendientes — para una línea de texto, otra skill con su batería y su coste de sujetos; descartada.
- Elegido: A — el dev-lead decidió que sea el paso 1 («el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»); es además la edición mínima.

Qué lee el agente para saber lo pendiente: `ROADMAP.md`, sección Now, columna Estado (`✅` = hecho; cualquier otro símbolo = abierto, hoy `⏳`).

## Dónde se prueba

- El aviso nombra lo pendiente: con los sujetos de `tests/batteries/aviso-cierre/battery.md` (`c1` y `c2`, paso «cierre», Sonnet), como en la prueba del patch 0006; fixtures y criterio por sujeto en la decisión 11 (`grep` sobre el aviso).
- El resto de la skill (el gate): `node --test && node scripts/lint.mjs`, que no cambia.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el proyecto no tiene `capabilities/` y el cambio es el texto de una skill.

## Previsión de coste

Comando de `operations.md`: `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $`.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Controles | ninguno: la batería no define escenarios de control | 0.00 |
| Medición tras la revisión final | ninguna: la medida del GREEN o del REFACTOR es la final si la revisión no cambia la skill | 0.00 |
| Repetición del RED (solo si el RED sale en 1 de 4) | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Suma (peor caso) | 16 sujetos (~60 min, supuesto sin medir); sin repetición, 12 sujetos y 8.40 $ | 11.20 |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
