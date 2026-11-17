---
id: 20261108-184239-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra («cierro la 0006: reservas libres»). Con este cambio dice además qué queda pendiente: «cierro la 0006: reservas libres. Pendiente: 0010 (motivo al cancelar) y 0011 (anular reservas de otros)», o algo como «Pendiente: nada» si no queda nada. Es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`; el paso 2 (correr el gate) no cambia. Como toca una skill, la constitución (art. 5) pide probarla con sujetos antes y después: RED, GREEN y una tanda de REFACTOR, ~8,40 $ como techo.

Validación: agente — es un texto de una skill, sin pantalla ni persona que lo use; lo que se observa son las respuestas de los sujetos de la batería, que el agente mide.

## Capacidades

- Ninguna, porque herramientas (el cambio es el texto de una skill; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de la tabla (sin capacidad, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia) · tamaño: ~3 líneas en 1 fichero de skill, más el texto y las aserciones de dos escenarios de la batería
- Técnica + dominio (sonnet): si el texto literal del paso 1 (decisión 1) dice lo mismo que el Intent y si las aserciones de la decisión 4 pueden fallar hoy y pasar con el cambio (señal: edición de skill sin delta)
- Mínimo razonable: sin review — deja sin mirar si «pendiente» es ambiguo para un sujeto que no conoce el roadmap

1. **Texto del paso 1**, literal: «Di qué se cierra y qué queda pendiente.» — el dev-lead dijo «dice también qué queda pendiente»; mantengo la forma imperativa y el tuteo del resto de la skill. El paso 2, «Corre el gate.», no cambia.
2. **Qué es «pendiente»**: lo que el roadmap sigue teniendo abierto y lo que la feature deja sin hacer (filas de «Próximo» sin cerrar y deuda anotada). No lo definí con el dev-lead; la skill no lo define, lo interpreta el sujeto, igual que interpreta «qué se cierra». Si no hay nada pendiente, el sujeto lo dice con cualquier fórmula equivalente («Pendiente: nada», «no queda nada pendiente»): la medición no exige una literal que el texto del paso 1 no pide. Es mi propuesta y un riesgo de la medición: con n=2, si los sujetos lo interpretan distinto, el REFACTOR añade al paso 1 la fuente («según el roadmap»); el formato no se toca. El REFACTOR cubre una sola edición: si hiciera falta otra, se para y decide el dev-lead. Rechazarla ahora significa añadir la fuente ya.
3. **Una sola línea de aviso, no una lista aparte**: el paso 1 sigue siendo un paso; no se añade un paso nuevo ni se renumera el gate.
4. **Dónde se prueba y qué se escribe**: batería `tests/batteries/aviso-cierre/battery.md`, escenarios `c1` y `c2`, n=2, Sonnet, solo esos dos. `battery.md` hoy solo tiene la tabla de ids, sin texto de escenario ni aserciones, y el repo no trae su contenido (`sin medir`). Por eso entra en el Scope escribir el texto de cada escenario con un roadmap de fixture que tenga pendientes reales y conocidos en `c1` y ninguno en `c2`, y sus aserciones (ver Scope). Sin eso, el RED no puede fallar por la razón correcta. Si `c1` y `c2` ya tienen texto fuera del repo, esta spec lo reemplaza y el patch 0006 deja de ser comparable; su ~0,31 $ (decisión 5) queda como contexto, no como base.
5. **Previsión de coste y tiempo** (art. 5): ver la tabla. El techo es el precio de `tech-stack.md` (0,70 $/sujeto); el patch 0006 (`.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md`) anotó ~0,31 $ por sujeto en 4 sujetos, así que lo probable es la mitad. Sin margen: 8,40 $ es la suma exacta del plan, y cualquier tanda extra para y decide el dev-lead (art. 5). «Una tanda de REFACTOR» = una repetición de los 4 sujetos tras tocar el texto de la skill. Minutos: ~10 por tanda, `sin medir`, es un supuesto mío; no hay parada por tiempo, solo por dólares. El REFACTOR solo se gasta si el GREEN falla alguna aserción; si el GREEN pasa, el coste real es 5,60 $.
6. **Sujetos, escenarios y validación**: Sonnet; `c1` y `c2` con n=2 porque la batería ya los fija así; validación `agente` porque lo que se mide son respuestas de sujetos; REFACTOR de 4 sujetos (los mismos).
7. **El gate del art. 2** (`node --test && node scripts/lint.mjs`) se corre al cerrar como siempre; este cambio no añade tests de `node --test`.
8. **Sin ADR, sin términos nuevos y sin capacidad nueva.** «Pendiente» no entra en `PRODUCT.md`.
- Política de modelos: revisor de la spec en sonnet (uno, más una segunda ronda por el Crítico aceptado) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin código) · sujetos de la batería en sonnet, por tandas de 4 · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

1. **Aceptado** (Crítico) — el criterio de éxito no se puede verificar con la batería, que no tiene texto ni aserciones → entra en el Scope escribir el texto de `c1` y `c2` con fixture de pendientes reales y sus aserciones; decisión 4.
2. **Aceptado** — los fracasos del Intent no tenían aserción → aserciones negativas en el Scope (pendientes nombrados existen en el fixture; una sola línea; sin pendientes, «nada»).
3. **Aceptado** — el gate en el paso 2 se prometía sin aserción → entra en el Scope la aserción de que el sujeto corre el gate tras el aviso.
4. **Aceptado** — «pendiente» sin fuente ni formato es riesgo de medición → decisión 2 lo declara y fija cuándo se endurece (REFACTOR).
5. **Aceptado** — el techo no tiene margen y la cifra del 0006 no se citaba → decisión 5 la cita y dice qué es una tanda de REFACTOR.
6. **Aceptado** — minutos sin base → decisión 5 lo declara supuesto sin umbral.
7. **Aceptado** — decisiones sin numerar → decisiones 6 y 7.
8. **Aceptado** — la cita del dev-lead era circular → reescrita abajo.
9. **Rechazado** — aclarar quién aprueba: `mission.md` dice que el proyecto lo usa y desarrolla una sola persona, que es el dev-lead y aprueba el gate; `approvers: TBD` es el campo de la plantilla hasta que se aprueba.
10. **Aceptado** — gate del art. 2 no declarado → decisión 7.

### Hallazgos de la segunda ronda

1. **Aceptado** (Crítico) — «Pendiente: nada» exigido como literal que el paso 1 no induce → cualquier fórmula equivalente en Intent, decisión 2 y aserción (d).
2. **Aceptado** (Crítico) — el RED podía no ser rojo → solo (a) y (d) son el rojo, el resto regresión; si no falla, se para y no se gasta el GREEN («Dónde se prueba»).
3. **Aceptado** — (c) no medible → una sola frase, sin viñetas ni saltos de línea, solo en `c1`.
4. **Aceptado** — fixture sin sitio → en línea en el texto del escenario, en `battery.md`.
5. **Aceptado** — el texto de la batería podía romper `plan.mjs` → fuera de la tabla y comprobación de `4 sujetos · 2.80 $` tras editar.
6. **Aceptado** — REFACTOR de una sola edición y condicional → decisión 2 y 5.
7. **Aceptado** — 0006 no comparable → decisión 4.
8. **Rechazado** (en parte) — la cita del dev-lead es su frase literal de este turno, no de la spec; se mantiene. Minutos: sin parada por tiempo (decisión 5).

### Decisiones tomadas con el dev-lead

- La entrevista ya está hecha y el paso 1 de la skill dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Al cerrar una feature, `aviso-cierre` dice qué se cierra y nada más; quien lee el aviso no sabe qué sigue abierto sin ir al roadmap. Se quiere que el mismo aviso diga también qué queda pendiente. Éxito: en `c1` (hay pendientes en el fixture) el aviso de los 2 sujetos nombra pendientes que existen en el fixture, donde en el RED no lo hace ninguno; en `c2` (no hay pendientes) el aviso de los 2 sujetos dice que no queda nada pendiente, con cualquier fórmula equivalente; en ambos el gate se corre después del aviso. Fracaso aunque funcione: que la skill invente pendientes que el roadmap no tiene, o que el aviso se alargue a una lista que nadie lee.

## Scope

- Entra: el texto del paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 1).
- Entra: en `tests/batteries/aviso-cierre/battery.md`, el texto de `c1` y `c2` y sus aserciones, en secciones fuera de la tabla de ids (la tercera columna de la tabla es lo que `scripts/plan.mjs` cuenta como sujetos; tras editar, `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs …` debe seguir dando `4 sujetos · 2.80 $`). El fixture es el roadmap que el propio texto del escenario entrega al sujeto, en línea, no un fichero nuevo: `c1` con pendientes reales (p. ej. 0010 y 0011 abiertos), `c2` sin ninguno; el sujeto no lee el roadmap real del repo. Aserciones: (a) `c1`: el aviso nombra al menos un pendiente del fixture; (b) `c1`: todo pendiente nombrado está en el fixture; (c) `c1`: los pendientes van en una sola frase, sin viñetas ni saltos de línea; (d) `c2`: el aviso dice que no queda nada pendiente, con cualquier fórmula equivalente; (e) ambos: el sujeto corre el gate después del aviso.
- No entra: el paso 2 (correr el gate), el frontmatter de la skill, `PRODUCT.md`, el roadmap y cualquier otro fichero.
- No entra: definir «pendiente» en la skill antes de la medición (decisión 2).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Texto «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` (único sitio, comprobado con `git grep "qué se cierra"`) | Scope, decisión 1: pasa a «Di qué se cierra y qué queda pendiente.» |

- Filas que implementa: nada: comprobado con `git grep -n "0016" -- . ':!.docs/sdd/specs'` (sin resultados; la 0016 no tiene fila en el roadmap, la reservó la rama).

## Approach

- Una frase más en el paso 1 — cuesta una línea y ninguna renumeración; el sujeto interpreta «pendiente».
- Un paso nuevo entre 1 y 2 («Di qué queda pendiente») — renumera el gate y alarga la skill por una sola frase.
- Definir «pendiente» en la skill (roadmap + deuda) — fija el criterio pero añade texto que el dev-lead no pidió; si la medición muestra que los sujetos lo interpretan distinto, se añade en el REFACTOR.
- Elegido: una frase más en el paso 1 — es lo que dijo el dev-lead y lo menos que lo cumple; la definición solo se añade si la medición la pide.

## Dónde se prueba

- El aviso nombra qué queda pendiente, sin inventar, en una línea, y el gate sigue en el paso 2: batería `aviso-cierre`, `c1` y `c2`, con sujetos Sonnet, las aserciones (a)–(e) del Scope; el patrón del patch 0006 (RED y GREEN de la misma batería).
- El RED se mide antes de tocar la skill. Solo (a) y (d) son el rojo: deben fallar hoy por la razón correcta, no por un fixture mal escrito. (b), (c) y (e) son de regresión y pasan o son vacuas hoy. Si el RED no falla en (a) o (d), se para: se reescribe el fixture y no se gasta el GREEN.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no se toca comportamiento observable de `capabilities/` (no hay).

## Previsión de coste

Comando: `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $`.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (`c1`×2, `c2`×2) | 2,80 |
| GREEN | 4 (`c1`×2, `c2`×2) | 2,80 |
| Una tanda de REFACTOR | 4 (`c1`×2, `c2`×2) | 2,80 |
| Controles | 0 — no hay variante de control: la batería no las define | 0,00 |
| Medición tras la revisión final | 0 — la revisión final no edita la skill; si lo hiciera, se para y decide el dev-lead | 0,00 |
| Suma | 12 sujetos · ~30 min (`sin medir`, supuesto sin umbral) | 8,40 |

Si la prueba supera 8,40 $ (REFACTOR incluido), se para y decide el dev-lead (art. 5). El revisor de la spec y los de la revisión final no son sujetos de la batería y no entran en esta suma.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
