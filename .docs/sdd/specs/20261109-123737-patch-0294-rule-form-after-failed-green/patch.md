---
id: 20261109-123737-patch-0294-rule-form-after-failed-green
task: 0294
title: Patch — un olvido de orden o de búsqueda se comprueba con su orden
type: patch
solution: dev-lead
status: done
created: 2026-11-09
branch: patch/0294-rule-form-after-failed-green
commit: <hash>
---

# Patch 0294 — un olvido de orden o de búsqueda se comprueba con su orden

Validación: agente, «Perfil delegate» con `validation.mode: field` — solo cambia la constitution y una ADR: no hay nada que una persona observe que el conteo de palabras y los checks no midan.

## Capacidades

- Ninguna, porque ninguna capacidad describe el Art. II de la constitution.

## 1. Síntoma

Fila 0294 del roadmap y deuda «Una regla que no entra con texto se reescribe en vez de cambiar de forma»: dos features reescribieron en prosa una regla que una orden podía comprobar. El Art. II dice que la forma sigue al fallo, pero no qué hacer tras un GREEN fallido.

Medido en los tickets antes de escribir, los dos casos son el mismo fallo:

- Feature 0186, ticket §2: regla de orden «antes del primer `task start`» en el paso, el grafo y un red flag → `n1` 0/4; con la CLI rechazando, 2/2 (walkthrough de la 0186, «Task 2 insuficiente»). 5,20 $ y una parada.
- Feature 0281, ticket §1: regla de búsqueda reescrita dos veces → `co6` 1/2 y 1/2; con la orden y su `grep`, 2/2, y 4/4 con `final/` (`tests/coherence-pass-0281-green.md`). 1,62 $.

Ninguno sale con ruling.

## 2. Solución fijada

Dev-lead, en la petición: «Art. II: un olvido de orden o de búsqueda que tiene una orden delante se comprueba con esa orden antes de reescribir el texto. Se sustituye una frase del artículo, sin añadir otra al lado; cuál se sustituye queda por confirmar en el diseño», «La frase nueva cabe en una viñeta y nombra la orden («con esa orden delante», como el grep de la 0281 o la CLI de la 0186)», «Si el Art. II cambia su porqué, va una ADR nueva que sustituye a la 0003».

Comprobado lo que da por existente: el Art. II tiene cinco viñetas (disciplina, forma, elemento omitido, condicional, excepción con contraejemplo) y existen las ADR 0003 y 0014.

## 3. Fix

- **Fichero(s)**: `.docs/sdd/constitution.md`, `.docs/sdd/decisions/0025-command-checks-order-and-search.md` (nueva), `.docs/sdd/decisions/0003-form-follows-failure.md` (solo `status`)
- **Cambio**: la viñeta «Elemento omitido» pasa a nombrar los dos olvidos en su definición («cumple, pero falta una pieza del output o un paso de orden o búsqueda») con su forma: hueco en la plantilla, no prosa al lado; con una orden delante (CLI, `grep`), esa orden, antes de reescribir texto. El porqué deja de decir «forma distinta de texto» y se acorta; la ADR 0025 sustituye a la 0003.
- **Decisiones**:
  - La frase sustituida es la viñeta «Elemento omitido»: los dos casos son olvidos, y es la frase que no los cubría (ADR 0022, regla 3: se mejora la frase que falla). Conserva su etiqueta, que citan `THIRD_PARTY_NOTICES.md`, `upstream.json` y la batería de `sdd-implement` — sin el dev-lead (delegado: «cuál se sustituye queda por confirmar en el diseño»)
  - El porqué cambia: con la orden como forma, «forma distinta de texto» deja de ser cierto; por eso la ADR 0025 sustituye a la 0003, como fijó el dev-lead — sin el dev-lead (aplicación literal de su decisión)
  - Saldo de palabras 0: la constitution estaba en su tope (2.250) y sigue en 2.250; la viñeta crece lo que baja el porqué. Por eso «de orden o búsqueda» y no «de orden o de búsqueda» — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | El Art. II dice que un olvido de orden o de búsqueda con una orden delante se comprueba con esa orden antes de reescribir el texto | ✅ `constitution.md:33`, leída a mano |
| 2 | El Art. II sigue con cinco viñetas | ✅ conteo con Node: `viñetas 5` |
| 3 | La constitution cabe en su tope de palabras | ✅ `split(/\s+/)` → 2.250 de 2.250; `moon run cli:test -- test/kit/word-budget.test.ts` → 78 passed (78) |
| 4 | `sdd decision check` y el check del roadmap | ✅ `Decisiones válidas`; `moon run kit:roadmap cli:typecheck` → 2 completed |
| 5 | Pre-commit en verde (`git config core.hooksPath` → `.githooks`) | ✅ en el commit del fix |

Revisor único (Sonnet, effort medium):

- Important, la viñeta perdía «cumple, pero falta…», el criterio que la separa del fallo de forma: arreglado, la definición vuelve y cubre los dos olvidos.
- Minor, «orden» en dos sentidos: rechazado, es el término del dev-lead en la petición, y «(CLI, `grep`)» dice cuál es la orden comando.
- Minor, la 0025 no recogía todo lo de la 0003: arreglado; nombra el caso de la task 0060, mantiene sus consecuencias y su Confirmación.
- Minor, la fila de deuda de `roadmap.md:641` cita la ADR 0003: se deja, el enlace resuelve y la fila es el registro de un hallazgo con su fecha.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-09T12:37Z
- Esfuerzo real:
- Coste de sujetos: no aplica
