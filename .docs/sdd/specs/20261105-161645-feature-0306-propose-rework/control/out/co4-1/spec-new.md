---
id: 20261106-093903-feature-0016-close-notice
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

🦆 Al cerrar una feature, el aviso de `aviso-cierre` hoy solo dice qué se cierra (p. ej. «cierro la 0010, motivo al cancelar»; ejemplo inventado). Con este cambio dirá además qué queda sin cerrar: «Se cierra: la 0010. Queda pendiente: la validación diferida a la release v0.4.0» (ejemplo inventado), o «Queda pendiente: nada» si no hay nada. Se consigue ampliando el paso 1 de `skills/aviso-cierre/SKILL.md`; el paso 2 (correr el gate) no cambia. Como edita una skill, antes de tocarla va su prueba con sujetos (RED → GREEN), con la previsión de coste de abajo.

Validación: dev-lead — es el texto que lee quien cierra; solo una persona sabe si «pendiente» dice lo que ella espera.

## Capacidades

Ninguna, porque el proyecto no tiene capacidades (`sdd capability index` → «Sin capacidades») y el cambio edita una skill; no hay delta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna contada (sin capacidad nueva, sin contrato, sin `MODIFIED`, sin datos, sin dependencias; área leída entera: el `SKILL.md` son 9 líneas) · tamaño: ~5 líneas en 1 fichero (+ la batería)
- Dominio y técnica (sonnet, los siete puntos): si «qué queda pendiente» (decisión 1) tiene un THEN comprobable y si la previsión de coste suma bien con el precio de `tech-stack.md`
- Mínimo razonable: sin review — deja sin mirar si una decisión del cuerpo falta aquí

1. **Qué cuenta como «pendiente»**: lo que la feature deja sin cerrar al cerrarse, y la lista es ilustrativa —validación diferida (🧪), filas de roadmap que nacen de ella, deuda aplazada—: el criterio es lo que el contexto del cierre marca como diferido o abierto, y nada que no conste ahí; si no consta nada, la skill escribe «Queda pendiente: nada». Nadie dijo la lista: la propongo porque el dev-lead solo fijó «dice también qué queda pendiente».
2. **Formato del aviso**: «Se cierra: <qué>. Queda pendiente: <lista | nada>.» en dos frases, en castellano (constitución, art. 4). Los literales «Se cierra:» y «Queda pendiente:» y «nada» son fijos; el resto del texto del paso 1 es libre. Literal mío.
3. **Enfoque** (sin mensaje de enfoques en `delegate`): ampliar el paso 1 en su sitio, sin paso nuevo. Descarto añadir un paso 2 «Di qué queda» (renumera el gate y mueve la referencia «Corre el gate» sin ganar nada) y descarto una sección aparte (para dos frases es más texto que regla).
4. **Prueba con sujetos**: las baterías `c1` y `c2` de `tests/batteries/aviso-cierre/battery.md` (n=2, Sonnet), sin batería nueva; antes del RED se ajustan, si hace falta, para que `c1` traiga un cierre con un pendiente en su contexto y `c2` un cierre sin ninguno; no se da por hecho que hoy lo cubran. Los datos concretos los fija el plan.
5. **Validación `dev-lead`** y no `agente`: el dev-lead no dijo que bastara el agente.
6. **Criterio de la prueba**: cada sujeto pasa si su aviso trae «Se cierra:» y «Queda pendiente:»; en `c1` el pendiente es el del contexto y no otro, y en `c2` es exactamente «nada». RED: la skill actual no lo cumple en ningún sujeto de al menos una batería; GREEN: 4/4 sujetos pasan. Lo juzga el agente leyendo la salida de cada sujeto.
7. **Lane**: feature, modo full; lite sería posible por su predicado (un módulo, sin contrato, ≤ medio día) pero nadie lo activó.
- Política de modelos: revisor de la spec en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la prueba: Sonnet, por tandas de 4 · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — falta la dimensión de minutos → columna «Min (aprox.)» y total en la previsión.
- **Aceptado** — éxito de GREEN no verificable → decisión 6 con pass/fail por sujeto y 4/4.
- **Aceptado** — «inventar pendientes» sin prueba → criterio de `c1`/`c2` en la decisión 6 y en «Dónde se prueba».
- **Aceptado** — ajuste de baterías fuera de coste y orden → decisión 4 (antes del RED), Scope y fila de Controles condicionados.
- **Rechazado** — gate distinto al art. 2 → `operations.md` define el gate de cierre con el lint; es una regla del proyecto y la spec lo cita.
- **Aceptado** — categorías abiertas de «pendiente» → decisión 1 declara la lista ilustrativa y el criterio.
- **Aceptado** — formato sin fijar → decisión 2 marca los literales fijos.
- **Aceptado** — techo ambiguo → techo numérico y una sola tanda de REFACTOR.
- **Aceptado** — ejemplos sin marcar → marcados como inventados.
- **Aceptado** — `battery.md` sin listar → en Scope; sobre `description`, ya está en «No entra».

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo «Di qué se cierra». Quien cierra no ve, en ese aviso, lo que se queda abierto al cerrar. Se quiere que el mismo aviso lo diga. Éxito: en las dos baterías, 4/4 sujetos escriben el aviso con las dos frases (qué se cierra y qué queda pendiente, o «nada») según el criterio de la decisión 6. Fracaso aunque funcione: que el aviso invente pendientes que no existen, o que el cambio mueva o quite el gate del paso 2.

## Scope

- Entra: reescribir el paso 1 de `skills/aviso-cierre/SKILL.md` para que pida el aviso con «Se cierra» y «Queda pendiente»; ajustar `c1` y `c2` en `tests/batteries/aviso-cierre/battery.md` (fichero que se toca), antes del RED y si hace falta, para que midan ese comportamiento.
- No entra: el paso 2 (correr el gate); crear capacidades; tocar `description` o el nombre de la skill; ninguna otra skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1 «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope (se reescribe) |
| Id de fila implementada | ninguna: la 0016 no tiene fila en `roadmap.md` | — |

- Filas que implementa: nada: comprobado con `git grep -niE "qué se cierra|aviso-cierre|pendiente"` fuera de `specs/`; solo salen el propio `SKILL.md`, la batería y la línea de precio de `tech-stack.md`, que no cambian.

## Approach

Ampliar el paso 1 en su sitio (decisión 3): pide un aviso de dos frases, «Se cierra: …» y «Queda pendiente: …», con «nada» si no hay. El paso 2 queda igual. El texto exacto lo escribe el plan, y solo después de su RED (art. 5 de la constitución).

## Dónde se prueba

- El aviso de cierre dice qué queda pendiente y no inventa pendientes (en `c1` solo el del contexto; en `c2`, «nada»): con sujetos Sonnet sobre las baterías `c1` y `c2`, como la prueba actual de `aviso-cierre`; no hay test de `node --test` porque es texto de una skill.
- El gate de cierre no se rompe: `node --test && node scripts/lint.mjs`, el «Gate de cierre» de `operations.md` (el art. 2 de la constitución exige `node --test` en verde; el lint es adicional).

## Términos y ADR

- Términos resueltos: pendiente — lo que la feature deja sin cerrar al cerrarse (decisión 1)
- ADR candidatas: ninguna

## Previsión de coste

Precio por sujeto: ~0,70 $ (Sonnet, `tech-stack.md`). Baterías `c1` y `c2`, n=2 cada una: 4 sujetos por tanda. Minutos: aproximados (no hay medida previa en el proyecto), ~5 min por tanda de 4 sujetos.

| Tanda | Sujetos (batería) | Min (aprox.) | $ |
| --- | --- | --- | --- |
| RED | 4 (c1×2, c2×2) | 5 | 2,80 |
| GREEN | 4 (c1×2, c2×2) | 5 | 2,80 |
| Una tanda de REFACTOR | 4 (c1×2, c2×2) | 5 | 2,80 |
| Controles | 0 — sin batería de control aparte: c1 (con pendiente) y c2 (sin) ya son el control, una vez ajustadas | 0 | 0,00 |
| Medición tras la revisión final | 4 (c1×2, c2×2) | 5 | 2,80 |
| Suma | 16 sujetos | 20 | 11,20 |

El techo es 11,20 $ / 16 sujetos / ~20 min, con una sola tanda de REFACTOR: una segunda tanda, o superarlo, para y decide el dev-lead (constitución, art. 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
