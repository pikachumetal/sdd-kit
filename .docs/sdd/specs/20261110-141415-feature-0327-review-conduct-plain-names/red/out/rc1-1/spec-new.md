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
3. Enfoque: una frase en el paso 1, frente a añadir un paso 2 nuevo (ver Approach).
4. Política de modelos: spec de una sola frase, sin reglas de negocio → un revisor en Sonnet, sin segunda ronda salvo Crítico.
5. Coherencia: el título de la 0011 en el roadmap es «Anular reservas de otros»; el ejemplo decía «Responsables de sala» y lo he corregido en la 🦆 y en el THEN. Delta probado en una copia: `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`.
7. Formato literal del aviso: «queda pendiente la <id> — <título>» (raya larga, id antes que título).
6. Abierto, sin decidir: el roadmap tiene hoy tres filas abiertas (0010, 0011 y la 1) y la spec habla de «la fila». Ver la pregunta del gate.

### Hallazgos de la review

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva · tamaño: ~5 líneas en 2 ficheros. Mínimo razonable: el mismo.

1. **Aceptado** (Crítico) — con tres filas abiertas la spec no dice cuál nombrar → queda como pregunta al dev-lead en el gate; los escenarios de varias filas y de ninguna se escriben con su respuesta, y entonces va la segunda ronda de review.
2. **Aceptado** (Crítico) — el GIVEN no dice de dónde sale la fila → «abierta» es una fila de la tabla «Próximo» de `.docs/sdd/roadmap.md` con estado ⏳; el GIVEN lo dice.
3. **Rechazado** — falta línea base / MODIFIED → no existe `capabilities/`; la capacidad nace con esta spec (el merge en copia la creó) y el paso 1 vive en la skill, no en una capacidad.
4. **Aceptado** — `/pendiente/` es débil → la rúbrica comprueba `0011` y `Anular reservas de otros`.
5. **Aceptado** — cito la fila: `| 0011 | **Anular reservas de otros** … | ⏳ |` del roadmap.
6. **Aceptado** — la batería entra en la tabla de cambios.
7. **Aceptado** — faltan minutos → añadidos como `sin medir`.
8. **Aceptado** — el formato literal del aviso pasa a ✋ (decisión 7).
9. **Rechazado** — las cinco reglas: no aplica, el aviso no guarda datos nuevos; el límite de varias filas es el hallazgo 1.
10. **Rechazado** — aprueba el dev-lead en el gate; no hay fila 0031 en el roadmap (`git grep "0031"` sin hits fuera de la spec).

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- Entra: la fila de rúbrica de `c1` en `tests/batteries/aviso-cierre/battery.md` (hoy la batería no trae rúbricas).
- No entra: el roadmap.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Fila de rúbrica de `c1` | `tests/batteries/aviso-cierre/battery.md` | Scope: se añade |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con la fila de rúbrica `` `text: /pendiente.*0011.*Anular reservas de otros/` ``: falla si el aviso del sujeto no dice «pendiente», la 0011 y su título.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre y la fila 0011 en la tabla «Próximo» de `.docs/sdd/roadmap.md` con estado ⏳ (`| 0011 | **Anular reservas de otros** … | ⏳ |`)
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Minutos | sin medir | — |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 4 sujetos | 2,80 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
