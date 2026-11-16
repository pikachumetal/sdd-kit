---
id: 20261030-123702-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-10-30
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra: «Cierro la feature 0016». Con este cambio dirá además lo que sigue abierto: «Cierro la feature 0016. Pendiente: validación post-merge del 05/11», o «Nada pendiente» si no queda nada. Se cambia el paso 1 de `skills/aviso-cierre/SKILL.md` y se prueba con la batería de la skill, como manda la constitution.

## Capacidades

- Ninguna, porque herramientas (una skill del propio proyecto; el producto `salas` no cambia).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 de 8 (sin capacidad, sin contrato público, sin `MODIFIED`/`REMOVED`, sin datos, sin dependencia, área leída entera) · tamaño: ~2 líneas en 1 fichero (`skills/aviso-cierre/SKILL.md`)
- Mínimo razonable: ninguna revisión — no deja nada sin cubrir que la batería de sujetos no pruebe.

1. **Qué es «pendiente»**: lo que la feature deja abierto al cerrarla (tasks sin hacer, validaciones post-merge, filas del roadmap que quedan, deuda anotada). La entrevista dijo «qué queda pendiente» sin acotarlo; esta es mi lectura.
2. **Redacción del paso 1**: `1. Di qué se cierra y qué queda pendiente; si no queda nada, di «Nada pendiente».` — el «Nada pendiente» es mío: sin él, callar es ambiguo (nada pendiente u olvido).
3. **Solo cambia el paso 1.** El paso 2 («Corre el gate») y el frontmatter quedan como están.
4. **Sin capacidad nueva ni delta** en `capabilities/` (no existe ninguna): el cambio es de una skill, no del producto.
5. **Batería**: se reutilizan c1 y c2 de `tests/batteries/aviso-cierre/battery.md` (2 sujetos cada una, Sonnet) y no se añade ninguna. Si el RED no distingue el comportamiento nuevo, se ajusta el escenario antes del GREEN, como desvío.
6. **Previsión de coste** a 0,70 $ por sujeto (`tech-stack.md`), no a los 0,31 $ medidos en el patch 0006: es la cifra del proyecto y la más cara. Una tanda de REFACTOR incluida; sin controles; incluyo una medición de 4 sujetos tras la revisión final, que nadie pidió.
7. **Prueba del delta** en copia temporal de `.docs/sdd`: `capability merge` → «Sin delta que fusionar», salida 0.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: sujetos de la batería (Sonnet), por tandas de c1 y c2 · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «La entrevista ya está hecha; decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».

## Intent

Hoy el aviso de cierre solo dice qué se cierra, y quien lo lee no sabe si queda algo por hacer. Importa porque cerrar una feature con una validación post-merge o una task sin hacer, sin que el aviso lo diga, lo deja sin dueño. Éxito: en el RED, los sujetos de c1 y c2 no mencionan lo pendiente; en el GREEN, los 4 cierran diciendo qué se cierra y qué queda pendiente (o «Nada pendiente»). Fracaso aunque «funcione»: el aviso inventa pendientes que no existen, o calla cuando los hay.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md`; el RED/GREEN de la skill con su batería; el registro del coste real.
- No entra: el paso 2 (gate); otras skills; el producto `salas` (`src/`); nuevas baterías o escenarios; cualquier formato fijo del aviso más allá de la frase del paso 1.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1 «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope y decisión 2: pasa a «Di qué se cierra y qué queda pendiente…» |

- Filas que implementa: nada: comprobado con `grep -rn "0016\|qué se cierra\|aviso-cierre"` en `.docs/sdd/`, `skills/` y `tests/` — `roadmap.md` no tiene fila 0016 y `tech-stack.md` y `battery.md` nombran la skill sin citar el literal.

## Approach

Se edita el paso 1 con la frase de la decisión 2. Antes de editar, RED: los sujetos de c1 y c2 corren con la skill actual y se anota qué dicen. Después, GREEN con la skill editada. No se añaden pasos ni se toca el gate.

## Dónde se prueba

- El aviso nombra lo que se cierra y lo pendiente (o «Nada pendiente»): con la batería existente `tests/batteries/aviso-cierre/battery.md` (c1 y c2, paso cierre, 2 sujetos cada una, Sonnet), como el patch 0006. El gate `node --test && node scripts/lint.mjs` se corre al cierre; no cambia nada de `src/`.

## Términos y ADR

- Términos resueltos: pendiente — lo que la feature deja abierto al cerrarla (decisión 1).
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: no toca `capabilities/` (ver Capacidades).

## Previsión de coste

Precio por sujeto: 0,70 $ (`tech-stack.md`, «Sujetos: Sonnet»). Batería: `aviso-cierre`, c1 + c2 = 4 sujetos por tanda.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (c1, c2) | 2,80 |
| GREEN | 4 (c1, c2) | 2,80 |
| Una tanda de REFACTOR | 4 (c1, c2) | 2,80 |
| Controles | 0 | 0,00 |
| Medición tras la revisión final | 4 (c1, c2) | 2,80 |
| Suma | 16 | 11,20 |

Si la prueba supera esta previsión, una tanda de REFACTOR incluida, se para y decide el dev-lead (constitution, 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
