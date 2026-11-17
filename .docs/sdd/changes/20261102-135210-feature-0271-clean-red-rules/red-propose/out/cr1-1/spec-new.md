---
id: 20261102-145920-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice qué queda pendiente
mode: full
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice qué queda pendiente

🦆 Al cerrar una feature, el aviso ya no dice solo qué se cierra: también dice qué sigue abierto en el roadmap. Por ejemplo, al cerrar la 0010 el aviso nombra la 0011 y la fila 1 (Avisos por correo antes de la reserva) como pendientes; si no queda ninguna, dice que no queda nada pendiente. Cambia una sola línea de las instrucciones del cierre, y se mide con cuatro sujetos antes y después de editarla.

Validación: dev-lead — el fallo del campo es que una persona no vio que quedaba una fila abierta; lo que esa persona lee en el aviso lo valida ella, no solo la batería.

## Capacidades

- Ninguna, porque herramientas (el cambio es el texto de una skill del proyecto; `capabilities/` no existe y no se crea).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 de 8 (sin delta, sin contrato, sin datos; el área —la skill y su batería— está leída) · tamaño: ~5 líneas en 2 ficheros
- Mínimo razonable: ninguna (es el nivel propuesto).

1. **Qué cuenta como pendiente**: las filas de la tabla «Próximo» de `.docs/sdd/roadmap.md` cuyo estado no es ✅, salvo la que se cierra. «Backlog» y «Deuda técnica» no cuentan — el ticket habla de «una fila abierta» y esas tablas no son trabajo comprometido.
2. **Qué dice el aviso de cada fila**: su id y su título; si su estado no es ⏳, también el estado tal cual (`⏸️ aparcada: espera al cliente`).
3. **Sin pendientes**: el aviso dice literalmente «No queda nada pendiente.» — texto mío.
4. **Dónde va**: solo el paso 1 de `skills/aviso-cierre/SKILL.md`; el redactado exacto sale del GREEN, no se fija aquí.
5. **Casos de la batería** (`battery.md` hoy solo dice «cierre» para `c1` y `c2`): `c1` = cierre con pendientes (una fila ⏸️ y una ⏳), `c2` = cierre sin ninguna. Hay que describirlos en la batería.
6. **Criterio de éxito de la medición**: 2 de 2 sujetos de `c1` nombran todas las filas pendientes y ninguna de Backlog ni Deuda; 2 de 2 de `c2` dicen que no queda nada. El RED se mide antes de tocar la skill; con él en 2 de 2 sujetos ya correctos, no hay edición que hacer y se para.
7. **Validación `dev-lead`** (no `agente`): ver la línea de Validación.
8. **Previsión de coste**: sujetos a 0,70 $ de `tech-stack.md`, no a los ~0,31 $ medidos en el patch 0006: cubre la cota alta.
9. **Prueba del delta** en una copia temporal de `.docs/sdd`: `sdd capability merge` → «Sin delta que fusionar» (exit 0).
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de `aviso-cierre` en Sonnet, por tandas (`c1`, luego `c2`) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»
- El RED aún no se ha medido — «el RED aún no se ha medido»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo «Di qué se cierra». Al cerrar la 0005 el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta: costó una parada del dev-lead (ticket de campo `20260914-aviso.md` §1). Se quiere que el mismo aviso diga también qué queda pendiente. Éxito: los criterios de la decisión 6. Fracaso aunque parezca funcionar: un aviso que omite una fila abierta, o que inventa pendientes sacados de Backlog o de la Deuda técnica.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md`; la descripción de `c1` y `c2` en `tests/batteries/aviso-cierre/battery.md`.
- No entra: el paso 2 (el gate); cambiar el formato del roadmap; avisar al abrir o a mitad de feature; contar Backlog o Deuda; una capacidad nueva.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1: «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope: se reescribe; sin otro sitio que lo cite (comprobado con `grep -rni "qué se cierra"`) |
| Descripción de `c1` y `c2` («cierre») | `tests/batteries/aviso-cierre/battery.md:5-6` | Scope y decisión 5 |

- Filas que implementa: 0028 → sin fila en `roadmap.md` (la rama la reservó con `sdd id claim`); ficheros que la nombran: ninguno | nada: comprobado con `grep -rni "0028"`

## Approach

Primero el RED: los cuatro sujetos de la batería (`c1`×2, `c2`×2) cierran una feature con la skill tal como está, y se anota qué dicen del pendiente. Solo si fallan, se reescribe el paso 1 para que diga también qué queda pendiente (decisiones 1–3), se mide el GREEN con la misma batería y, si hace falta, una tanda de REFACTOR. El redactado lo fija esa medición.

## Dónde se prueba

- Aviso con pendientes: sujetos Sonnet de la batería `aviso-cierre`, caso `c1` (n=2), con un roadmap de fixture como el de `salas`: cierre de la 0010, con la 0011 `⏸️ aparcada: espera al cliente` y la 1 `⏳` en «Próximo» y B1 en «Backlog» — la superficie y el patrón de `patch-0006-aviso`.
- Aviso sin pendientes: caso `c2` (n=2), cierre de la última fila de «Próximo».

## Términos y ADR

- Términos resueltos: pendiente — fila de «Próximo» sin ✅ que no es la que se cierra
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el proyecto no tiene `capabilities/` y el cambio es el texto de una skill.

## Previsión de coste

Precio por sujeto: 0,70 $ (`tech-stack.md`, «Un sujeto de `aviso-cierre` cuesta ~0,70 $»). Batería `tests/batteries/aviso-cierre/battery.md`: 4 sujetos por tanda.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (`c1`×2, `c2`×2) | 2,80 |
| GREEN | 4 (`c1`×2, `c2`×2) | 2,80 |
| Una tanda de REFACTOR | 4 (`c1`×2, `c2`×2) | 2,80 |
| Controles | 0 — sin controles: la batería ya cubre el caso con y sin pendientes | 0,00 |
| Medición tras la revisión final | 4 (`c1`×2, `c2`×2), solo si la pasada de fix toca la skill | 2,80 |
| Suma | 16 sujetos | 11,20 |

Si la medición supera esta suma, se para y decide el dev-lead (constitución, art. 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
