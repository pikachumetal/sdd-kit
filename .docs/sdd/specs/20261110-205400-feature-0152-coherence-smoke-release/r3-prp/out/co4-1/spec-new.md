---
id: 20261111-192352-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra: «Cierro motivo al cancelar». Con este cambio dirá además qué queda sin hacer, leyéndolo de la spec y la fila del roadmap de esa feature: «Cierro motivo al cancelar. Pendiente: el listado de canceladas aún no enseña el motivo», o «nada pendiente» si lo prometido está entregado (ejemplo inventado). Es una frase del paso 1 de `skills/aviso-cierre/SKILL.md`; como toda edición de skill, la prueban sujetos en RED y GREEN (~8,40 $ y ~12 min como tope).

Validación: dev-lead — es el texto de una skill que lee un agente al cerrar; solo una persona juzga si el aviso con lo pendiente se entiende.

## Capacidades

- Ninguna, porque herramientas (el proyecto no tiene `capabilities/`; el cambio edita el texto de una skill).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin contrato público, `MODIFIED`, datos ni dependencias; sin delta) · tamaño: ~2 líneas en 1 fichero
- Único (sonnet): si el nuevo literal del paso 1 cubre los dos casos que prueba la batería (con pendientes, sin pendientes) y si la previsión de coste de esta spec cuadra con `operations.md` (señal: edición de skill, regla 5 de la constitución)
- Mínimo razonable: sin review — deja sin mirar si «pendiente» tiene una sola lectura para el agente que cierra

1. Literal del paso 1: `1. Di qué se cierra y qué queda pendiente: lo que la spec o la fila del roadmap de esta feature prometían y no se entregó, o «nada pendiente».` — el dev-lead fijó que el paso 1 diga también lo pendiente, no el texto: el literal es mío. Lleva dentro la definición y la fuente para que el agente que cierra no invente pendientes ni omita el aviso.
2. «Pendiente» = lo que la spec o la fila del roadmap de la feature prometían y no se entregó. Lo ya cerrado antes no cuenta. Nadie definió el término: **pendiente de que lo valides**. La skill no consulta nada por script: el agente lo lee de esa spec y esa fila (`ROADMAP.md` existe en este proyecto; sin fila, solo la spec). «Entregado» = lo que dicen las tasks cerradas de la feature y su walkthrough; el literal no lo repite para quedarse en una línea, y si el RED muestra que hace falta se amplía en REFACTOR. La `description` de la skill («Usar al cerrar una feature.») sigue valiendo: el disparador no cambia.
3. Los pasos 2 en adelante no cambian: el aviso sigue siendo el paso 1 y «Corre el gate» el 2.
4. Enfoque: A (editar el paso 1) frente a B (añadir un paso nuevo «Di qué queda pendiente») y C (una sección aparte de la skill); ver Approach.
5. Los escenarios de la batería `aviso-cierre` no tienen descripción en el repo (solo la tabla Id/Paso/n/Modelo). Supongo c1 = cierre con algo pendiente y c2 = cierre sin nada pendiente, con el criterio de «Dónde se prueba». **Sin medir**: la primera task del plan los describe en `battery.md` antes del RED; si c1 y c2 ya probaban otra cosa, se redefinen o se añaden escenarios y la previsión se rehace.
6. Previsión de coste: la de «Previsión de coste», con 0,70 $ por sujeto de `operations.md` y `scripts/plan.mjs` (no el ~0,31 $ medido en el patch 0006): la previsión es un tope. Los minutos son estimación mía, **sin medir**: no hay medida previa de tiempo por sujeto.
7. Sin `§Frontend`, sin capacidad nueva, sin topes de palabras (ningún test los fija en este proyecto) y sin `Se valida en:` (todo se ve desde la rama).
8. Repaso de coherencia: `git grep` de «qué se cierra», `aviso-cierre` y `0016` fuera de `.docs/sdd/specs/` y `.docs/sdd/changes/`: el literal solo está en `skills/aviso-cierre/SKILL.md:8`. La delta en una copia no aplica: no hay delta que fusionar.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de RED/GREEN en Sonnet, por tandas de 4 · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — Crítico: «4 de 4» no cuadra con N=2 → el éxito pasa a 2 de 2 por escenario; c1 y c2 se describen en `battery.md` antes del RED (Scope, decisión 5).
- **Aceptado** — Crítico: sin escenarios GIVEN/WHEN/THEN y c2 podía pasar sin el cambio → c1 y c2 con GIVEN/WHEN/THEN en «Dónde se prueba» y el RED debe fallar con el texto actual.
- **Aceptado** — Importante: faltaban los minutos (constitución, regla 5) → columna de minutos, estimada y marcada sin medir (decisión 6).
- **Aceptado** — Importante: la definición de «pendiente» no estaba en el literal → ahora el literal la lleva y nombra la fuente; la decisión 2 queda «pendiente de que lo valides».
- **Aceptado** — Importante: el Scope contradecía el Intent sobre la fuente → el agente lee la spec y la fila del roadmap, sin script (decisión 2, Scope).
- **Aceptado** — Menor: precio por sujeto sin justificar → la decisión 6 lo cita y lo declara tope.
- **Aceptado** — Menor: ejemplo con filas y términos ajenos → ejemplo sin ids, inventado y marcado como tal; la cancelación es la del cliente, coherente con `PRODUCT.md`.
- **Aceptado** — Menor: edición condicional de la batería → listada en «Entra» y en la tabla de lo que cambia de forma.

### Hallazgos de la segunda ronda

- **Aceptado** — Crítico: c1 y c2 sin fixtures → Scope «Entra» y decisión 5 los incluyen, inventados y bajo `tests/batteries/aviso-cierre/`.
- **Aceptado** — Crítico: c2 sin criterio exacto → c2 pasa solo con la cadena «nada pendiente», que el literal impone. **Rechazado** su escenario negativo aparte: c2 ya comprueba que no se inventan pendientes (el sujeto no tiene nada que inventar).
- **Aceptado** — Importante: c1 podía pasar en el RED → el RED debe fallar en c1 y c2 y «nombrar» se define como una frase que alude a lo prometido y no entregado. **Rechazado** exigir la marca «Pendiente:»: el literal no la impone.
- **Aceptado** — Importante: minutos sin base → tope provisional; se mide el del primer RED. Los fixtures van dentro de los 0,70 $.
- **Aceptado** — Importante: fixtures fuera del Scope y roadmap sin verificar → en «Entra»; `ROADMAP.md` existe y, sin fila, solo la spec (decisión 2).
- **Aceptado** — Importante: fuente de «entregado» → tasks cerradas y walkthrough, en la decisión 2; no va en el literal.
- **Aceptado** — Menor: grep sobre `specs/` → solo `patch-0006-aviso/patch.md` (evidencia de coste), no cita el literal; «nada» se mantiene.
- **Aceptado** — Menor: 2 de 2 sin tolerancia → un fallo aislado en GREEN va a REFACTOR, dentro del tope.
- **Aceptado** — Menor: `description` → anotada en la decisión 2.

Sin tercera ronda (el kit la prohíbe).

### Decisiones tomadas con el dev-lead

- La spec nace de «decidido con el dev-lead: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente».

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra.» y quien lee el aviso no sabe si el cierre deja algo suelto. Importa porque lo pendiente se pierde al cerrar la sesión. Queremos que el aviso diga siempre las dos cosas. Éxito: en 2 de 2 sujetos de c1 el aviso nombra lo pendiente; en 2 de 2 de c2 dice «nada pendiente». Fracaso aunque funcione: que el agente invente pendientes donde no hay, o que c2 pase con el texto actual porque el sujeto lo dice por su cuenta (ver «Dónde se prueba»).

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` con el literal de la decisión 1; la prueba con sujetos (RED y GREEN) de c1 y c2; describir c1 y c2 en `tests/batteries/aviso-cierre/battery.md` antes del RED, con su fixture inventado (spec, fila de roadmap y estado de entrega de una feature ficticia) en `tests/batteries/aviso-cierre/` (sin cambiar sus ids, n ni modelo, así que la previsión no cambia, con los fixtures dentro de los 0,70 $ por sujeto; si hubiera que añadir escenarios, se rehace).
- No entra: el paso 2 («Corre el gate»), la `description` de la skill y que la skill calcule lo pendiente por script (el agente lo lee de la spec y la fila del roadmap).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea del paso 1: `1. Di qué se cierra.` | `skills/aviso-cierre/SKILL.md:8` | Scope: se sustituye por el literal de la decisión 1 |
| Forma de c1 y c2 (hoy solo ids) | `tests/batteries/aviso-cierre/battery.md:3-6` | Scope: se describen antes del RED |

- Filas que implementa: nada: comprobado con `git grep -niE "qué se cierra|aviso-cierre|0016" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'` (otros sitios que nombran la skill: `operations.md:16` y `tests/batteries/aviso-cierre/battery.md:1`, ninguno cita el literal).

## Approach

- A. Editar el paso 1 — una línea, sin pasos nuevos; la numeración y el paso 2 no cambian; el riesgo es que el agente lea «pendiente» sin criterio (decisión 2).
- B. Añadir un paso nuevo «Di qué queda pendiente» entre 1 y 2 — renumera «Corre el gate» a 3 y alarga una skill de dos pasos sin necesidad.
- C. Una sección de «Qué es pendiente» con casos — define el término mejor, pero es más texto del que decidió el dev-lead.
- Elegido: A — lo decidió el dev-lead: «el paso 1 dice también qué queda pendiente»; la definición breve de «pendiente» va en la decisión 2 y, si el RED muestra que no basta, se amplía en REFACTOR.

## Dónde se prueba

- El aviso con pendientes y sin pendientes: con sujetos Sonnet que cierran una feature con la skill, escenarios c1 y c2 de `tests/batteries/aviso-cierre/battery.md`, como los RED/GREEN del patch 0006; sin tests de código (`node --test` no ejecuta la skill).
- **c1** — GIVEN una feature cuya spec promete dos cosas y solo una está entregada · WHEN el sujeto cierra con la skill · THEN el aviso nombra la que falta (p. ej. «el listado de canceladas aún no enseña el motivo»).
- **c2** — GIVEN una feature con todo lo prometido entregado · WHEN el sujeto cierra con la skill · THEN el aviso dice literalmente «nada pendiente» y no inventa pendientes.
- **Criterio comprobable**: c1 pasa si el aviso trae una frase que alude a lo prometido y no entregado; c2 pasa solo con la cadena exacta «nada pendiente» (el literal la impone) y sin pendientes inventados (por eso c2 ya cubre el caso negativo).
- **El RED debe fallar con el texto actual**: c1 y c2 solo valen si fallan hoy. Si un sujeto cumple c1 o c2 con el texto actual, el escenario no discrimina y se redefine antes del GREEN.
- Un fallo aislado en GREEN va a la tanda de REFACTOR, ya incluida en el tope.

## Términos y ADR

- Términos resueltos: pendiente — lo que la spec o la fila del roadmap de la feature prometían y no se entregó (decisión 2).
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: el proyecto no tiene `capabilities/` y el cambio edita el texto de una skill.

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Minutos (sin medir) |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~4 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~4 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~4 |
| Controles | 0 sujetos — la skill no tiene hermanas ni controles negativos en la batería | 0.00 | 0 |
| Medición tras la revisión final | 0 sujetos — la revisión final no edita la skill; si la edita, se para y decide el dev-lead | 0.00 | 0 |
| Suma | 12 sujetos | 8.40 | ~12 |

El tope de minutos es provisional: se mide el del primer RED antes de seguir. Si la prueba supera 8,40 $ o el tope de minutos medido, se para y decide el dev-lead (constitución, regla 5).

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
