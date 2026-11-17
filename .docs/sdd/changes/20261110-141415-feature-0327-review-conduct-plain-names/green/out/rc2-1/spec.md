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

Review de spec propuesta: un revisor — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~15 líneas en 2 ficheros (`skills/aviso-cierre/SKILL.md` y la capacidad)
- Dominio y técnica (sonnet, siete puntos): si el THEN del único escenario lo cubre `C1-A`, y si «Falla si `text: /pendiente/`» de la rúbrica deja el RED en rojo con la skill de hoy (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar que la rúbrica de `c1` y el THEN digan lo mismo, el hueco que gasta 4 sujetos (2,80 $) antes de verse

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Enfoque: una frase en el paso 1, frente a un paso nuevo entre el 1 y el 2 (ver Approach).
4. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «aviso-cierre.md: añadido «El aviso nombra la fila abierta»»; el repo no cambia.
5. Rúbrica `C1-A` (ya en el commit `67c9cb3`): dice «Falla si `text: /pendiente/`», y el THEN pide que el aviso contenga «pendiente». Si «Falla si» se lee literal, la rúbrica falla justo con la respuesta correcta y el RED con la skill de hoy (sin «pendiente») pasaría. `sin medir`: no he corrido sujetos; hay que confirmarlo contra la convención de la batería antes del RED.
6. Previsión de minutos (la constitución pide sujetos, minutos y dólares): `sin medir`, no hay medida de minutos por sujeto en el proyecto.
7. Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: sujetos de `c1`, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: `C1-A` dice «Falla si `text: /pendiente/`» y el THEN pide «pendiente»; leída literal, falla con la respuesta correcta → la decisión 5 lo declara abierto y lo paso a tu validación: ninguna doc del kit define «Falla si», así que no lo he resuelto yo. La rúbrica está en el commit `67c9cb3`: cambiarla es una edición de `tests/batteries/aviso-cierre/battery.md` fuera del Scope, y solo la hago con tu OK (en ese caso entra en el Scope).
- **Aceptado** — Crítico: `/pendiente/` pasaría con la palabra sin la 0011 ni el título → si apruebas cambiar la rúbrica, exigirá id y título («queda pendiente la 0011 — …»).
- **Rechazado** — Crítico: segundo escenario con otra fila (0042) → un tercer sujeto por tanda sube el coste sin cubrir un comportamiento nuevo; el fixture del roadmap del sujeto (una fila abierta distinta de la que se cierra) se declara en el plan, no aquí.
- **Aceptado** — Importante: casos sin fila abierta y con varias → pasan a «No entra» del Scope.
- **Aceptado** — Importante: `c2` sin rúbrica ni mención → pasa a «No entra» del Scope (la spec solo corre `c1`).
- **Aceptado** — Importante: `plan.mjs` sin ejecutar → ejecutado: `suma: 2 sujetos · coste previsto: 1.40 $`, como dice la previsión.
- **Rechazado** — Importante: «Mínimo razonable: sin revisor» contradice «un revisor» → es el formato de la rúbrica del kit (lo que se dejaría sin cubrir), no una segunda decisión.
- **Rechazado** — Importante: `aviso-cierre` oculta un `MODIFIED` → no hay `capabilities/`; la capacidad nace con este solo requisito y el delta pasó el `capability merge` como `añadido`; el comportamiento previo vive en la skill, no en una capacidad.
- **Rechazado** — Importante: minutos `sin medir` → no hay medida de minutos en el proyecto; queda declarado `sin medir` en la decisión 6.
- **Rechazado** — Menor: 0005 y 0011 como datos reales → son filas de tu propio roadmap, no datos de un tercero.
- **Rechazado** — Menor: decisión 4 sin ejecutar → sí se ejecutó, sobre la copia, con exit 0.

Segunda ronda (un revisor sonnet; sin tercera ronda):

- **Aceptado** — Crítico: la rúbrica abierta no debe pasar a aprobada → la spec solo se aprueba sabiendo que el RED no arranca hasta que decidas la rúbrica (ver el gate); propuesta: «Falla si» = no contiene `/pendiente.*0011.*Anular reservas/`, con `battery.md` dentro del Scope.
- **Aceptado** — Crítico: THEN y rúbrica dicen cosas distintas → mismo cambio de rúbrica; sin él, el THEN no lo comprueba nadie.
- **Aceptado** — Importante: tras corregir la rúbrica puede repetirse una tanda → nueva fila en la previsión de coste.
- **Rechazado** — Importante: fixture, GIVEN con otra fila → el GIVEN ya dice «un cierre con la fila 0011 abierta»; el fixture es del plan, y el sujeto no puede copiar un valor que solo está en el roadmap de la prueba.
- **Rechazado** — Importante: 0 o varias filas abiertas indefinidos → están en «No entra» a propósito (la 0031 es el caso de una fila); abrir otra fila es decisión tuya, la apunto como pregunta en el gate.
- **Rechazado** — Importante: requisito base «el aviso nombra qué se cierra» → no cambia: es el paso de hoy y el spec no lo toca.
- **Rechazado** — Importante, Menores: «sin revisor» ya contestado; minutos ya `sin medir` (decisión 6); «Filas que implementa: nada» es cierto (la 0031 no tiene fila en el roadmap); la decisión 4 es un hecho comprobado y se queda como nota.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- No entra: el roadmap (el paso lo lee, no lo modifica); el aviso cuando no queda ninguna fila abierta o quedan varias; el escenario `c2` de la batería.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2.

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

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Tanda repetida si cambia la rúbrica | `SCENARIOS="c1" N=2 …` → 2 sujetos · 1.40 $; se pasa de la previsión solo si falla otra vez: ahí se para y decide el dev-lead | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 6 sujetos (4 si la rúbrica no cambia) | 4,20 (2,80) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
