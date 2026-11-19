---
id: 20261119-161215-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el agente solo dice qué se cierra («cierro la 0005, reserva semanal»). Con el cambio dirá también lo que se queda sin hacer: «cierro la 0005; queda pendiente: validar el THEN de las 24 h tras el merge», o «nada pendiente». Es el paso 1 de `skills/aviso-cierre/SKILL.md`; el paso 2 (correr el gate) no cambia.

Validación: dev-lead — el aviso es un texto que lee una persona, y solo ella dice si lo pendiente que nombra es útil; el dev-lead no autorizó el atajo `agente`.

## Capacidades

- Ninguna, porque herramientas (se edita una skill; `capabilities/` no existe en el proyecto).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: ninguna · tamaño: ~1 línea en 1 fichero. Comprueba los escenarios de «Dónde se prueba» y que la frase del paso 1 cumple el Intent. Mínimo razonable: sin review — deja sin cubrir que la frase se interprete igual con sujetos distintos.

### Hallazgos de la review

- **Aceptado por mí** — Crítico: éxito sin escenario comprobable → escenarios GIVEN/WHEN/THEN en «Dónde se prueba» y decisión 7.
- **Aceptado por mí** — Crítico: «nada pendiente» no estaba en el texto → decisión 3 lo incluye.
- **Aceptado por mí** — Importante: decisión 4 sin validar → marcada «bloquea la aprobación».
- **Aceptado por mí** — Importante: id y modo sin confirmar → decisiones 1 y 2 «bloquea la aprobación».
- **Aceptado por mí** — Importante: faltaban minutos → decisión 8 y la previsión.
- **Aceptado por mí** — Importante: el paso 2 sin prueba → tercer escenario.
- **Aceptado por mí** — Menor: destino de la tabla y razón de «Validación».
- **Rechazado** en parte — Importante: «plan.mjs sin ejecutar»: sí se ejecutó (`suma: 4 sujetos · 2.80 $`); lo útil, el margen, queda dicho en la previsión.
- **Aceptado por mí** — Menor: REFACTOR condicionado a que GREEN deje algo.

Segunda ronda (sin tercera): aceptado por mí → escenarios con su criterio de fallo del RED, `battery.md` en el Scope, grep con sus líneas, decisión 3 «pendiente de validar», previsto frente a techo y minutos en la tabla; **rechazado** → «falta `PRODUCT.md`» (existe en la raíz y no hay nada que contrastar con este cambio). Lo «aceptado por mí» no lo ha decidido el dev-lead: las decisiones 1, 2, 3 y 4 esperan su respuesta.

Decisiones:

1. Id `0016` y carpeta en `.docs/sdd/changes/` — la rama ya es `feature/0016-close-notice`, pero `ROADMAP.md` no tiene fila 0016 y no he corrido `sdd id claim`: **pendiente, bloquea la aprobación**: el dev-lead confirma la reserva.
2. Modo `full` — es una feature; con una sola línea editada podría ser `lite`: **pendiente, bloquea la aprobación**, lo decide el dev-lead.
3. Texto literal del paso 1: «Di qué se cierra y qué queda pendiente; si no queda nada, di «nada pendiente», sin inventar pendientes.» — **pendiente de validar** (el dev-lead solo decidió que el paso 1 diga también lo pendiente; la salida «nada pendiente» y el «sin inventar» son míos, para que el Intent sea comprobable); el paso 2 queda intacto.
4. Qué cuenta como «pendiente» — **pendiente, bloquea la aprobación**: es del dev-lead y el paso 1 no lo define hasta que responda. Mi propuesta, sin decidir: lo de esta feature que se cierra sin hacerse o sin verificarse (tasks sin cerrar, THEN con `Se valida en:` aún sin validar, deuda anotada en `debt.md`), y «nada pendiente» dicho expresamente si no hay.
5. Enfoque: A, frente a B y C (ver Approach).
6. Pruebas: RED, GREEN y una tanda de REFACTOR con los escenarios `c1 c2` de la batería, n=2 cada uno — es la n de la batería, y la constitution 5 pide la previsión antes del primer sujeto. Sin tanda de controles ni de medición tras la revisión final (no hay topes de palabras ni medición que repetir).
7. Los escenarios `c1`/`c2` de `battery.md` (solo trae la tabla, sin contenido) no se conocen: la primera tarea del plan los lee y, si no miden los escenarios de «Dónde se prueba», los extiende antes del RED. Los escenarios van fijados ya aquí.
8. Minutos de la prueba: ~15 min por tanda (4 sujetos en paralelo, ~3 min cada uno más el análisis), ~45 min en total — estimación mía, sin medir.
- Pasada de coherencia: sin delta, `sdd capability merge` no aplica (no hay `capabilities/`); sin topes de palabras en el proyecto.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos con Sonnet, por tandas, en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Hoy el paso 1 es «Di qué se cierra.»: quien lee el aviso no sabe qué queda sin hacer y se entera después. Se quiere que el aviso lo diga ya al cerrar. Éxito: en los sujetos de `c1` y `c2`, el aviso nombra lo cerrado y lo pendiente (o «nada pendiente»), y el gate sigue corriéndose en el paso 2. Anti-goal: que el aviso invente pendientes o que el paso 2 cambie.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md`.
- Entra, si la primera tarea lo exige (decisión 7): `tests/batteries/aviso-cierre/battery.md`, extendida con los escenarios de «Dónde se prueba»; si se toca, la previsión de coste se recalcula y se dice antes del primer sujeto.
- No entra: el paso 2 (correr el gate), la descripción de la skill, el formato del aviso más allá de la frase, y cualquier otra skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope, decisión 3 y los escenarios de «Dónde se prueba» |
| Escenarios `c1`/`c2` (solo tabla) | `tests/batteries/aviso-cierre/battery.md:5-6` | Scope («Entra, si…»), decisión 7 |

- Filas que implementa: 0016 (sin fila en el roadmap, decisión 1) → nada más la nombra: comprobado con `git grep -niE "qué se cierra|se cierra|aviso-cierre|0016"` fuera de `changes/` y `tests/*.md` (hits: `patch.md:3` y `operations.md:16` citan la skill por nombre; `SKILL.md:2,6,8`, con el literal solo en la línea 8; la batería solo tiene la tabla y no afirma nada sobre el texto del aviso).

## Approach

- A. Ampliar la frase del paso 1 — un cambio de una línea; el paso 2 queda igual.
- B. Añadir un paso 2 «Di qué queda pendiente» y desplazar el gate a paso 3 — el aviso queda en dos mensajes y se renumera el gate, más superficie para la misma información.
- C. Una plantilla de aviso con campos fijos — más estructura de la que se pidió, y define el formato, que no entra.
- Elegido: A — lo decidido es que el paso 1 diga también lo pendiente, y A es lo único que lo hace sin tocar el paso 2.

## Dónde se prueba

Con sujetos, escenarios `c1` y `c2` de `tests/batteries/aviso-cierre/battery.md` (RED con la skill actual, GREEN con la editada), como el patch 0006:

Asignación de `c1`/`c2` a estos casos: **pendiente** (decisión 7). «Pendiente» sigue la propuesta de la decisión 4 y se alinea con lo que decida el dev-lead.

- GIVEN una feature con una task sin cerrar · WHEN el sujeto cierra · THEN el aviso nombra lo cerrado y esa task como pendiente. RED falla si el aviso no trae ninguna frase de pendiente.
- GIVEN una feature sin nada sin hacer ni sin verificar · WHEN el sujeto cierra · THEN el aviso dice «nada pendiente» y no inventa pendientes. RED falla si no dice «nada pendiente».
- GIVEN cualquiera de los dos · WHEN el sujeto termina el aviso · THEN corre el gate (paso 2) después del aviso. Control de regresión: no se espera que falle en RED, sí que siga pasando en GREEN.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Previsión de coste

Los avisos de ejemplo («cierro la 0005…») son ilustrativos.

| Tanda | Sujetos (batería) | $ | Min |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~15 |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~15 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~15 |
| Controles | a cero: no hay controles que correr | 0 | 0 |
| Medición tras la revisión final | a cero: ningún tope de palabras que medir | 0 | 0 |
| Suma, techo | 12 sujetos | 8.40 | ~45 |
| Previsto (RED + GREEN) | 8 sujetos | 5.60 | ~30 |

8,40 $ y ~45 min son el techo, REFACTOR incluido: la tanda de REFACTOR se corre solo si GREEN deja algo que arreglar, y una segunda tanda o cualquier gasto por encima para y decide el dev-lead (constitution 5). Tiempo previsto: ~45 min (decisión 8).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
