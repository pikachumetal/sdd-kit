---
id: 20261102-160110-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, `aviso-cierre` solo dice qué se cierra. Con esto dirá además qué filas del roadmap siguen abiertas: al cerrar la 0010 dirá «Se cierra: 0010 Motivo al cancelar. Queda pendiente: 0011 Anular reservas de otros, 1 Avisos por correo antes de la reserva.», y si no queda ninguna, «No queda nada pendiente.». Se cambia una frase del paso 1 de `skills/aviso-cierre/SKILL.md`, y como es una skill, con sujetos: RED antes, GREEN después.

Validación: dev-lead — es el texto que lee una persona al cerrar, y en duda va a dev-lead.

## Capacidades

- Ninguna, porque herramientas (la skill `aviso-cierre` no es comportamiento del producto; `capabilities/` está vacío: `Sin capacidades`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna de las 8 (sin delta, sin contrato, sin datos; área leída: la skill entera, 12 líneas) · tamaño: ~3 líneas en 1 fichero de skill (+ 1 caso en la batería)
- Mínimo razonable: ninguna — deja sin mirar solo el repaso de coherencia que ya he hecho yo; no hay otro nivel por debajo.

1. «Pendiente» = las filas de `## Próximo` de `.docs/sdd/roadmap.md` con estado ⏳, menos la que se cierra. El ticket dice «una fila abierta» y no dice de qué tabla; `Backlog` (ideas sin planificar) y `Deuda técnica` no cuentan.
2. Texto del aviso, literal: `Se cierra: <id> <título>. Queda pendiente: <id> <título>, <id> <título>.` y, sin filas: `No queda nada pendiente.` Nadie dijo el texto; el título es el de la columna «Ítem» sin las negritas ni la descripción tras los dos puntos.
3. Sigue siendo el paso 1 (una sola frase de aviso, no un paso nuevo): el paso 2 (correr el gate) no cambia.
4. Capacidades: «Ninguna, porque herramientas»; los escenarios van en «Dónde se prueba», sin delta.
5. Caso nuevo `c3` en `tests/batteries/aviso-cierre/battery.md` (cierre con filas ⏳ abiertas, n=2, sonnet): el RED mide c3; `c1` y `c2` son controles.
6. Previsión de coste: 12 sujetos, 0,70 $ cada uno (el precio de `tech-stack.md`, aunque el patch 0006 midió ~0,31 $ por sujeto), ~6 min por sujeto; todo suposición mía, ver la tabla.
7. Prueba del delta en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` → «Sin delta que fusionar» (coherente con la decisión 4).
8. No existe fila 0028 en `roadmap.md`: la spec no salda ninguna fila; no la creo (es del roadmap).
- Política de modelos (solo en `delegate`): revisores de la spec: ninguno · sujetos: Sonnet, por tandas · ejes de la revisión final y otros despachos: según el plan · en paralelo hasta `control.maxParallelAgents` — esta línea es la confirmación de paralelizar para los sujetos de cada tanda.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente, por el ticket `.docs/sdd/field-reports/20260914-aviso.md` §1 — decidido con el dev-lead al arrancar (no tengo su frase literal: lo trasladó la petición de abrir esta spec).
- El RED aún no se ha medido — dicho por el dev-lead al arrancar.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta (ticket de campo 20260914, §1); coste: una parada del dev-lead. Se quiere que el aviso de cierre diga también qué queda pendiente. Éxito: ante un cierre con filas ⏳ abiertas, el aviso nombra todas por id y título; fracaso aunque «funcione»: nombrar como pendiente la fila que se cierra, una de `Backlog`, o decir «nada pendiente» habiendo filas ⏳.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md`; el caso `c3` en `tests/batteries/aviso-cierre/battery.md`; el RED/GREEN con sujetos.
- No entra: el paso 2 (gate); `roadmap.md` y sus filas; listar `Backlog` o `Deuda técnica`; cualquier otra skill; `src/`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Frase «Di qué se cierra.» del paso 1 | `skills/aviso-cierre/SKILL.md:8` | Scope: se reescribe con la decisión 2 |
| Nombre `aviso-cierre` | `.docs/sdd/tech-stack.md:6` (precio por sujeto), `tests/batteries/aviso-cierre/battery.md`, patch 0006 | Sin cambio: el nombre no cambia; la batería recibe `c3` (Scope) |

- Filas que implementa: nada: comprobado con `grep -rn "0028"` (solo la rama y esta spec) y sin fila en `roadmap.md`.

## Approach

El paso 1 pasa de «Di qué se cierra.» a decir qué se cierra y qué queda pendiente, con las dos reglas de las decisiones 1 y 2. La redacción exacta es del plan; se fija con el RED.

## Dónde se prueba

- Cierre con pendientes: con sujetos, batería `aviso-cierre`, caso `c3` — roadmap con 0010, 0011 y 1 en ⏳ y B1 en Backlog; se cierra la 0010; el aviso nombra «0011 Anular reservas de otros» y «1 Avisos por correo antes de la reserva», no la 0010 como pendiente y no B1.
- Cierre sin pendientes: en `c3` (variante n=2 con solo la 0010 ⏳) — el aviso dice «No queda nada pendiente.».
- Sin regresión: `c1` y `c2` como controles.

## Términos y ADR

- Términos resueltos: pendiente — fila ⏳ de `## Próximo`, distinta de la que se cierra.
- ADR candidatas: ninguna

## Previsión de coste

Constitución art. 5: si la prueba supera la suma, una tanda de REFACTOR incluida, se para y decide el dev-lead. Precio: 0,70 $ por sujeto (`tech-stack.md`, «porque cierra una feature entera»); ~6 min por sujeto (suposición, el patch 0006 no midió minutos).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 2 (`c3`) · ~12 min | 1,40 |
| GREEN | 2 (`c3`) · ~12 min | 1,40 |
| Una tanda de REFACTOR | 2 (`c3`) · ~12 min | 1,40 |
| Controles | 4 (`c1`, `c2`) · ~24 min | 2,80 |
| Medición tras la revisión final | 2 (`c3`) · ~12 min | 1,40 |
| Suma | 12 sujetos · ~72 min | 8,40 |

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
