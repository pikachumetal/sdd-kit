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

```text
Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~15 líneas en 2 ficheros
- Dominio+técnica (sonnet): si el escenario de la 0011 y la rúbrica de `c1` fallan sin la frase (señal: capacidad nueva)
- Mínimo razonable: ese mismo — deja sin cubrir nada más a este tamaño
Segunda ronda: un revisor (sonnet), por un Crítico aceptado.
```

Política de modelos: sujetos en Sonnet (`operations.md`); revisores en Sonnet (no toca reglas de negocio ni roles).

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Formato del aviso: «queda pendiente la 0011 — Anular reservas de otros», es decir «queda pendiente la» + id de 4 dígitos + « — » + título literal de la fila.
3b. «Abierta» = fila del `ROADMAP.md` del proyecto con estado ⏳ (así figura la 0011), sin contar la fila de la feature que se cierra. La skill lo lee, solo lectura.
3c. Fuera de esta feature: ninguna fila abierta, varias abiertas y `ROADMAP.md` ausente. Se dejan sin escenario ni batería: la constitución (5) pide sujetos para cada comportamiento y aquí se paga uno solo. Si los quieres, va otra feature.
4. Validación con n = 2 sujetos en `c1`; sin control: el RED corre con la skill de hoy, que ya no dice la frase.
5. Tiempo: sin medir (no hay medida de minutos por sujeto de `aviso-cierre` en `operations.md`); se mide en el RED y se anota en el plan.
6. Enfoque: una frase en el paso 1, frente a añadir un paso 2 nuevo (ver Approach).

### Hallazgos de la review

- **Aceptado** — La rúbrica `/pendiente/` pasa sin nombrar fila → la rúbrica pasa a `` `text: /queda pendiente la 0011 — Anular reservas de otros/` ``.
- **Aceptado** — `c1` no declara cómo recibe el roadmap → Scope y «Dónde se prueba» declaran el fixture: `ROADMAP.md` con la 0011 abierta.
- **Aceptado** — Faltan «ninguna» y «varias» filas abiertas → dos escenarios nuevos en el delta.
- **Aceptado** — Decisiones sueltas en el cuerpo → pasan a ✋ (3, 4, 5, 6).
- **Aceptado** — El paso 1 lee el roadmap sin declararlo → decisión 3 y Scope.
- **Aceptado** — Minutos ausentes de la previsión → columna «min» con `sin medir` (decisión 5).
- **Aceptado** — Destino «Scope» no es destino → «se sustituye por…».
- **Rechazado** — `aviso-cierre` no puede ser Nueva / ADDED modifica algo → no hay `capabilities/` (comprobado) y la copia de `capability merge` lo añade sin rechazo; «di qué se cierra» queda en la skill, no se declara aquí.
- **Rechazado** — Título «Anular reservas de otros» no usa el glosario → es el título literal de la fila 0011 del roadmap y el aviso debe citarlo tal cual.
- **Rechazado** — Controles: 0 sin justificar → se justifica en la decisión 4.
- **Aceptado** — `c2` y `operations.md` sin explicar → Scope lo explica.

Segunda ronda (un revisor, sonnet):

- **Aceptado** (Crítico) — Escenarios «ninguna» y «varias» sin batería → quitados del delta; fuera de la feature (decisión 3c).
- **Aceptado** (Crítico) — «Abierta» sin definir → decisión 3b: estado ⏳ del `ROADMAP.md`.
- **Aceptado** — La fila que se cierra no cuenta como pendiente → decisión 3b.
- **Aceptado** — La rúbrica pasaba con texto suelto → exige la frase completa.
- **Aceptado** — Decisión 3 agrupaba cuatro → partida en 3, 3b, 3c; fixture local a `c1`; alternativa descartada descrita.
- **Rechazado** — Minutos `sin medir` → no hay medida previa; se mide en el RED y, si supera lo previsto, se para (constitución 5). Lo señalo para que lo valides.
- **Rechazado** — Declarar «di qué se cierra» como ADDED → ya lo hace la skill y no cambia; la rúbrica de `c1` no lo cubre porque no es lo que se edita.
- **Rechazado** — Mover el historial de review a Enmiendas → es el sitio que fija el kit (Hallazgos dentro de ✋).

Coherencia: `capability merge` sobre una copia de `.docs/sdd` → «aviso-cierre.md: añadido «El aviso nombra la fila abierta»»; `plan.mjs` confirma 2 sujetos · 1,40 $; `git grep 0031` fuera de las evidencias: sin hits.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- Entra: en `tests/batteries/aviso-cierre/battery.md`, la fila de rúbrica `` `text: /queda pendiente la 0011 — Anular reservas de otros/` `` y el fixture de `c1` (local a `c1`; `c2` no lo hereda): un `ROADMAP.md` con la 0011 en ⏳ (hoy la batería no tiene rúbrica ni fixture).
- No entra: editar el roadmap; la skill solo lo lee. `c2` (otro caso de cierre, no toca el aviso) y `.docs/sdd/steering/operations.md` (solo cita el coste de un sujeto, que no cambia).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: se sustituye por «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Descartado: un paso 2 nuevo solo para el aviso, que parte en dos lo que hoy es una frase.
- Elegido: una frase en el paso 1. El título se cita literal del roadmap («Anular reservas de otros»), no se corrige al glosario.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con el fixture de la 0011 abierta y la fila de rúbrica `` `text: /queda pendiente la 0011 — Anular reservas de otros/` ``: falla si el aviso no nombra la fila con id y título.

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

| Tanda | Sujetos (batería) | $ | min |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | sin medir |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | sin medir |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | 2,80 | sin medir |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
