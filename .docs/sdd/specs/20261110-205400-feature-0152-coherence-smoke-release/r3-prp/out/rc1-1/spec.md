---
id: 20261012-090000-feature-0031-close-notice-row
feature: 0031
title: El aviso de cierre nombra la fila que queda abierta
mode: full
profile: delegate
status: draft
created: 2026-10-12
author: agente con el dev-lead
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre nombra la fila que queda abierta

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Enfoque: una frase en el paso 1, frente a un paso nuevo entre los dos (ver Approach).
4. Rúbrica de `c1` con dos filas: `` `text: /pendiente.*0011/` `` y `` `text: /0011.*Anular reservas de otros/` ``. Una sola palabra («pendiente») pasaría sin id ni título. Las filas se añaden a la batería en la Task del RED; hoy `battery.md` solo tiene la tabla de escenarios.
5. El escenario declara en su GIVEN que la 0011 es la única fila abierta: la spec no fija un criterio para elegir entre varias (en el roadmap de hoy lo están 0010, 0011 y 0008) y ese caso, igual que el de ninguna fila abierta, queda fuera del Scope.
6. Delta probado en una copia de `.docs/sdd` en una carpeta temporal: `sdd capability merge --path <copia> --artifact spec.md` → `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`, salida 0.
7. Minutos de la previsión: ~4 min por tanda (sujetos en paralelo, cada uno cierra una feature entera). Es una estimación mía, `sin medir`: `estimation.md` no da calibración todavía.
8. Política de modelos: un revisor de la spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería: RED y GREEN de `c1`, N=2, en tandas · en paralelo hasta `control.maxParallelAgents`.

### Review de la spec

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~1 línea en 1 fichero, sin `MODIFIED` ni contrato público
- Un revisor (sonnet), ya hecho: si la fila de rúbrica de `c1` falla sin el id y el título de la 0011, y si la frase del paso 1 cubre el GIVEN del escenario (señal: capacidad nueva)
- Mínimo razonable: ninguna review — deja sin mirar la rúbrica, que es lo que decide si el RED falla por la causa correcta

#### Hallazgos de la review

Sin Críticos: no hay segunda ronda.

1. **Aceptado** — el título podría escribirse sin leer el roadmap → el requisito dice que el título sale del roadmap; un solo escenario, porque la frase es una y un segundo GIVEN duplicaría el coste de la tanda.
2. **Aceptado** — el GIVEN no dice por qué la 0011 → el GIVEN declara que es la única fila abierta (decisión 5).
3. **Aceptado** — «ninguna fila abierta» sin definir → declarado en «No entra».
4. **Aceptado** — `/pendiente/` sola no prueba nada → pasa a `/pendiente.*0011/`; el RED con la skill de hoy debe fallar en las dos filas.
5. **Rechazado** — controles 0 → el RED con la skill de hoy es el control: falla por la causa correcta si las dos filas fallan sin la frase (ver Dónde se prueba).
6. **Aceptado** — faltaban los minutos (constitución 5) → columna añadida, ~4 min por tanda, `sin medir` (decisión 7).
7. **Aceptado** — Approach sin razón frente a la alternativa → razón escrita.
8. **Rechazado** — documentar lo que el aviso hace hoy → la capacidad nace con lo que cambia esta feature; describir el comportamiento previo pide otro escenario con su batería y no es el cambio.
9. **Aceptado** — el delta probado sin comando → comando y resultado en la decisión 6.
10. **Parcial** — `git grep "0031"` no mira el roadmap → ahora se comprueba también en `ROADMAP.md` (sin hits). **Rechazado** el cambio de título: es una fila real de este roadmap, no un dato de un cliente.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta, con el id y el título que tiene en el roadmap.
- No entra: el roadmap; varias filas abiertas a la vez; ninguna fila abierta (la frase habla de «la fila»).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"` en el repo y en `ROADMAP.md`: sin hits

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- B. Un paso nuevo entre los dos — añade un paso a una skill de dos y cambia la numeración del «Corre el gate», sin que el aviso gane nada.
- Elegido: A, porque no mueve la numeración y el aviso ya sale del paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md` (columna Paso: `cierre`), n = 2, con dos filas de rúbrica: `` `text: /pendiente.*0011/` `` falla si el aviso no dice que la 0011 queda pendiente; `` `text: /0011.*Anular reservas de otros/` `` falla si no nombra la fila con su id y su título.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre tras el cual la fila 0011 es la única abierta en el roadmap
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros», con el id y el título tal como están en el roadmap

## Previsión de coste

| Tanda | Sujetos (batería) | $ | min |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | ~4 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | ~4 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED con la skill de hoy es el control | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | 2,80 | ~8 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
