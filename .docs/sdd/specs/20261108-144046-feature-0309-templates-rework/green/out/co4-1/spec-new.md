---
id: 20261108-183536-feature-0016-close-notice
feature: 0016
title: El paso 1 de aviso-cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El paso 1 de aviso-cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra. Con este cambio dirá además qué queda pendiente de esa feature: «Se cierra: reservas semanales. Pendiente: validar el escenario del solape con el dev-lead», o «Pendiente: nada» si no queda nada. Solo cambia la frase del paso 1 de `skills/aviso-cierre/SKILL.md`; el paso 2 (correr el gate) no se toca. Como es una edición de skill, va con su prueba con sujetos (RED → GREEN) y su previsión de coste.

Validación: dev-lead — el resultado es el texto que lee una persona al cerrar; el atajo `agente` solo cabe si la frase del dev-lead lo nombra, y no lo ha hecho.

## Capacidades

- Ninguna, porque herramientas

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de contrato, `MODIFIED`, datos ni roles; área sin explorar (la batería) · tamaño: ~2 líneas de skill + las de la batería en 2 ficheros
- Técnica+dominio (sonnet): si la frase del paso 1 es verificable por un sujeto (un `Pendiente:` con contenido o «nada») y si la previsión de coste cuadra con la salida de `scripts/plan.mjs` (señal: área sin explorar)
- Mínimo razonable: sin revisión — deja sin mirar que el literal `Pendiente:` aparezca igual en Approach y en «Dónde se prueba»

### Hallazgos de la review

- **Aceptado** (Crítico) — la batería no dice qué ejercitan `c1`/`c2` → decisión 6: se definen en la batería (`c1` algo sin validar, `c2` todo hecho) y entra en el Scope
- **Aceptado** — el RED no discrimina ni mide la invención → decisión 7 y «Dónde se prueba»: `c2` exige `nada`; `c1`, el pendiente concreto
- **Aceptado** — faltan minutos del art. 5 → decisión 9: ~60 min, suposición mía, y tope de parada
- **Aceptado** — editar la batería era alcance oculto → Scope «Entra»
- **Aceptado** — previsión rehecha tras aprobar rompe el art. 5 → c1/c2 y n fijados aquí; si cambian, enmienda antes del primer sujeto (decisión 9)
- **Aceptado** — la redacción exacta queda fuera de la spec → decisión 8; se verifican `Se cierra:` y `Pendiente:` (decisión 7)
- **Aceptado** — la previsión no dice qué cubre → decisión 9: solo sujetos, REFACTOR es techo
- **Aceptado** — afirmaciones del roadmap sin cita → «Lo que se retira» cita `.docs/sdd/roadmap.md`
- **Aceptado** — gate y batería → línea en «Dónde se prueba»
- **Rechazado** — «dev-lead» y `approvers: TBD` poco claros → en este proyecto el dev-lead es quien lo desarrolla (misión: «la desarrollo, la pruebo y la despliego»); `approvers` se rellena al aprobar
- **Rechazado** (parte del 10) — duda de que la rama salga de `develop` → `develop` existe (`git branch -a`) y la rama es `feature/0016-close-notice`

1. **«Pendiente» es lo que queda por hacer de la feature que se cierra**: escenarios de la spec o tareas sin cerrar y validaciones sin hacer. No es el roadmap del proyecto (filas 0010, 0011, 1…), que es otra cosa. Lo dijo el dev-lead como «qué queda pendiente» sin más; esta lectura es mía.
2. **Forma del aviso**: dos líneas literales, `Se cierra: <qué>` y `Pendiente: <qué>`; si no queda nada, `Pendiente: nada`. Nadie dijo los literales.
3. **Una sola frase en el paso 1, sin renumerar**: el paso 2 («Corre el gate») sigue siendo el 2. Enfoques en Approach.
4. **Sin delta de capacidades**: el proyecto no tiene `capabilities/` (`sdd capability index` → «Sin capacidades») y una skill es herramienta; por eso tampoco hay prueba del delta en copia.
5. **Validación: `dev-lead`**, no `agente` (motivo arriba).
6. **Pruebas: los escenarios `c1` y `c2` de la batería, n=2 cada uno, se definen en la propia batería** (hoy `tests/batteries/aviso-cierre/battery.md` solo tiene la tabla Id/Paso/n/Modelo: no dice qué ejercita ninguno). Los fijo yo: `c1` = cierre de una feature con un escenario de la spec sin validar; `c2` = cierre de una feature con todo hecho y validado. Mismos ids, mismo n, así la previsión no se mueve. La definición va en prosa bajo la tabla de la batería, con el texto de la spec de cada fixture, sin añadir filas ni columnas a la tabla; tras editar, `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` debe seguir dando `suma: 4 sujetos · coste previsto: 2.80 ---
id: 20261108-183536-feature-0016-close-notice
feature: 0016
title: El paso 1 de aviso-cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El paso 1 de aviso-cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra. Con este cambio dirá además qué queda pendiente de esa feature: «Se cierra: reservas semanales. Pendiente: validar el escenario del solape con el dev-lead», o «Pendiente: nada» si no queda nada. Solo cambia la frase del paso 1 de `skills/aviso-cierre/SKILL.md`; el paso 2 (correr el gate) no se toca. Como es una edición de skill, va con su prueba con sujetos (RED → GREEN) y su previsión de coste.

Validación: dev-lead — el resultado es el texto que lee una persona al cerrar; el atajo `agente` solo cabe si la frase del dev-lead lo nombra, y no lo ha hecho.

## Capacidades

- Ninguna, porque herramientas

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de contrato, `MODIFIED`, datos ni roles; área sin explorar (la batería) · tamaño: ~2 líneas de skill + las de la batería en 2 ficheros
- Técnica+dominio (sonnet): si la frase del paso 1 es verificable por un sujeto (un `Pendiente:` con contenido o «nada») y si la previsión de coste cuadra con la salida de `scripts/plan.mjs` (señal: área sin explorar)
- Mínimo razonable: sin revisión — deja sin mirar que el literal `Pendiente:` aparezca igual en Approach y en «Dónde se prueba»

### Hallazgos de la review

- **Aceptado** (Crítico) — la batería no dice qué ejercitan `c1`/`c2` → decisión 6: se definen en la batería (`c1` algo sin validar, `c2` todo hecho) y entra en el Scope
- **Aceptado** — el RED no discrimina ni mide la invención → decisión 7 y «Dónde se prueba»: `c2` exige `nada`; `c1`, el pendiente concreto
- **Aceptado** — faltan minutos del art. 5 → decisión 9: ~60 min, suposición mía, y tope de parada
- **Aceptado** — editar la batería era alcance oculto → Scope «Entra»
- **Aceptado** — previsión rehecha tras aprobar rompe el art. 5 → c1/c2 y n fijados aquí; si cambian, enmienda antes del primer sujeto (decisión 9)
- **Aceptado** — la redacción exacta queda fuera de la spec → decisión 8; se verifican `Se cierra:` y `Pendiente:` (decisión 7)
- **Aceptado** — la previsión no dice qué cubre → decisión 9: solo sujetos, REFACTOR es techo
- **Aceptado** — afirmaciones del roadmap sin cita → «Lo que se retira» cita `.docs/sdd/roadmap.md`
- **Aceptado** — gate y batería → línea en «Dónde se prueba»
- **Rechazado** — «dev-lead» y `approvers: TBD` poco claros → en este proyecto el dev-lead es quien lo desarrolla (misión: «la desarrollo, la pruebo y la despliego»); `approvers` se rellena al aprobar
- **Rechazado** (parte del 10) — duda de que la rama salga de `develop` → `develop` existe (`git branch -a`) y la rama es `feature/0016-close-notice`

1. **«Pendiente» es lo que queda por hacer de la feature que se cierra**: escenarios de la spec o tareas sin cerrar y validaciones sin hacer. No es el roadmap del proyecto (filas 0010, 0011, 1…), que es otra cosa. Lo dijo el dev-lead como «qué queda pendiente» sin más; esta lectura es mía.
2. **Forma del aviso**: dos líneas literales, `Se cierra: <qué>` y `Pendiente: <qué>`; si no queda nada, `Pendiente: nada`. Nadie dijo los literales.
3. **Una sola frase en el paso 1, sin renumerar**: el paso 2 («Corre el gate») sigue siendo el 2. Enfoques en Approach.
4. **Sin delta de capacidades**: el proyecto no tiene `capabilities/` (`sdd capability index` → «Sin capacidades») y una skill es herramienta; por eso tampoco hay prueba del delta en copia.
5. **Validación: `dev-lead`**, no `agente` (motivo arriba).
6. **Pruebas: los escenarios `c1` y `c2` de la batería, n=2 cada uno, se definen en la propia batería** (hoy `tests/batteries/aviso-cierre/battery.md` solo tiene la tabla Id/Paso/n/Modelo: no dice qué ejercita ninguno). Los fijo yo: `c1` = cierre de una feature con un escenario de la spec sin validar; `c2` = cierre de una feature con todo hecho y validado. Mismos ids, mismo n, así la previsión no se mueve. . El escenario sin validar de `c1` lleva un título literal inventado, «Solape de franjas». Editar la batería entra en el Scope.
7. **Criterios del GREEN**: en `c1`, el aviso trae `Se cierra:` y una línea `Pendiente:` que nombra ese escenario sin validar; en `c2`, `Pendiente: nada`. Se verifican los dos literales, `Se cierra:` y `Pendiente:`. «Nombra» = el aviso contiene el título literal del escenario («Solape de franjas»). Umbral: 2 de 2 sujetos por escenario. Un `Pendiente:` con algo inventado en `c2`, o `nada` en `c1`, es fallo.
8. **La redacción exacta de la frase del paso 1 la fija el plan** (una frase inicial); si el GREEN falla, se cambia dentro de la tanda de REFACTOR, sin enmendar la spec mientras los dos literales no cambien. La spec fija solo los literales y su contenido.
9. **Previsión de coste: 8,40 $ y ~60 min** (3 tandas de 4 sujetos, 2,80 $ cada una). Los dólares salen de `scripts/plan.mjs`; los minutos son una suposición mía (~5 min por sujeto, sin medir: `plan.mjs` no los da), y paro si la prueba pasa de 60 min o de 8,40 $ (la previsión, con una tanda de REFACTOR incluida): entonces decide el dev-lead (constitución, art. 5). La previsión cubre solo sujetos; los revisores de la spec y de la revisión final quedan fuera; el REFACTOR es un techo, no una certeza. Controles y medición tras la revisión final a cero: no hay controles en la batería ni tope de palabras que medir. Si c1/c2 o su n cambian, se enmienda la spec con la previsión nueva antes del primer sujeto. Se mide el primer sujeto del RED y, si los minutos se desvían mucho de 5, se enmienda antes de la tanda siguiente.
- Política de modelos: revisor de la spec 1, Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos: Sonnet, por tandas de 4 · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la segunda ronda

- **Aceptado** — la definición de `c1`/`c2` puede romper `plan.mjs` → decisión 6: prosa bajo la tabla y comprobación de la previsión
- **Aceptado** — el tope de 90 min contradecía el art. 5 → decisión 9: 60 min / 8,40 $
- **Aceptado** — criterio de «nombra», umbral y fixture sin fijar → decisiones 6 y 7
- **Aceptado** — el RED no mide invención → «Dónde se prueba»
- **Aceptado** — «único sitio» sobredimensionado → «Lo que se retira»
- **Aceptado** — iteración de la frase → decisión 8
- Minutos sin medir → ya declarado en la decisión 9, con medición del primer sujeto

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo «Di qué se cierra». Quien cierra una feature no ve en ese aviso qué queda sin hacer, y lo descubre después. Se quiere que el mismo paso lo diga. Éxito: un sujeto que cierra una feature con algo sin validar escribe una línea `Pendiente:` que lo nombra; con nada sin hacer, escribe `Pendiente: nada`. Fracaso aunque «funcione»: el sujeto inventa pendientes que la spec no tiene, o omite la línea.

## Scope

- Entra: la frase del paso 1 de `skills/aviso-cierre/SKILL.md`.
- Entra: la prueba con sujetos (RED y GREEN) de esa edición y la edición de `tests/batteries/aviso-cierre/battery.md` para definir qué ejercitan `c1` y `c2` (decisión 6), sin tocar ids, n ni modelo.
- No entra: el paso 2 («Corre el gate»), la `description` de la skill, y renumerar pasos.
- No entra: cualquier lectura del roadmap del proyecto para el «pendiente».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La frase «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` (único sitio en `skills/` y en código; quedan fuera los históricos de `.docs/sdd/specs` y la batería, que se edita aparte) | Scope: se reescribe con la decisión 2 |

- Filas que implementa: nada: comprobado con `git grep -nE "0016" -- . ':!.docs/sdd/specs' ':!tests/*.md'` (sin resultados) y `.docs/sdd/roadmap.md` no tiene fila 0016 (sus filas son 0010, 0011 y 1).

## Approach

- Reescribir la frase del paso 1 — una línea; no renumera; el paso 2 queda igual.
- Añadir un paso nuevo entre el 1 y el 2 — obliga a renumerar el gate y separa dos cosas que son un mismo aviso.
- Mover el aviso a un fichero de referencia de la skill — coste de lectura extra para algo de dos líneas.
- Elegido: reescribir la frase del paso 1 — es lo que dijo el dev-lead («el paso 1 … dice también qué queda pendiente») y es el cambio mínimo.

El paso 1 pasa a pedir las dos líneas de la decisión 2: `Se cierra: <qué>` y `Pendiente: <qué | nada>`, con «pendiente» como en la decisión 1. El texto exacto de la frase lo fija el plan a partir de lo que el RED muestre que los sujetos entienden mal.

## Dónde se prueba

- El aviso del paso 1: con sujetos Sonnet sobre `c1` (algo sin validar) y `c2` (todo hecho) de `tests/batteries/aviso-cierre/battery.md` (el sujeto cierra una feature entera): RED con la skill actual (sin línea `Pendiente:`), GREEN con la skill editada y los criterios de la decisión 7.
- El RED prueba que falta la línea `Pendiente:` (la skill actual no la escribe); el GREEN prueba su contenido y que no se inventa: `nada` solo en `c2`.
- El gate de cierre del proyecto (`node --test && node scripts/lint.mjs`) no incluye la batería: la prueba con sujetos es aparte.

## Términos y ADR

- Términos resueltos: pendiente — lo que queda por hacer de la feature que se cierra (no el roadmap)
- ADR candidatas: ninguna

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | los mismos escenarios y n → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | los mismos escenarios y n → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Controles | 0: la batería no tiene escenarios de control | 0 |
| Medición tras la revisión final | 0: ningún test pone tope de palabras a la skill | 0 |
| Suma | 12 sujetos · ~60 min (suposición, decisión 9) | 8,40 |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
