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

Review de spec propuesta: un revisor, más una segunda ronda por un Crítico aceptado — señales: capacidad nueva · tamaño: ~5 líneas en 2 ficheros
- Dominio y técnica (sonnet): si la rúbrica de `c1` discrimina el aviso con la 0011 de uno sin ella (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que la rúbrica pase sin el comportamiento

Política de modelos: revisores en sonnet (la spec no toca reglas de negocio ni roles).
Comprobación del delta sobre una copia: `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`.
Sin medir: nada.

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. La fuente es `ROADMAP.md`, en solo lectura: fila abierta = estado ⏳; el id es la columna `Id` y el título, el texto en negrita de `Tarea`. El formato del aviso es «queda pendiente la <id> — <título>».
4. El paso nuevo solo se garantiza con una fila abierta; con ninguna o con varias, el comportamiento queda sin especificar y fuera de esta feature.
5. El criterio de la prueba: RED 0/2 y GREEN 2/2; un resultado mixto cuenta como no cumplido. El gate de cierre sigue siendo `node --test` entero, que esta feature no toca.
6. La previsión de coste añade minutos: ~5 min por tanda de sujetos (estimación mía; `plan.mjs` solo da dólares).

### Hallazgos de la review

- **Aceptado** (Crítico) — la rúbrica `/pendiente/` pasaba con «no hay nada pendiente» → la fila pasa a `text: /queda pendiente la 0011 — Anular reservas de otros/` y `c1` fija la 0011 abierta en su fixture.
- **Aceptado** (Crítico, en parte) — la batería existe con `c1`, pero sin fila de rúbrica ni fixture → ambas entran en el Scope; el RED con la skill de hoy falla porque el paso 1 no nombra ninguna fila.
- **Aceptado** — faltaban los minutos → decisión 5 y columna en la previsión.
- **Aceptado** — un solo escenario para varios casos → decisión 4: quedan fuera y el Scope lo dice.
- **Aceptado** — la fuente de la fila no estaba dicha → decisión 3.
- **Aceptado** — decisiones del cuerpo sin declarar → decisiones 3 y 4 y alternativa descartada en Approach.
- Segunda ronda, sin Críticos: **Aceptado** — umbral con REFACTOR (4,20 $), rúbrica con la frase entera, criterio RED 0/2 y GREEN 2/2, estructura del roadmap y comportamiento sin especificar con 0 o varias filas, gate `node --test`. **Aceptado** — el caso «la 0011 ya no está abierta» queda sin cubrir. **Rechazado** — separar «Destino» y texto nuevo en la tabla: es la forma que usa el kit.
- **Rechazado** — «Anular» como término dudoso → es el término de `PRODUCT.md` para lo que hace el responsable de sala.
- **Rechazado** — quitar el `git grep` de «filas que implementa» → es la comprobación que exige el kit y no tiene fila propia.
- **Aceptado** — umbral de parada → línea bajo la previsión.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta, leída de `ROADMAP.md`; y en `tests/batteries/aviso-cierre/battery.md`, la fila de rúbrica de `c1` y su fixture con la 0011 abierta.
- No entra: editar el roadmap; el aviso sin fila abierta o con varias.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.
- Descartado: un paso 2 nuevo solo para la fila abierta — duplicaría el aviso en dos pasos.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con la fila de rúbrica `` `text: /queda pendiente la 0011 — Anular reservas de otros/` ``: falla si el aviso del sujeto no dice esa frase. Criterio: RED 0/2, GREEN 2/2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre con la fila 0011 abierta en el roadmap
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | min | $ |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | ~5 | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | ~5 | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | ~10 | 2,80 |

Umbral de parada: 4,20 $ (2,80 $ más una tanda de REFACTOR de 1,40 $, como pide la constitución); si la prueba lo supera, se para y decide el dev-lead.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
